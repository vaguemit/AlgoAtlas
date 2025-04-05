"use client";

import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      // Load user metadata
      setDisplayName(user.user_metadata?.full_name || '');
    }
  }, [user, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSaveLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName }
      });
      
      if (error) throw error;
      
      setMessageType('success');
      setMessage('Profile updated successfully');
    } catch (error: any) {
      setMessageType('error');
      setMessage(`Error updating profile: ${error.message}`);
    } finally {
      setSaveLoading(false);
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
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          {message && (
            <div 
              className={`p-4 mb-6 rounded-md ${
                messageType === 'error' ? 'bg-red-900/50 border border-red-500' : 'bg-green-900/50 border border-green-500'
              }`}
            >
              {message}
            </div>
          )}
          
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-navy-900 border border-purple-500/20 rounded-md text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <p className="px-3 py-2 bg-navy-900/50 border border-purple-500/20 rounded-md text-white/70">
                  {user.email} 
                  <span className="text-xs ml-2 text-purple-400">
                    (Cannot be changed)
                  </span>
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition"
                >
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Management</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-purple-400">Change Password</h3>
                <p className="text-sm text-white/70 mb-3">
                  Request a password reset link to be sent to your email address.
                </p>
                <button 
                  onClick={async () => {
                    try {
                      const { error } = await supabase.auth.resetPasswordForEmail(
                        user.email || '',
                        { redirectTo: `${window.location.origin}/reset-password` }
                      );
                      
                      if (error) throw error;
                      
                      setMessageType('success');
                      setMessage('Password reset link sent to your email');
                    } catch (error: any) {
                      setMessageType('error');
                      setMessage(`Error: ${error.message}`);
                    }
                  }}
                  className="px-4 py-2 bg-navy-800 text-white rounded-md border border-purple-500/20 hover:bg-navy-700 transition"
                >
                  Send Password Reset Link
                </button>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-medium text-red-400">Delete Account</h3>
                <p className="text-sm text-white/70 mb-3">
                  Permanently delete your account and all of your data.
                </p>
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      // Implement account deletion logic
                      alert('Account deletion is not implemented in this demo version.');
                    }
                  }}
                  className="px-4 py-2 bg-red-900/50 text-white rounded-md border border-red-500/30 hover:bg-red-800/70 transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
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