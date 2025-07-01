"use client";

import React, { useState } from 'react';

export default function WaitlistTest() {
  const [name, setName] = useState('Test User');
  const [email, setEmail] = useState('test@example.com');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(5);

  const testDirectApi = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      setResult(data);
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Unknown error');
      }
    } catch (err: any) {
      console.error('Error testing API:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testInitApi = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/waitlist/init', {
        method: 'POST'
      });
      
      const data = await response.json();
      console.log('Init API Response:', data);
      setResult(data);
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Unknown error');
      }
    } catch (err: any) {
      console.error('Error testing init API:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateTestData = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/waitlist/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          operation: 'setup_test_data',
          count: userCount 
        })
      });
      
      const data = await response.json();
      console.log('Test Data Generation Response:', data);
      setResult(data);
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Unknown error');
      }
    } catch (err: any) {
      console.error('Error generating test data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const clearTestData = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/waitlist/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'clear' })
      });
      
      const data = await response.json();
      console.log('Clear Test Data Response:', data);
      setResult(data);
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Unknown error');
      }
    } catch (err: any) {
      console.error('Error clearing test data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Waitlist API Test</h1>
      
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Test Registration API</h2>
        
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <button
          onClick={testDirectApi}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Direct API'}
        </button>
      </div>
      
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Initialize Database</h2>
        <p className="mb-4 text-sm text-gray-600">
          This will attempt to initialize the database schema if it doesn't exist.
        </p>
        
        <button
          onClick={testInitApi}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Initializing...' : 'Initialize Database'}
        </button>
      </div>
      
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Test Data Generation</h2>
        <p className="mb-4 text-sm text-gray-600">
          Generate test users and referrals to populate the waitlist system.
        </p>
        
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Number of Test Users</label>
            <input
              type="number"
              value={userCount}
              onChange={(e) => setUserCount(parseInt(e.target.value) || 5)}
              min="1"
              max="20"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={generateTestData}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Test Data'}
          </button>
          
          <button
            onClick={clearTestData}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Clearing...' : 'Clear Test Data'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-300 rounded">
          <h3 className="font-semibold text-red-700">Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-gray-100 border rounded">
          <h3 className="font-semibold mb-2">API Response:</h3>
          <pre className="whitespace-pre-wrap bg-white p-2 border rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
