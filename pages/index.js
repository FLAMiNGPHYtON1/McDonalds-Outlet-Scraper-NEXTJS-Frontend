import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { API_BASE_URL, API_ENDPOINTS } from '../variables';

// Dynamically import the map component to avoid SSR issues
const OutletMap = dynamic(() => import("../components/OutletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-800">Loading map...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [outlets, setOutlets] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRescraping, setIsRescraping] = useState(false);
  const [isFetchingOutlets, setIsFetchingOutlets] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 3.1390, lng: 101.6869 });

  // State for AI Search
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [searchError, setSearchError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a search term.');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.scrapeAndSave}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              search_term: searchTerm,
              overwrite_existing: false 
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        
        alert(`Scraping process for "${searchTerm}" started successfully! The data will be updated shortly.`);
        await fetchOutlets(); // Refresh outlets
    } catch (e) {
        setError(e.message);
        alert(`An error occurred: ${e.message}`);
    } finally {
        setIsSearching(false);
    }
  };

  const handleAISearch = async () => {
    if (!aiSearchQuery.trim()) {
      alert('Please enter a question to ask the AI.');
      return;
    }

    setIsSearchingAI(true);
    setAiResponse('');
    setSearchError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.aiSearch}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query: aiSearchQuery }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAiResponse(result.response);

    } catch (e) {
      setSearchError(e.message);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleRescrape = async () => {
    if (!confirm('Are you sure you want to delete all outlets and start a new scrape? This action cannot be undone.')) {
        return;
    }

    setIsRescraping(true);
    setError(null);

    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.deleteAllOutlets}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        alert(result.message);
        setOutlets([]); // Clear existing outlets from view
    } catch (e) {
        setError(e.message);
        alert(`An error occurred: ${e.message}`);
    } finally {
        setIsRescraping(false);
    }
  };

  const fetchOutlets = async () => {
    setIsFetchingOutlets(true);
    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.outlets}?per_page=1000`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOutlets(data.outlets);
    } catch (e) {
        setError(e.message);
    } finally {
        setIsFetchingOutlets(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  McDonald&apos;s Outlet Locators
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find McDonald&apos;s Outlets Near You
            </h2>
            <p className="text-gray-800 text-lg">
              Use the AI-powered search to ask questions about outlets, or explore locations on the interactive map below.
            </p>
          </div>
        </div>

        {/* AI Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            AI-Powered Search
          </h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={aiSearchQuery}
              onChange={(e) => setAiSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
              placeholder="Ask a question, e.g., 'Which outlets have a drive-thru?'"
              className="flex-grow p-3 border text-black border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              onClick={handleAISearch}
              disabled={isSearchingAI}
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSearchingAI ? 'Thinking...' : 'Ask AI'}
            </button>
          </div>
          {isSearchingAI && (
            <div className="mt-4 text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">The AI is thinking... please wait.</p>
            </div>
          )}
          {searchError && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p><span className="font-bold">Error:</span> {searchError}</p>
            </div>
          )}
          {aiResponse && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-800 whitespace-pre-wrap">{aiResponse}</p>
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Scraping Controls
          </h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter a location to scrape (e.g., &quot;Kuala Lumpur&quot;)"
              className="flex-grow p-3 border text-black border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || isRescraping}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? 'Scraping...' : 'Search & Scrape'}
            </button>
            <button
              onClick={handleRescrape}
              disabled={isSearching || isRescraping}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isRescraping ? 'Deleting...' : 'Delete All & Rescrape'}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">An error occurred:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {isFetchingOutlets && (
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-800">Loading outlets, please wait...</p>
          </div>
        )}

        {/* Map and Outlet List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Outlet List */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-lg p-4 overflow-y-auto h-[70vh]">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 sticky top-0 bg-white pb-3 border-b">
              Available Outlets ({outlets.length})
            </h3>
            {outlets.length > 0 ? (
              <ul className="space-y-4">
                {outlets.map((outlet, index) => (
                  <li 
                    key={index} 
                    className="p-4 border rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => setMapCenter({ lat: outlet.latitude, lng: outlet.longitude })}
                  >
                    <p className="font-bold text-lg text-gray-800">{outlet.name}</p>
                    <p className="text-sm text-gray-600">{outlet.address}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <span>Lat: {outlet.latitude.toFixed(4)}</span> | <span>Lng: {outlet.longitude.toFixed(4)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 mt-4 text-center">No outlets found. Try scraping a new location.</p>
            )}
          </div>

          {/* Map */}
          <div className="md:col-span-2 rounded-lg shadow-lg overflow-hidden h-[70vh]">
            <OutletMap outlets={outlets} center={mapCenter} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-800">
            <p>&copy; 2024 McDonald&apos;s Outlet Application. Built with Next.js.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
