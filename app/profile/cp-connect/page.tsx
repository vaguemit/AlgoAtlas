"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

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

export default function CPConnect() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cfHandle, setCfHandle] = useState('');
  const [ccHandle, setCcHandle] = useState('');
  const [cfProfile, setCfProfile] = useState<CodeforcesUser | null>(null);
  const [ccProfile, setCcProfile] = useState<CodeChefUser | null>(null);
  const [cfLoading, setCfLoading] = useState(false);
  const [ccLoading, setCcLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [cfHistory, setCfHistory] = useState<RatingChange[]>([]);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        
        // Load existing CP profiles if any
        await loadCPProfiles(data.session.user.id);
      }
      setLoading(false);
    };
    
    checkUser();
  }, []);

  const loadCPProfiles = async (userId: string) => {
    try {
      // Check if Codeforces profile exists
      const { data: cfData } = await supabase
        .from('codeforces_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
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
      const { data: ccData } = await supabase
        .from('codechef_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
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
      return;
    }
    
    setCfLoading(true);
    setMessage('');
    
    try {
      // Fetch user info from Codeforces API
      const response = await axios.get(`https://codeforces.com/api/user.info?handles=${cfHandle}`);
      
      if (response.data.status === 'OK' && response.data.result.length > 0) {
        const cfUser = response.data.result[0];
        
        // Save to Supabase
        const { error } = await supabase.from('codeforces_profiles').upsert({
          id: user.id,
          handle: cfUser.handle,
          rating: cfUser.rating || null,
          max_rating: cfUser.maxRating || null,
          rank: cfUser.rank || null,
          max_rank: cfUser.maxRank || null,
          contribution: cfUser.contribution || null,
          last_updated: new Date().toISOString()
        });
        
        if (error) {
          throw error;
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
        await loadCodeforcesRatingHistory(cfUser.handle);
        
        setMessage('Codeforces profile connected successfully!');
      } else {
        setMessage('Codeforces handle not found');
      }
    } catch (error: any) {
      console.error('Error connecting Codeforces:', error);
      setMessage(`Error connecting Codeforces profile: ${error.response?.data?.comment || error.message}`);
    } finally {
      setCfLoading(false);
    }
  };

  const connectCodeChef = async () => {
    if (!ccHandle.trim()) {
      setMessage('Please enter a CodeChef handle');
      return;
    }
    
    setCcLoading(true);
    setMessage('');
    
    try {
      // CodeChef doesn't have a public API, so we'll just save the handle
      // and update it if we can later
      const { error } = await supabase.from('codechef_profiles').upsert({
        id: user.id,
        handle: ccHandle,
        last_updated: new Date().toISOString()
      });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setCcProfile({
        handle: ccHandle
      });
      
      setMessage('CodeChef handle saved successfully!');
    } catch (error: any) {
      console.error('Error saving CodeChef handle:', error);
      setMessage(`Error saving CodeChef handle: ${error.message}`);
    } finally {
      setCcLoading(false);
    }
  };

  const loadCodeforcesRatingHistory = async (handle: string) => {
    try {
      // Fetch rating history from Codeforces API
      const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
      
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
            timestamp: new Date(entry.ratingUpdateTimeSeconds * 1000).toISOString()
          }));
          
          // Using upsert to avoid duplicates
          for (const entry of ratingEntries) {
            await supabase.from('rating_history').upsert(entry, {
              onConflict: 'user_id,platform,contest_id'
            });
          }
        }
        
        setShowCharts(true);
      }
    } catch (error) {
      console.error('Error loading Codeforces rating history:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-10 bg-gray-900 rounded-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Authentication Required</h2>
            <p className="mt-2 text-gray-400">You need to be logged in to connect your CP profiles.</p>
            <div className="mt-6">
              <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Competitive Programming Profiles</h1>
          
          {message && (
            <div className={`p-4 mb-6 rounded-md ${message.includes('Error') ? 'bg-red-900/50 border border-red-500' : 'bg-green-900/50 border border-green-500'}`}>
              {message}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Codeforces Section */}
            <div className="bg-gray-900 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Codeforces</h2>
              {cfProfile ? (
                <div>
                  <div className="bg-gray-800 p-4 rounded-md mb-4">
                    <p className="text-lg">Handle: <span className="font-bold">{cfProfile.handle}</span></p>
                    {cfProfile.rating && <p>Current Rating: <span className="font-bold">{cfProfile.rating}</span></p>}
                    {cfProfile.maxRating && <p>Max Rating: <span className="font-bold">{cfProfile.maxRating}</span></p>}
                    {cfProfile.rank && <p>Rank: <span className="font-bold">{cfProfile.rank}</span></p>}
                    {cfProfile.maxRank && <p>Max Rank: <span className="font-bold">{cfProfile.maxRank}</span></p>}
                    {cfProfile.contribution && <p>Contribution: <span className="font-bold">{cfProfile.contribution}</span></p>}
                  </div>
                  <button 
                    onClick={() => setCfProfile(null)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Codeforces Handle</label>
                    <input
                      type="text"
                      value={cfHandle}
                      onChange={(e) => setCfHandle(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                      placeholder="Enter your Codeforces handle"
                    />
                  </div>
                  <button
                    onClick={connectCodeforces}
                    disabled={cfLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {cfLoading ? 'Connecting...' : 'Connect Codeforces'}
                  </button>
                </div>
              )}
            </div>
            
            {/* CodeChef Section */}
            <div className="bg-gray-900 rounded-xl p-6 border border-blue-500/20">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">CodeChef</h2>
              {ccProfile ? (
                <div>
                  <div className="bg-gray-800 p-4 rounded-md mb-4">
                    <p className="text-lg">Handle: <span className="font-bold">{ccProfile.handle}</span></p>
                    {ccProfile.rating && <p>Current Rating: <span className="font-bold">{ccProfile.rating}</span></p>}
                    {ccProfile.maxRating && <p>Max Rating: <span className="font-bold">{ccProfile.maxRating}</span></p>}
                    {ccProfile.stars && <p>Stars: <span className="font-bold">{ccProfile.stars}</span></p>}
                    {ccProfile.countryRank && <p>Country Rank: <span className="font-bold">{ccProfile.countryRank}</span></p>}
                    {ccProfile.globalRank && <p>Global Rank: <span className="font-bold">{ccProfile.globalRank}</span></p>}
                  </div>
                  <button 
                    onClick={() => setCcProfile(null)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">CodeChef Handle</label>
                    <input
                      type="text"
                      value={ccHandle}
                      onChange={(e) => setCcHandle(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                      placeholder="Enter your CodeChef handle"
                    />
                  </div>
                  <button
                    onClick={connectCodeChef}
                    disabled={ccLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {ccLoading ? 'Connecting...' : 'Connect CodeChef'}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Rating History Chart */}
          {showCharts && cfHistory.length > 0 && (
            <div className="mt-12 bg-gray-900 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-2xl font-bold mb-6">Rating History</h2>
              <div className="bg-white p-4 rounded-md">
                <Line 
                  data={formatChartData() || {labels: [], datasets: []}} 
                  options={{
                    responsive: true,
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
              <div className="mt-4 text-sm text-gray-400">
                <p>Total contests: {cfHistory.length}</p>
                {cfHistory.length > 0 && (
                  <>
                    <p>Initial rating: {cfHistory[0].oldRating}</p>
                    <p>Current rating: {cfHistory[cfHistory.length - 1].newRating}</p>
                    <p>Highest rating: {Math.max(...cfHistory.map(h => h.newRating || 0))}</p>
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <Link 
              href="/profile" 
              className="text-blue-400 hover:text-blue-300"
            >
              ← Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 