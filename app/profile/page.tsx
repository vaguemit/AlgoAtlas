"use client";

import { useState, useEffect, Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Error boundary to catch chunk load errors
class ChunkErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode, fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ChunkErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Dynamically import chart components to avoid chunking issues
const ChartComponent = dynamic(
  () => import('@/components/ChartComponent').then(mod => mod.ChartComponent),
  { ssr: false, loading: () => <div className="h-64 w-full bg-navy-800/50 rounded-lg animate-pulse" /> }
);

// Cache expiration time (in milliseconds) - 6 hours
const CACHE_EXPIRATION = 6 * 60 * 60 * 1000;

interface CodeforcesUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  contribution?: number;
}

interface RatingChange {
  contestId?: string;
  contestName?: string;
  handle?: string;
  rank?: number;
  ratingUpdateTimeSeconds?: number;
  oldRating?: number;
  newRating?: number;
}

interface CachedData {
  timestamp: number;
  profile?: CodeforcesUser;
  history?: RatingChange[];
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // UI state
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [debugMode, setDebugMode] = useState(false);
  const [lastError, setLastError] = useState<any>(null);
  
  // CP profiles state
  const [cfHandle, setCfHandle] = useState('');
  const [cfProfile, setCfProfile] = useState<CodeforcesUser | null>(null);
  const [cfLoading, setCfLoading] = useState(false);
  const [cfHistory, setCfHistory] = useState<RatingChange[]>([]);
  const [showCharts, setShowCharts] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      // Load CP profiles if user is logged in
      loadUserProfile(user.id);
    }
  }, [user, loading, router]);

  // Function to ensure CP tables exist
  const ensureCPTablesExist = async () => {
    try {
      // Call the API route to create CP tables if they don't exist
      const response = await fetch('/api/create-cp-tables');
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error ensuring CP tables exist:', data.error);
      }
    } catch (error) {
      console.error('Failed to check CP tables:', error);
    }
  };

  // New function to efficiently load user profile with caching
  const loadUserProfile = async (userId: string) => {
    setProfileLoading(true);

    // Try loading from localStorage first for instant display
    const cachedData = loadFromCache(userId);
    if (cachedData) {
      // If we have cached data, use it immediately
      if (cachedData.profile) {
        setCfProfile(cachedData.profile);
        setCfHandle(cachedData.profile.handle);
      }
      if (cachedData.history && cachedData.history.length > 0) {
        setCfHistory(cachedData.history);
        setShowCharts(true);
      }

      // If cache is still fresh, we can skip loading from server
      if (Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
        setProfileLoading(false);
        return;
      }
    }

    // Ensure tables exist before querying
    await ensureCPTablesExist();
    
    try {
      // Check if Codeforces profile exists
      const { data: cfData, error: cfError } = await supabase
        .from('codeforces_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (cfError && cfError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is expected if the user doesn't have a profile
        console.error('Error fetching Codeforces profile:', cfError);
      }
      
      if (cfData) {
        const profile = {
          handle: cfData.handle,
          rating: cfData.rating,
          maxRating: cfData.max_rating,
          rank: cfData.rank,
          maxRank: cfData.max_rank,
          contribution: cfData.contribution
        };
        
        setCfProfile(profile);
        setCfHandle(cfData.handle);
        
        // Load rating history from DB first for faster load
        const { data: historyData, error: historyError } = await supabase
          .from('rating_history')
          .select('*')
          .eq('user_id', userId)
          .eq('platform', 'codeforces')
          .order('timestamp', { ascending: true });
          
        if (!historyError && historyData && historyData.length > 0) {
          // Convert DB format to Codeforces API format
          const formattedHistory = historyData.map(entry => ({
            contestId: entry.contest_id,
            contestName: entry.contest_name,
            rank: entry.rank,
            ratingUpdateTimeSeconds: new Date(entry.timestamp).getTime() / 1000,
            newRating: entry.rating,
            // For oldRating, we need to calculate from the previous entry
            oldRating: 0 // Placeholder, will be calculated below
          }));
          
          // Calculate oldRating for each entry
          for (let i = 0; i < formattedHistory.length; i++) {
            if (i === 0) {
              // For the first entry, oldRating is start rating or newRating - some delta
              formattedHistory[i].oldRating = formattedHistory[i].newRating ? 
                formattedHistory[i].newRating - 100 : 1500; // Approximate
            } else {
              // For subsequent entries, oldRating is the previous entry's newRating
              formattedHistory[i].oldRating = formattedHistory[i-1].newRating;
            }
          }
          
          setCfHistory(formattedHistory);
          setShowCharts(true);
          
          // Cache the data
          saveToCache(userId, profile, formattedHistory);
          
          // Check if history is stale (older than 24 hours)
          const lastUpdate = new Date(cfData.last_updated || 0);
          const isStale = Date.now() - lastUpdate.getTime() > 24 * 60 * 60 * 1000;
          
          // If stale, refresh data from Codeforces API in the background
          if (isStale && cfData.handle) {
            refreshCodeforcesData(cfData.handle, userId);
          }
        } else {
          // If no history in DB, load from Codeforces API
          await loadCodeforcesRatingHistory(cfData.handle, false, userId);
        }
      }
    } catch (error) {
      console.error('Error loading CP profiles:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  // New function to refresh data from Codeforces API in the background
  const refreshCodeforcesData = async (handle: string, userId: string) => {
    try {
      // Silently update in the background without showing loading state
      const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
      
      if (response.data.status === 'OK') {
        const history = response.data.result;
        
        // Update state
        setCfHistory(history);
        
        // Update database and cache
        saveBatchRatingHistory(history, userId);
        saveToCache(userId, cfProfile || undefined, history);
        
        // Update last_updated timestamp in profile
        await supabase.from('codeforces_profiles').update({
          last_updated: new Date().toISOString()
        }).eq('id', userId);
      }
    } catch (error) {
      // Silent failure in background refresh
      console.error('Background refresh failed:', error);
    }
  };

  // Cache helper functions
  const saveToCache = (userId: string, profile?: CodeforcesUser, history?: RatingChange[]) => {
    try {
      const cacheData: CachedData = {
        timestamp: Date.now(),
        profile,
        history
      };
      localStorage.setItem(`cf_data_${userId}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  const loadFromCache = (userId: string): CachedData | null => {
    try {
      const cacheData = localStorage.getItem(`cf_data_${userId}`);
      if (cacheData) {
        return JSON.parse(cacheData);
      }
    } catch (error) {
      console.error('Error loading from cache:', error);
    }
    return null;
  };

  // New efficient batch save function
  const saveBatchRatingHistory = async (history: RatingChange[], userId: string) => {
    if (!history.length || !userId) return;
    
    try {
      // Format all entries at once
      const batchEntries = history.map((entry: RatingChange) => ({
        user_id: userId,
        platform: 'codeforces',
        rating: entry.newRating,
        contest_name: entry.contestName,
        contest_id: entry.contestId?.toString(),
        rank: entry.rank,
        timestamp: new Date((entry.ratingUpdateTimeSeconds || 0) * 1000).toISOString()
      }));
      
      // Instead of looping, use a single upsert with onConflict option
      const { error } = await supabase.from('rating_history').upsert(
        batchEntries, 
        { onConflict: 'user_id,platform,contest_id' }
      );
      
      if (error) {
        console.error('Error batch saving rating history:', error);
      }
    } catch (error) {
      console.error('Error in batch save:', error);
    }
  };
  
  // Modified connectCodeforces function to use efficient saving
  const connectCodeforces = async () => {
    if (!cfHandle.trim()) {
      setMessage('Please enter a Codeforces handle');
      setMessageType('error');
      return;
    }
    
    setCfLoading(true);
    setMessage('');
    setLastError(null);
    
    // Try direct API call first, then fallback to proxy if needed
    let useCorsProxy = false;
    
    try {
      // Ensure tables exist before connecting
      await ensureCPTablesExist();
      
      // Fetch user info from Codeforces API
      let response;
      try {
        // Try direct API call first
        response = await axios.get(`https://codeforces.com/api/user.info?handles=${cfHandle}`);
      } catch (directError) {
        console.log('Direct API call failed, trying proxy...');
        // If direct call fails, try using our CORS proxy
        useCorsProxy = true;
        response = await axios.get(`/api/cors-proxy?url=${encodeURIComponent(`https://codeforces.com/api/user.info?handles=${cfHandle}`)}`);
      }
      
      if (response.data.status === 'OK' && response.data.result.length > 0) {
        const cfUser = response.data.result[0];
        
        // Save to Supabase
        try {
          const { error } = await supabase.from('codeforces_profiles').upsert({
            id: user!.id,
            handle: cfUser.handle,
            rating: cfUser.rating || null,
            max_rating: cfUser.maxRating || null,
            rank: cfUser.rank || null,
            max_rank: cfUser.maxRank || null,
            contribution: cfUser.contribution || null,
            last_updated: new Date().toISOString()
          });
          
          if (error) {
            console.error('Database error details:', error);
            throw new Error(`Database error: ${error.message || error.code || 'Unknown database error'}`);
          }
          
          // Update local state
          const profile = {
            handle: cfUser.handle,
            rating: cfUser.rating,
            maxRating: cfUser.maxRating,
            rank: cfUser.rank,
            maxRank: cfUser.maxRank,
            contribution: cfUser.contribution
          };
          
          setCfProfile(profile);
          
          // Fetch rating history
          const history = await loadCodeforcesRatingHistory(cfUser.handle, useCorsProxy, user!.id);
          
          // Cache data
          if (history) {
            saveToCache(user!.id, profile, history);
          }
          
          setMessage('Codeforces profile connected successfully!');
          setMessageType('success');
        } catch (dbError: any) {
          console.error('Database operation failed:', dbError);
          throw new Error(`Failed to save profile: ${dbError.message || 'Database operation failed'}`);
        }
      } else {
        setMessage('Codeforces handle not found');
        setMessageType('error');
      }
    } catch (error: any) {
      console.error('Error connecting Codeforces:', error);
      setLastError(error); // Store the last error for debug mode
      
      // Improved error handling with more specific messages
      let errorMessage = 'Failed to connect to Codeforces';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data && error.response.data.comment) {
          errorMessage = `Codeforces API: ${error.response.data.comment}`;
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid Codeforces handle format';
        } else if (error.response.status === 404) {
          errorMessage = 'Codeforces handle not found';
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from Codeforces API. Please check your internet connection.';
      } else if (error.message) {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }
      
      setMessage(`Error connecting Codeforces profile: ${errorMessage}`);
      setMessageType('error');
    } finally {
      setCfLoading(false);
    }
  };

  // Modified to return history and use efficient batch updates
  const loadCodeforcesRatingHistory = async (handle: string, useCorsProxy = false, userId?: string): Promise<RatingChange[] | null> => {
    try {
      // Fetch rating history from Codeforces API
      let response;
      try {
        // Try direct API call first, unless we already know we need the proxy
        if (!useCorsProxy) {
          response = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
        } else {
          throw new Error('Skip direct call, use proxy');
        }
      } catch (directError) {
        // If direct call fails, try using our CORS proxy
        response = await axios.get(`/api/cors-proxy?url=${encodeURIComponent(`https://codeforces.com/api/user.rating?handle=${handle}`)}`);
      }
      
      if (response.data.status === 'OK') {
        const history = response.data.result;
        setCfHistory(history);
        
        // Save rating history to database in batch
        if (history.length > 0 && userId) {
          await saveBatchRatingHistory(history, userId);
        }
        
        setShowCharts(true);
        return history;
      } else if (response.data.status === 'FAILED') {
        console.error('Codeforces API returned FAILED status:', response.data.comment);
        setMessage(`Codeforces API error: ${response.data.comment}`);
        setMessageType('error');
        return null;
      }
    } catch (error: any) {
      console.error('Error loading Codeforces rating history:', error);
      
      let errorMessage = 'Failed to load rating history';
      
      if (error.response) {
        if (error.response.data && error.response.data.comment) {
          errorMessage = `API: ${error.response.data.comment}`;
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
        
        setMessage(`Error loading rating history: ${errorMessage}`);
        setMessageType('error');
      } else if (error.request) {
        setMessage('No response from Codeforces API. Please check your internet connection.');
        setMessageType('error');
      } else if (error.message && error.message !== 'Skip direct call, use proxy') {
        setMessage(`Error: ${error.message}`);
        setMessageType('error');
      }
    }
    return null;
  };

  const disconnectCodeforces = async () => {
    try {
      const { error } = await supabase
        .from('codeforces_profiles')
        .delete()
        .eq('id', user!.id);
      
      if (error) throw error;
      
      setCfProfile(null);
      setCfHandle('');
      setCfHistory([]);
      setShowCharts(false);
      
      // Clear cache
      try {
        localStorage.removeItem(`cf_data_${user!.id}`);
      } catch (e) {
        console.error('Error clearing cache:', e);
      }
      
      setMessage('Codeforces profile disconnected');
      setMessageType('success');
    } catch (error: any) {
      console.error('Error disconnecting Codeforces:', error);
      setMessage(`Error disconnecting Codeforces: ${error.message}`);
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header - Enhanced */}
          <div className="relative mb-12">
            <div className="h-52 bg-gradient-to-r from-purple-900/60 via-blue-900/40 to-indigo-900/60 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
            </div>
            
            <div className="absolute bottom-0 transform translate-y-1/2 left-8 flex items-end">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-black shadow-lg">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-md opacity-30"></div>
              </div>
              <div className="ml-5 mb-5">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </h1>
                <p className="text-white/70 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {user.email}
                </p>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-8 flex items-center">
              <Link href="/settings" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition duration-200 text-sm font-medium flex items-center mr-2 shadow-lg backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Edit Profile
              </Link>
              <button 
                onClick={() => setDebugMode(!debugMode)}
                className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded backdrop-blur-sm"
              >
                {debugMode ? '🔍 Debug On' : '🔧 Debug'}
              </button>
            </div>
          </div>
          
          {/* Status Messages */}
          {message && (
            <div 
              className={`p-4 mb-6 rounded-md ${
                messageType === 'error' ? 'bg-red-900/50 border border-red-500' : 'bg-green-900/50 border border-green-500'
              }`}
            >
              {message}
              
              {debugMode && lastError && messageType === 'error' && (
                <div className="mt-2 pt-2 border-t border-white/20">
                  <p className="text-xs text-white/70">Debug Information:</p>
                  <pre className="mt-1 text-xs overflow-auto p-2 bg-black/50 rounded max-h-40 text-white/60">
                    {JSON.stringify(lastError, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
          
          {/* Main Page Loading State */}
          {profileLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-purple-400">Loading your profile data...</p>
              <p className="text-white/50 text-sm mt-2">This may take a moment</p>
            </div>
          ) : (
            /* Main Content Area */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left Column - User Info & Stats */}
              <div className="space-y-6">
                {/* Account Information */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Account Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-white/50 mb-1">Email</h3>
                      <p className="text-white">{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white/50 mb-1">Account Created</h3>
                      <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white/50 mb-1">Last Sign In</h3>
                      <p className="text-white">{new Date(user.last_sign_in_at || "").toLocaleDateString()}</p>
                    </div>
                    {debugMode && (
                      <div>
                        <h3 className="text-sm font-medium text-white/50 mb-1">User ID</h3>
                        <p className="text-xs text-white/70 break-all">{user.id}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Activity Summary */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    Activity Summary
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium text-white/50 mb-1">Problems Solved</h3>
                          <p className="text-3xl font-bold text-purple-400">0</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500/20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 2a1 1 0 000 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path fillRule="evenodd" d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </div>
                      <p className="text-xs text-white/50 mt-1">Track your progress</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-blue-500/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium text-white/50 mb-1">Contests Participated</h3>
                          <p className="text-3xl font-bold text-blue-400">{cfHistory.length || 0}</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500/20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <p className="text-xs text-white/50 mt-1">From connected profiles</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-green-500/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium text-white/50 mb-1">Learning Streak</h3>
                          <p className="text-3xl font-bold text-green-400">0</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500/20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-xs text-white/50 mt-1">Days in a row</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Middle & Right Columns - CP Profiles */}
              <div className="lg:col-span-2 space-y-6">
                {/* CP Profile Header */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Competitive Programming
                  </h2>
                  {cfProfile && (
                    <div className="text-sm text-white/70 flex items-center">
                      <span className="mr-2">Last updated:</span>
                      <span className="bg-white/10 px-2 py-1 rounded-full text-xs">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Codeforces Card */}
                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 rounded-xl p-6 border border-purple-500/30 backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-purple-400 flex items-center">
                        <img src="https://codeforces.org/s/0/favicon-32x32.png" alt="Codeforces Logo" className="w-5 h-5 mr-2" />
                        Codeforces
                      </h2>
                      {cfProfile && (
                        <p className="text-white/70 text-sm mt-1">
                          Handle: <span className="font-semibold text-white">{cfProfile.handle}</span>
                        </p>
                      )}
                    </div>
                    
                    {cfProfile && (
                      <div className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium" style={{color: getRatingColor(cfProfile.rating)}}>
                        {cfProfile.rank || 'Unrated'}
                      </div>
                    )}
                  </div>
                  
                  {cfProfile ? (
                    <div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white/5 p-3 rounded-lg">
                          <p className="text-xs text-white/50">Current Rating</p>
                          <p className="text-2xl font-bold" style={{color: getRatingColor(cfProfile.rating)}}>{cfProfile.rating || 'Unrated'}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg">
                          <p className="text-xs text-white/50">Max Rating</p>
                          <p className="text-2xl font-bold" style={{color: getRatingColor(cfProfile.maxRating)}}>{cfProfile.maxRating || 'Unrated'}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg">
                          <p className="text-xs text-white/50">Max Rank</p>
                          <p className="text-lg font-bold text-white">{cfProfile.maxRank || 'Unrated'}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg">
                          <p className="text-xs text-white/50">Contests</p>
                          <p className="text-lg font-bold text-white">{cfHistory.length}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between">
                        <a 
                          href={`https://codeforces.com/profile/${cfProfile.handle}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm bg-purple-800/30 hover:bg-purple-800/50 px-4 py-2 rounded-md text-white flex items-center transition-colors"
                        >
                          View Profile
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                        <button 
                          onClick={disconnectCodeforces}
                          className="text-sm bg-red-900/30 hover:bg-red-900/50 px-4 py-2 rounded-md text-white flex items-center transition-colors"
                        >
                          Disconnect
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="bg-white/5 p-6 rounded-lg border border-purple-500/20">
                        <h3 className="text-md font-medium mb-4">Connect Your Codeforces Account</h3>
                        <p className="text-sm text-white/70 mb-6">Link your Codeforces profile to track your competitive programming progress and visualize your rating history.</p>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white/80">Codeforces Handle</label>
                            <div className="relative">
                              <input
                                type="text"
                                value={cfHandle}
                                onChange={(e) => setCfHandle(e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-md text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-white/30"
                                placeholder="Enter your Codeforces handle"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={connectCodeforces}
                            disabled={cfLoading}
                            className="w-full px-4 py-3 bg-purple-600/80 hover:bg-purple-600 text-white rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
                          >
                            {cfLoading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Connecting...
                              </>
                            ) : (
                              <>
                                Connect Codeforces
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Rating History Chart */}
                {showCharts && cfHistory.length > 0 ? (
                  <div className="bg-white/5 rounded-xl p-6 border border-purple-500/20 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Rating History
                    </h2>
                    
                    <div className="bg-white/5 p-6 rounded-lg">
                      <div className="h-80 bg-white bg-opacity-95 p-4 rounded-md">
                        <ChunkErrorBoundary fallback={<div className="h-full flex items-center justify-center text-white/50">Error loading chart</div>}>
                          <ChartComponent ratingHistory={cfHistory} />
                        </ChunkErrorBoundary>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-white/50">Total Contests</p>
                        <p className="text-xl font-bold text-white">{cfHistory.length}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-white/50">Initial Rating</p>
                        <p className="text-xl font-bold" style={{color: getRatingColor(cfHistory[0]?.oldRating)}}>{cfHistory[0]?.oldRating || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-white/50">Current Rating</p>
                        <p className="text-xl font-bold" style={{color: getRatingColor(cfHistory[cfHistory.length - 1]?.newRating)}}>{cfHistory[cfHistory.length - 1]?.newRating || 'N/A'}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-white/50">Highest Rating</p>
                        <p className="text-xl font-bold" style={{color: getRatingColor(Math.max(...cfHistory.map(h => h.newRating || 0)))}}>{Math.max(...cfHistory.map(h => h.newRating || 0))}</p>
                      </div>
                    </div>
                    
                    {/* Recent Contest Table */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Recent Contests
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-white/5 text-left">
                              <th className="p-3 text-sm font-medium text-white/70">Contest</th>
                              <th className="p-3 text-sm font-medium text-white/70">Rank</th>
                              <th className="p-3 text-sm font-medium text-white/70">Old Rating</th>
                              <th className="p-3 text-sm font-medium text-white/70">New Rating</th>
                              <th className="p-3 text-sm font-medium text-white/70">Change</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cfHistory.slice(-5).reverse().map((contest, index) => (
                              <tr key={index} className="border-t border-white/5">
                                <td className="p-3 text-sm truncate max-w-[200px]">{contest.contestName}</td>
                                <td className="p-3 text-sm">{contest.rank}</td>
                                <td className="p-3 text-sm" style={{color: getRatingColor(contest.oldRating)}}>{contest.oldRating}</td>
                                <td className="p-3 text-sm" style={{color: getRatingColor(contest.newRating)}}>{contest.newRating}</td>
                                <td className="p-3 text-sm">
                                  <span className={`${(contest.newRating || 0) > (contest.oldRating || 0) ? 'text-green-400' : 'text-red-400'}`}>
                                    {(contest.newRating || 0) > (contest.oldRating || 0) ? '+' : ''}
                                    {((contest.newRating || 0) - (contest.oldRating || 0))}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {cfHistory.length === 0 && (
                              <tr>
                                <td colSpan={5} className="p-4 text-center text-white/50">No contest history available</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : cfProfile ? (
                  <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="rounded-full bg-purple-900/30 p-4 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-center">No Contests Found</h3>
                    <p className="text-white/70 text-center text-sm max-w-md">
                      It looks like you haven't participated in any rated Codeforces contests yet. Participate in a contest to see your rating history here.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          )}
          
          {/* Database Information Section (in debug mode) */}
          {debugMode && (
            <div className="bg-gray-900/70 rounded-xl p-6 border border-yellow-500/30 mb-8 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 text-yellow-400">Database Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">How User Data Is Stored</h3>
                  <div className="bg-black/50 p-4 rounded-md text-sm text-white/70">
                    <p>Your data is stored in multiple linked tables in the Supabase database:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>auth.users</strong>: Core authentication data (email, password, etc.)</li>
                      <li><strong>profiles</strong>: Basic profile information linked to auth.users</li>
                      <li><strong>codeforces_profiles</strong>: Codeforces data linked to your user ID</li>
                      <li><strong>rating_history</strong>: Contest history for connected platforms</li>
                    </ul>
                    <p className="mt-2">Each table has a foreign key relationship to your user ID. CP data is stored separately from login data for better database organization and security.</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">User Identifier</h3>
                  <p className="bg-black/50 p-3 rounded-md text-xs text-white/60 break-all">{user.id}</p>
                  <p className="text-xs text-white/50 mt-1">This UUID connects all your data across different tables</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">Caching Strategy</h3>
                  <div className="bg-black/50 p-4 rounded-md text-sm text-white/70">
                    <p>To improve performance, we use the following strategies:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>LocalStorage Cache</strong>: Profile data is cached locally for 6 hours</li>
                      <li><strong>Background Updates</strong>: Data older than 24h is refreshed in the background</li>
                      <li><strong>Batch Database Operations</strong>: All contest data is saved in a single operation</li>
                      <li><strong>Instant Initial Load</strong>: Shows cached data immediately while fresh data loads</li>
                    </ul>
                    <p className="mt-2 text-xs">Cache expiration: {CACHE_EXPIRATION/1000/60/60} hours</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get color based on Codeforces rating
function getRatingColor(rating?: number): string {
  if (!rating) return '#FFFFFF';
  
  if (rating < 1200) return '#CCCCCC'; // Newbie: Gray
  if (rating < 1400) return '#77FF77'; // Pupil: Green
  if (rating < 1600) return '#77DDBB'; // Specialist: Cyan
  if (rating < 1900) return '#AAAAFF'; // Expert: Blue
  if (rating < 2100) return '#FF88FF'; // Candidate Master: Purple
  if (rating < 2400) return '#FFCC88'; // Master: Orange
  if (rating < 2600) return '#FF7777'; // International Master: Red
  if (rating < 3000) return '#FF3333'; // Grandmaster: Red
  return '#AA0000'; // Legendary Grandmaster: Dark Red
} 