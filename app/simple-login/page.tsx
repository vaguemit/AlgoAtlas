"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function SimpleLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already logged in
  const checkUser = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      setUser(data.session.user);
      setMessage('Already logged in as: ' + data.session.user.email);
    }
  };

  // Run on initial load
  useEffect(() => {
    checkUser();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Attempting to log in...');
    
    try {
      console.log("Login attempt with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email, 
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        setMessage('Error: ' + error.message);

        // Check common error cases
        if (error.message.includes('Invalid login credentials')) {
          setMessage('Error: Invalid email or password. If you haven\'t registered yet, please click the Register button.');
        } else if (error.message.includes('Email not confirmed')) {
          setMessage('Error: Please confirm your email before logging in. Check your inbox for a confirmation email.');
        }
      } else if (data.user) {
        console.log("Login successful:", data.user.email);
        setMessage('Success! Logged in as: ' + data.user.email);
        setUser(data.user);
      } else {
        console.log("Login data:", data);
        setMessage('Login response received but no user data. Check console for details.');
      }
    } catch (err: any) {
      console.error("Login exception:", err);
      setMessage('Exception: ' + (err.message || 'Unknown error'));
    }
  };

  const handleGoogleLogin = async () => {
    setMessage('Redirecting to Google...');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: window.location.origin + '/auth/callback'
        }
      });
      
      if (error) {
        setMessage('Google OAuth Error: ' + error.message);
      }
      // If successful, user will be redirected to Google
    } catch (err: any) {
      setMessage('Google Exception: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage('Error signing out: ' + error.message);
    } else {
      setUser(null);
      setMessage('Successfully signed out');
    }
  };

  // Add a function to check and create profiles table
  const checkProfilesTable = async () => {
    setMessage('Checking profiles table...');
    try {
      const response = await fetch('/api/create-profiles-table');
      const data = await response.json();
      setMessage(data.message || 'Profiles table check completed');
    } catch (err: any) {
      setMessage('Failed to check profiles table: ' + (err.message || 'Unknown error'));
    }
  };

  // Add a function to check Supabase connection
  const checkSupabaseConnection = async () => {
    setMessage('Checking Supabase connection...');
    try {
      // Just try to get the session
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setMessage('Supabase connection error: ' + error.message);
      } else {
        setMessage('Supabase connection successful');
      }
    } catch (err: any) {
      setMessage('Failed to connect to Supabase: ' + (err.message || 'Unknown error'));
    }
  };

  // Add a function to directly validate the API key
  const validateApiKey = async () => {
    setMessage('Validating API key...');
    
    // Get the URL and key from environment
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      setMessage('Error: Missing Supabase URL or key in environment variables');
      return;
    }
    
    try {
      // Make a direct fetch to Supabase REST API
      const response = await fetch(`${url}/rest/v1/?apikey=${key}`);
      
      if (response.status === 200) {
        setMessage('API key validation successful!');
      } else {
        const errorText = await response.text();
        setMessage(`API key validation failed: Status ${response.status} - ${errorText}`);
      }
    } catch (err: any) {
      setMessage(`API key validation error: ${err.message}`);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creating account...');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        setMessage('Registration Error: ' + error.message);
      } else {
        setMessage('Registration successful! Check your email for confirmation if required.');
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (err: any) {
      setMessage('Registration Exception: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div style={{padding: "40px", maxWidth: "500px", margin: "0 auto", fontFamily: "Arial", backgroundColor: "#f5f5f5", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"}}>
      <h1 style={{color: "#333", marginBottom: "20px"}}>Simple Supabase Auth Test</h1>
      
      {message && (
        <div style={{
          padding: "12px", 
          border: "1px solid #ccc", 
          margin: "10px 0", 
          backgroundColor: message.includes('Error') || message.includes('Exception') || message.includes('Failed') ? "#ffebee" : "#e8f5e9",
          borderRadius: "4px"
        }}>
          {message}
        </div>
      )}
      
      {user ? (
        <div>
          <h2 style={{fontSize: "18px", marginBottom: "10px"}}>Logged In User</h2>
          <pre style={{background: "#eee", padding: "10px", overflow: "auto", borderRadius: "4px"}}>
            {JSON.stringify(user, null, 2)}
          </pre>
          <button 
            onClick={handleSignOut}
            style={{
              marginTop: "20px", 
              padding: "10px 15px", 
              backgroundColor: "#f44336", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer",
              width: "100%"
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleEmailLogin} style={{display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
              <label style={{fontSize: "14px", fontWeight: "bold"}}>Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{padding: "10px", borderRadius: "4px", border: "1px solid #ddd"}}
              />
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
              <label style={{fontSize: "14px", fontWeight: "bold"}}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={{padding: "10px", borderRadius: "4px", border: "1px solid #ddd"}}
              />
            </div>
            <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
              <button 
                type="submit" 
                style={{
                  padding: "12px", 
                  flex: "1",
                  backgroundColor: "#2196f3", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "4px", 
                  cursor: "pointer"
                }}
              >
                Login
              </button>
              <button 
                type="button"
                onClick={handleRegister}
                style={{
                  padding: "12px", 
                  flex: "1",
                  backgroundColor: "#4caf50", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "4px", 
                  cursor: "pointer"
                }}
              >
                Register
              </button>
            </div>
          </form>
          
          <div style={{textAlign: "center", margin: "20px 0"}}>OR</div>
          
          <button 
            onClick={handleGoogleLogin}
            style={{
              padding: "12px", 
              width: "100%", 
              backgroundColor: "#4285F4", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Login with Google
          </button>
        </>
      )}
      
      <div style={{marginTop: "30px", fontSize: "14px", color: "#666"}}>
        <h3>Debug Tools:</h3>
        <div style={{display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap"}}>
          <button 
            onClick={checkSupabaseConnection}
            style={{
              padding: "8px 12px", 
              backgroundColor: "#9c27b0", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer"
            }}
          >
            Test Supabase Connection
          </button>
          <button 
            onClick={checkProfilesTable}
            style={{
              padding: "8px 12px", 
              backgroundColor: "#ff9800", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer"
            }}
          >
            Check Profiles Table
          </button>
          <button 
            onClick={validateApiKey}
            style={{
              padding: "8px 12px", 
              backgroundColor: "#f44336", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer"
            }}
          >
            Validate API Key
          </button>
        </div>
        
        <h3 style={{marginTop: "20px"}}>Connection Info:</h3>
        <div>Base URL: {typeof window !== 'undefined' ? window.location.origin : ''}</div>
        <div>Callback URL: {typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : ''}</div>
        <div style={{marginTop: "10px"}}>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</div>
        <div>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '******' : 'Not set'}</div>
      </div>
    </div>
  );
} 