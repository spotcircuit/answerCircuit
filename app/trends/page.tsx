'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingTopics, enrichContentWithAI } from '@/lib/api';
import { searchTrendsWithPerplexity, extractTrendingTopics } from '@/lib/perplexitySearch';
import { useNotifications } from '@/context/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faChartLine, 
  faRobot,
  faFilter,
  faSyncAlt,
  faLightbulb,
  faSearch,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import TrendingWidget from '@/components/ui/TrendingWidget';
import { useSettings } from '@/context/SettingsContext';

export default function TrendsPage() {
  const { addNotification } = useNotifications();
  const { settings } = useSettings();
  const [source, setSource] = useState<'all' | 'reddit' | 'quora'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  
  // Add states for Perplexity search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [perplexityTopics, setPerplexityTopics] = useState<any[]>([]);
  const [showPerplexityResults, setShowPerplexityResults] = useState(false);
  
  // Fetch trending topics
  const { 
    data: trendingTopics = [], 
    isLoading: isLoadingTrending,
    error: trendingError,
    refetch
  } = useQuery({
    queryKey: ['trending-topics'],
    queryFn: fetchTrendingTopics,
    onError: () => {
      addNotification({
        type: 'error',
        message: 'Failed to load trending topics. Please try again later.',
      });
    },
  });
  
  // Filter trending topics by source
  const filteredTopics = showPerplexityResults 
    ? perplexityTopics.filter(topic => source === 'all' || topic.source === source)
    : trendingTopics.filter(topic => source === 'all' || topic.source === source);
  
  // Simulate refreshing trending topics
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      addNotification({
        type: 'success',
        message: 'Trending topics refreshed successfully!',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to refresh trending topics. Please try again later.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Simulate generating AI insights from trending topics
  const handleGenerateInsights = async () => {
    if (!settings.apiKeys.preplexityAI) {
      addNotification({
        type: 'warning',
        message: 'Please add a Preplexity AI API key in Settings to use this feature.',
      });
      return;
    }
    
    setIsLoadingInsights(true);
    setAiInsights(null);
    
    try {
      // In a real app, we would pass the trending topics to the AI service
      // Here we'll simulate a response after a delay
      const topicTitles = trendingTopics.map(topic => topic.title).join(', ');
      const result = await enrichContentWithAI(topicTitles);
      
      // Simulated AI response
      setAiInsights(result || `Based on current trending topics, there's significant interest in AI-powered content creation tools and FAQ optimization techniques. This represents an opportunity to create content that addresses how businesses can leverage automation for content creation while maintaining quality. Consider exploring how FAQ optimization impacts SEO performance and user experience, as this appears to be a growing area of interest across platforms.`);
      
      addNotification({
        type: 'success',
        message: 'AI insights generated successfully!',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to generate AI insights. Please try again later.',
      });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // Handle Perplexity search
  const handlePerplexitySearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      setSearchResults(null);
      setPerplexityTopics([]);
      
      // Search using Perplexity
      const results = await searchTrendsWithPerplexity(searchQuery);
      
      console.log('Perplexity search results:', results);
      
      // Set the API response for display
      setSearchResults(results);
      
      // Extract trending topics from results
      const topics = extractTrendingTopics(results, searchQuery);
      setPerplexityTopics(topics);
      setShowPerplexityResults(true);
      
      setIsSearching(false);
    } catch (error) {
      console.error('Error searching with Perplexity:', error);
      addNotification({
        type: 'error',
        message: 'Failed to search for trends. Please try again.',
      });
      setIsSearching(false);
    }
  };
  
  // Clear search results and go back to default trending topics
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setPerplexityTopics([]);
    setShowPerplexityResults(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trending Topics</h1>
        <p className="text-gray-600">Discover what's trending on Quora and Reddit to inform your content strategy.</p>
      </div>
      
      {/* Perplexity Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Search for Trends with Perplexity AI</h2>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search for trending topics (e.g., 'AI tools', 'content marketing')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isSearching}
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePerplexitySearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
              disabled={isSearching || !searchQuery.trim()}
            >
              <FontAwesomeIcon 
                icon={isSearching ? faSpinner : faSearch} 
                className={`mr-2 ${isSearching ? 'animate-spin' : ''}`} 
              />
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            {showPerplexityResults && (
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center justify-center"
                onClick={clearSearch}
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Clear
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={source}
                onChange={(e) => setSource(e.target.value as 'all' | 'reddit' | 'quora')}
              >
                <option value="all">All Sources</option>
                <option value="reddit">Reddit Only</option>
                <option value="quora">Quora Only</option>
              </select>
            </div>
          </div>
          
          <div>
            <button
              onClick={handleRefresh}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
              disabled={isRefreshing}
            >
              <FontAwesomeIcon 
                icon={isRefreshing ? faSpinner : faSyncAlt} 
                className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
              />
              {isRefreshing ? 'Refreshing...' : 'Refresh Trends'}
            </button>
          </div>
          
          <div>
            <button
              onClick={handleGenerateInsights}
              className="w-full md:w-auto px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center"
              disabled={isLoadingInsights}
            >
              <FontAwesomeIcon 
                icon={isLoadingInsights ? faSpinner : faRobot} 
                className={`mr-2 ${isLoadingInsights ? 'animate-spin' : ''}`} 
              />
              {isLoadingInsights ? 'Generating...' : 'Generate AI Insights'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Results Display */}
      {showPerplexityResults && searchResults && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Perplexity Search Results</h2>
          <p className="text-sm text-gray-500 mb-4">
            Search query: "{searchQuery}"
          </p>
          
          {/* Display raw answer */}
          {searchResults.answer && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">AI Response:</h3>
              <div className="text-sm whitespace-pre-line">
                {searchResults.answer.text}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Trending Topics Display */}
          {isLoadingTrending && !showPerplexityResults ? (
            <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="text-blue-500 mr-2 animate-spin" />
              <span>Loading trending topics...</span>
            </div>
          ) : isSearching ? (
            <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="text-blue-500 mr-2 animate-spin" />
              <span>Searching with Perplexity...</span>
            </div>
          ) : trendingError && !showPerplexityResults ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-red-500">
              Failed to load trending topics. Please try again later.
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center py-12">
              <p className="text-gray-500 mb-2">No trending topics found matching your criteria.</p>
              <p className="text-gray-500">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faChartLine} className="text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">
                  {showPerplexityResults ? 'Perplexity Search Results: ' : ''}
                  {source === 'all' ? 'All Platforms' : source === 'reddit' ? 'Reddit' : 'Quora'} Trending Topics
                </h2>
              </div>
              <div className="space-y-6">
                {filteredTopics.map((topic, index) => (
                  <div key={`topic-${index}`} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-lg">{topic.title}</h3>
                        <p className="text-gray-600 mt-1">{topic.description}</p>
                        <div className="flex items-center mt-2 text-sm">
                          <span className="text-gray-500">{topic.source}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-gray-500">Popularity: {topic.popularity}</span>
                        </div>
                      </div>
                      <a 
                        href={topic.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-4 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          {/* AI Insights Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500 mr-2" />
              <h2 className="text-xl font-semibold">AI Insights</h2>
            </div>
            
            {isLoadingInsights ? (
              <div className="flex justify-center items-center py-8">
                <FontAwesomeIcon icon={faSpinner} className="text-purple-500 mr-2 animate-spin" />
                <span>Generating insights...</span>
              </div>
            ) : aiInsights ? (
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line">{aiInsights}</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Click "Generate AI Insights" to analyze current trends and get content recommendations.</p>
              </div>
            )}
          </div>
          
          {/* Trending Widget */}
          <TrendingWidget />
        </div>
      </div>
    </div>
  );
}
