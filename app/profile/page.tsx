"use client";

import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface CodeforcesUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  contribution?: number;
}

interface CodeChefUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  stars?: string;
  countryRank?: number;
  globalRank?: number;
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
  const [ccHandle, setCcHandle] = useState('');
  const [cfProfile, setCfProfile] = useState<CodeforcesUser | null>(null);
  const [ccProfile, setCcProfile] = useState<CodeChefUser | null>(null);
  const [cfLoading, setCfLoading] = useState(false);
  const [ccLoading, setCcLoading] = useState(false);
  const [cfHistory, setCfHistory] = useState<RatingChange[]>([]);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      // Load CP profiles if user is logged in
      ensureCPTablesExist().then(() => {
        loadCPProfiles(user.id);
      });
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

  const loadCPProfiles = async (userId: string) => {
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
        setCfProfile({
          handle: cfData.handle,
          rating: cfData.rating,
          maxRating: cfData.max_rating,
          rank: cfData.rank,
          maxRank: cfData.max_rank,
          contribution: cfData.contribution
        });
        setCfHandle(cfData.handle);
        
        // Load rating history
        await loadCodeforcesRatingHistory(cfData.handle);
      }
      
      // Check if CodeChef profile exists
      const { data: ccData, error: ccError } = await supabase
        .from('codechef_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (ccError && ccError.code !== 'PGRST116') {
        console.error('Error fetching CodeChef profile:', ccError);
      }
      
      if (ccData) {
        setCcProfile({
          handle: ccData.handle,
          rating: ccData.rating,
          maxRating: ccData.max_rating,
          stars: ccData.stars,
          countryRank: ccData.country_rank,
          globalRank: ccData.global_rank
        });
        setCcHandle(ccData.handle);
      }
    } catch (error) {
      console.error('Error loading CP profiles:', error);
    }
  };

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
          setCfProfile({
            handle: cfUser.handle,
            rating: cfUser.rating,
            maxRating: cfUser.maxRating,
            rank: cfUser.rank,
            maxRank: cfUser.maxRank,
            contribution: cfUser.contribution
          });
          
          // Fetch rating history
          await loadCodeforcesRatingHistory(cfUser.handle, useCorsProxy);
          
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

  const connectCodeChef = async () => {
    if (!ccHandle.trim()) {
      setMessage('Please enter a CodeChef handle');
      setMessageType('error');
      return;
    }
    
    setCcLoading(true);
    setMessage('');
    setLastError(null);
    
    try {
      // Ensure tables exist before connecting
      await ensureCPTablesExist();
      
      // CodeChef doesn't have a public API, so we'll just save the handle
      try {
        const { error } = await supabase.from('codechef_profiles').upsert({
          id: user!.id,
          handle: ccHandle,
          last_updated: new Date().toISOString()
        });
        
        if (error) {
          console.error('Database error details:', error);
          setLastError(error);
          throw new Error(`Database error: ${error.message || error.code || 'Unknown database error'}`);
        }
        
        // Update local state
        setCcProfile({
          handle: ccHandle
        });
        
        setMessage('CodeChef handle saved successfully!');
        setMessageType('success');
      } catch (dbError: any) {
        console.error('Database operation failed:', dbError);
        setLastError(dbError);
        throw new Error(`Failed to save profile: ${dbError.message || 'Database operation failed'}`);
      }
    } catch (error: any) {
      console.error('Error saving CodeChef handle:', error);
      setLastError(error);
      setMessage(`Error saving CodeChef handle: ${error.message || 'Unknown error occurred'}`);
      setMessageType('error');
    } finally {
      setCcLoading(false);
    }
  };

  const loadCodeforcesRatingHistory = async (handle: string, useCorsProxy = false) => {
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
        
        // Save rating history to database
        if (history.length > 0 && user) {
          const ratingEntries = history.map((entry: RatingChange) => ({
            user_id: user.id,
            platform: 'codeforces',
            rating: entry.newRating,
            contest_name: entry.contestName,
            contest_id: entry.contestId?.toString(),
            rank: entry.rank,
            timestamp: new Date((entry.ratingUpdateTimeSeconds || 0) * 1000).toISOString()
          }));
          
          try {
            // Using upsert to avoid duplicates
            for (const entry of ratingEntries) {
              await supabase.from('rating_history').upsert(entry, {
                onConflict: 'user_id,platform,contest_id'
              });
            }
          } catch (dbError) {
            console.error('Error saving rating history to database:', dbError);
            // Continue execution, this is not critical for displaying the chart
          }
        }
        
        setShowCharts(true);
      } else if (response.data.status === 'FAILED') {
        console.error('Codeforces API returned FAILED status:', response.data.comment);
        setMessage(`Codeforces API error: ${response.data.comment}`);
        setMessageType('error');
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
  };

  const formatChartData = () => {
    if (!cfHistory || cfHistory.length === 0) return null;
    
    const sortedHistory = [...cfHistory].sort((a, b) => 
      ((a.ratingUpdateTimeSeconds || 0) - (b.ratingUpdateTimeSeconds || 0))
    );
    
    const labels = sortedHistory.map((entry) => {
      const timestamp = entry.ratingUpdateTimeSeconds || 0;
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
    });
    
    const ratings = sortedHistory.map((entry) => entry.newRating || 0);
    
    return {
      labels,
      datasets: [
        {
          label: 'Codeforces Rating',
          data: ratings,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1
        }
      ]
    };
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
      
      setMessage('Codeforces profile disconnected');
      setMessageType('success');
    } catch (error: any) {
      console.error('Error disconnecting Codeforces:', error);
      setMessage(`Error disconnecting Codeforces: ${error.message}`);
      setMessageType('error');
    }
  };

  const disconnectCodeChef = async () => {
    try {
      const { error } = await supabase
        .from('codechef_profiles')
        .delete()
        .eq('id', user!.id);
      
      if (error) throw error;
      
      setCcProfile(null);
      setCcHandle('');
      
      setMessage('CodeChef profile disconnected');
      setMessageType('success');
    } catch (error: any) {
      console.error('Error disconnecting CodeChef:', error);
      setMessage(`Error disconnecting CodeChef: ${error.message}`);
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
    <div className="min-h-screen bg-black text-white pt-16 pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="relative mb-8">
            <div className="h-48 bg-gradient-to-r from-purple-900/60 to-blue-900/60 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
            </div>
            
            <div className="absolute bottom-0 transform translate-y-1/2 left-8 flex items-end">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-black">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-md opacity-30"></div>
              </div>
              <div className="ml-4 mb-4">
                <h1 className="text-3xl font-bold">{user.user_metadata?.full_name || 'User'}</h1>
                <p className="text-white/70">{user.email}</p>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-8 flex items-center">
              <Link href="/settings" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition duration-200 text-sm font-medium flex items-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Edit Profile
              </Link>
              <button 
                onClick={() => setDebugMode(!debugMode)}
                className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded"
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
          
          {/* Merged Content - Combined View */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Account Information */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 col-span-1">
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
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
                <div>
                  <h3 className="text-sm font-medium text-white/50 mb-1">User ID</h3>
                  <p className="text-xs text-white/70 break-all">{user.id}</p>
                </div>
              </div>
            </div>
            
            {/* Activity Summary */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 col-span-2">
              <h2 className="text-xl font-semibold mb-4">Activity Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-lg p-4 border border-purple-500/20">
                  <h3 className="text-sm font-medium text-white/50 mb-1">Problems Solved</h3>
                  <p className="text-3xl font-bold text-purple-400">0</p>
                  <p className="text-xs text-white/50 mt-1">Track your progress</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-blue-500/20">
                  <h3 className="text-sm font-medium text-white/50 mb-1">Contests Participated</h3>
                  <p className="text-3xl font-bold text-blue-400">{cfHistory.length || 0}</p>
                  <p className="text-xs text-white/50 mt-1">From connected profiles</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-green-500/20">
                  <h3 className="text-sm font-medium text-white/50 mb-1">Learning Streak</h3>
                  <p className="text-3xl font-bold text-green-400">0</p>
                  <p className="text-xs text-white/50 mt-1">Days in a row</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CP Profiles Section */}
          <h2 className="text-2xl font-bold mb-6">Competitive Programming Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Codeforces Card */}
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 rounded-xl p-6 border border-purple-500/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-purple-400">Codeforces</h2>
                  {cfProfile && (
                    <p className="text-white/70 text-sm">
                      Handle: <span className="font-semibold text-white">{cfProfile.handle}</span>
                    </p>
                  )}
                </div>
                <img src="https://codeforces.org/s/0/favicon-96x96.png" alt="Codeforces Logo" className="w-8 h-8" />
              </div>
              
              {cfProfile ? (
                <div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-xs text-white/50">Current Rating</p>
                      <p className="text-2xl font-bold" style={{color: getRatingColor(cfProfile.rating)}}>{cfProfile.rating || 'Unrated'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-xs text-white/50">Max Rating</p>
                      <p className="text-2xl font-bold" style={{color: getRatingColor(cfProfile.maxRating)}}>{cfProfile.maxRating || 'Unrated'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-xs text-white/50">Rank</p>
                      <p className="text-lg font-bold text-white">{cfProfile.rank || 'Unrated'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-xs text-white/50">Contests</p>
                      <p className="text-lg font-bold text-white">{cfHistory.length}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <a 
                      href={`https://codeforces.com/profile/${cfProfile.handle}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      View Profile →
                    </a>
                    <button 
                      onClick={disconnectCodeforces}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-md font-medium mb-2">Connect Your Codeforces Account</h3>
                    <p className="text-sm text-white/70 mb-4">Link your Codeforces profile to track your progress</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white/70">Codeforces Handle</label>
                        <input
                          type="text"
                          value={cfHandle}
                          onChange={(e) => setCfHandle(e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-purple-500/30 rounded-md text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-white/30"
                          placeholder="Enter your Codeforces handle"
                        />
                      </div>
                      <button
                        onClick={connectCodeforces}
                        disabled={cfLoading}
                        className="w-full px-4 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-md transition-colors disabled:opacity-50"
                      >
                        {cfLoading ? 'Connecting...' : 'Connect Codeforces'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* CodeChef Card */}
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 rounded-xl p-6 border border-blue-500/30">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-blue-400">CodeChef</h2>
                  {ccProfile && (
                    <p className="text-white/70 text-sm">
                      Handle: <span className="font-semibold text-white">{ccProfile.handle}</span>
                    </p>
                  )}
                </div>
                <img src="https://cdn.codechef.com/images/favicon-32x32.png" alt="CodeChef Logo" className="w-8 h-8" />
              </div>
              
              {ccProfile ? (
                <div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-xs text-white/50">Current Rating</p>
                      <p className="text-2xl font-bold text-white">{ccProfile.rating || 'Unrated'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-xs text-white/50">Max Rating</p>
                      <p className="text-2xl font-bold text-white">{ccProfile.maxRating || 'Unrated'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-xs text-white/50">Stars</p>
                      <p className="text-lg font-bold text-yellow-400">{ccProfile.stars || 'Unrated'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-xs text-white/50">Global Rank</p>
                      <p className="text-lg font-bold text-white">{ccProfile.globalRank || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <a 
                      href={`https://www.codechef.com/users/${ccProfile.handle}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      View Profile →
                    </a>
                    <button 
                      onClick={disconnectCodeChef}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-md font-medium mb-2">Connect Your CodeChef Account</h3>
                    <p className="text-sm text-white/70 mb-4">Link your CodeChef profile to track your progress</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white/70">CodeChef Handle</label>
                        <input
                          type="text"
                          value={ccHandle}
                          onChange={(e) => setCcHandle(e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-blue-500/30 rounded-md text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-white/30"
                          placeholder="Enter your CodeChef handle"
                        />
                      </div>
                      <button
                        onClick={connectCodeChef}
                        disabled={ccLoading}
                        className="w-full px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50"
                      >
                        {ccLoading ? 'Connecting...' : 'Connect CodeChef'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Rating History Chart */}
          {showCharts && cfHistory.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-purple-500/20 mb-8">
              <h2 className="text-xl font-semibold mb-6">Codeforces Rating History</h2>
              <div className="bg-white/5 p-6 rounded-lg">
                <div className="h-80 bg-white p-4 rounded-md">
                  <Line 
                    data={formatChartData() || {labels: [], datasets: []}} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: true,
                          text: `Codeforces Rating History for ${cfProfile?.handle}`
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: false
                        }
                      }
                    }} 
                  />
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <h3 className="text-lg font-medium mb-4">Recent Contests</h3>
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
                          <td className="p-3 text-sm">{contest.contestName}</td>
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
          )}
          
          {/* Database Information Section (in debug mode) */}
          {debugMode && (
            <div className="bg-gray-900/70 rounded-xl p-6 border border-yellow-500/30 mb-8">
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
                      <li><strong>codechef_profiles</strong>: CodeChef data linked to your user ID</li>
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