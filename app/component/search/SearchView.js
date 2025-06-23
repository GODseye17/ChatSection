// app/component/search/SearchView.js - COMPLETE UPDATED FILE
import React, { useEffect, useState } from 'react';
import { Search, Sparkles, Filter, TrendingUp, Clock, Star, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import FilterPanel from './FilterPanel';
import { cn } from '@/app/lib/utils';

export default function SearchView({ 
  searchQuery, 
  setSearchQuery, 
  selectedSource, 
  setSelectedSource, 
  handleFetchArticles, 
  loading,
  showFilters,
  setShowFilters,
  // Multi-topic props
  useMultiTopic,
  setUseMultiTopic,
  topics,
  setTopics,
  operator,
  setOperator
}) {
  const [isTyping, setIsTyping] = useState(false);
  const [filters, setFilters] = useState({
    publication_date: '',
    custom_start_date: '',
    custom_end_date: '',
    article_types: [],
    languages: ['english'],
    species: ['humans'],
    sex: [],
    age_groups: [],
    other_filters: [],
    custom_filters: '',
    sort_by: 'relevance',
    search_field: 'title/abstract'
  });

  // Build clean filters
  const buildCleanFilters = () => {
    const cleanFilters = {};
    
    if (filters.publication_date && filters.publication_date.trim()) {
      cleanFilters.publication_date = filters.publication_date;
    }
    
    if (filters.custom_start_date && filters.custom_start_date.trim()) {
      cleanFilters.custom_start_date = filters.custom_start_date;
    }
    
    if (filters.custom_end_date && filters.custom_end_date.trim()) {
      cleanFilters.custom_end_date = filters.custom_end_date;
    }
    
    if (filters.sort_by && filters.sort_by.trim() && filters.sort_by !== 'relevance') {
      cleanFilters.sort_by = filters.sort_by;
    }
    
    if (filters.search_field && filters.search_field.trim() && filters.search_field !== 'title/abstract') {
      cleanFilters.search_field = filters.search_field;
    }
    
    if (filters.article_types && filters.article_types.length > 0) {
      cleanFilters.article_types = filters.article_types;
    }
    
    if (filters.languages && filters.languages.length > 0 && 
        !(filters.languages.length === 1 && filters.languages[0] === 'english')) {
      cleanFilters.languages = filters.languages;
    }
    
    if (filters.species && filters.species.length > 0 && 
        !(filters.species.length === 1 && filters.species[0] === 'humans')) {
      cleanFilters.species = filters.species;
    }
    
    if (filters.sex && filters.sex.length > 0) {
      cleanFilters.sex = filters.sex;
    }
    
    if (filters.age_groups && filters.age_groups.length > 0) {
      cleanFilters.age_groups = filters.age_groups;
    }
    
    if (filters.other_filters && filters.other_filters.length > 0) {
      cleanFilters.other_filters = filters.other_filters;
    }
    
    if (filters.custom_filters && filters.custom_filters.trim()) {
      cleanFilters.custom_filters = [filters.custom_filters.trim()];
    }
    
    return Object.keys(cleanFilters).length > 0 ? cleanFilters : null;
  };

  const handleSearch = () => {
    const cleanFilters = buildCleanFilters();
    handleFetchArticles(cleanFilters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !useMultiTopic) {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    // Create elegant animated background
    const createBackground = () => {
      const container = document.querySelector('.search-background');
      if (!container) return;

      container.innerHTML = '';

      // Create floating orbs
      for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        orb.className = 'floating-orb';
        orb.style.left = `${Math.random() * 100}%`;
        orb.style.top = `${Math.random() * 100}%`;
        orb.style.animationDelay = `${Math.random() * 10}s`;
        orb.style.animationDuration = `${20 + Math.random() * 10}s`;
        container.appendChild(orb);
      }
    };

    createBackground();
  }, []);

  // Count active filters
  const activeFilterCount = () => {
    let count = 0;
    if (filters.publication_date && filters.publication_date !== '') count++;
    if (filters.article_types && filters.article_types.length > 0) count++;
    if (filters.languages && filters.languages.length > 0 && 
        !(filters.languages.length === 1 && filters.languages[0] === 'english')) count++;
    if (filters.species && filters.species.length > 0 && 
        !(filters.species.length === 1 && filters.species[0] === 'humans')) count++;
    if (filters.sex && filters.sex.length > 0) count++;
    if (filters.age_groups && filters.age_groups.length > 0) count++;
    if (filters.other_filters && filters.other_filters.length > 0) count++;
    if (filters.sort_by && filters.sort_by !== 'relevance') count++;
    if (filters.search_field && filters.search_field !== 'title/abstract') count++;
    if (filters.custom_filters && filters.custom_filters.trim()) count++;
    return count;
  };

  // Trending topics
  const trendingTopics = [
    { label: "COVID-19 Long Term Effects", icon: TrendingUp },
    { label: "AI in Medical Diagnosis", icon: Zap },
    { label: "Gene Therapy Advances", icon: Star },
    { label: "Mental Health Treatments", icon: Clock }
  ];

  // Recent searches (could be from localStorage in real app)
  const recentSearches = [
    "diabetes prevention strategies",
    "cancer immunotherapy",
    "alzheimer's disease biomarkers"
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gray-950">
      {/* Light mode dot pattern */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(105, 91, 91, 0.3) 1px, transparent 1.5px)',
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Dark mode dot pattern */}
      <div 
        className="fixed inset-0 pointer-events-none hidden dark:hidden"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Animated background effects */}
      <div className="search-background fixed inset-0 overflow-hidden pointer-events-none">
        {/* Additional floating particles */}
        <div className="absolute inset-0 opacity-30">
          {/* This will be populated by the useEffect */}
        </div>
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-950/10 to-gray-900/20 dark: block hidden" />
      </div>
      
      {/* Main content */}
      <div className="flex-1 relative z-10">
        <div className="min-h-full p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-7xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-8 sm:mb-12 animate-in fade-in duration-700">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600/10 rounded-full mb-4 sm:mb-6 border border-purple-600/20">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                <span className="text-xs sm:text-sm font-medium text-purple-300">AI-Powered Medical Research</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Vivum Research
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
                Discover insights from millions of medical papers instantly
              </p>
            </div>

            {/* Search Section */}
            <div className="max-w-4xl mx-auto mb-8 sm:mb-12 animate-in slide-in-from-bottom-5 duration-700">
              <div className="space-y-4 sm:space-y-6">
                {/* Enhanced Search Container with New Responsive Design */}
                <div className="relative bg-gray-900/70 backdrop-blur-xl border border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-purple-500 transition-all shadow-2xl">
                  
                  {/* Main Search Input Area */}
                  <div className="flex items-center gap-3 p-3 sm:p-4">
                    {/* Search Icon - Aligned with text */}
                    <div className="flex-shrink-0 text-gray-400">
                      <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    
                    {/* Search Input */}
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsTyping(true);
                        setTimeout(() => setIsTyping(false), 100);
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Search medical research..."
                      className="flex-1 bg-transparent text-white placeholder-gray-400 text-base sm:text-lg focus:outline-none border-0"
                    />
                    
                    {/* Search Button - Smaller and responsive */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={handleSearch}
                        disabled={loading || (!searchQuery.trim() && !useMultiTopic)}
                        className={cn(
                          "search-button group relative overflow-hidden",
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl",
                          "font-semibold transition-all duration-300 ease-in-out",
                          "flex items-center justify-center",
                          "transform hover:scale-105 active:scale-95",
                          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                          "focus:ring-offset-gray-900 dark:focus:ring-offset-gray-950",
                          // Theme-aware styles
                          !loading && searchQuery.trim() ? [
                            "bg-white text-purple-600 hover:bg-purple-50",
                            "shadow-lg hover:shadow-xl border-2 border-purple-500",
                            "dark:bg-gray-800 dark:text-purple-400",
                            "dark:hover:bg-purple-900/20 dark:border-purple-400"
                          ] : [
                            "opacity-50 cursor-not-allowed bg-gray-600 text-gray-400",
                            "dark:bg-gray-700 dark:text-gray-500"
                          ]
                        )}
                      >
                        {/* Background animation overlay for loading */}
                        {loading && (
                          <>
                            {/* Spinning background */}
                            <div className="absolute inset-0 rounded-lg sm:rounded-xl">
                              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 opacity-20 animate-spin"></div>
                            </div>
                            
                            {/* Pulsing overlay */}
                            <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-purple-500 dark:bg-purple-400 animate-pulse opacity-10"></div>
                          </>
                        )}
                        
                        {/* Hover effect shimmer */}
                        {!loading && searchQuery.trim() && (
                          <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-transparent via-purple-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                        )}
                        
                        {/* Button content */}
                        <div className="relative z-10 flex items-center justify-center">
                          {loading ? (
                            <div className="flex items-center justify-center">
                              {/* Enhanced loading spinner */}
                              <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                                {/* Outer ring */}
                                <div className="absolute inset-0 border-2 border-purple-200 dark:border-purple-700 rounded-full opacity-30"></div>
                                
                                {/* Main spinning ring */}
                                <div className="absolute inset-0 border-2 border-transparent border-t-purple-600 dark:border-t-purple-400 border-r-purple-600 dark:border-r-purple-400 rounded-full animate-spin"></div>
                                
                                {/* Inner spinning dot */}
                                <div className="absolute top-1/2 left-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2">
                                  <div className="absolute inset-0 bg-purple-600 dark:bg-purple-400 rounded-full animate-ping"></div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <svg 
                              className="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 group-hover:-translate-y-0.5" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2.5} 
                                d="M5 10l7-7m0 0l7 7m-7-7v18" 
                              />
                            </svg>
                          )}
                        </div>
                        
                        {/* Success ripple effect */}
                        <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-green-500 opacity-0 scale-0 transition-all duration-500 group-active:opacity-20 group-active:scale-110"></div>
                      </button>
                      
                      {/* Loading status text */}
                      {loading && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <span className="text-xs text-purple-400 dark:text-purple-300 font-medium animate-pulse">
                            Searching...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Controls Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 pt-0 sm:pt-0 border-t border-gray-700/50 gap-3 sm:gap-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        size="sm"
                        className={cn(
                          "gap-2 border-gray-600 text-gray-300 hover:bg-gray-700 text-xs sm:text-sm",
                          showFilters && "border-purple-500 bg-purple-500/10 text-purple-400"
                        )}
                      >
                        <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Filters</span>
                        {activeFilterCount() > 0 && (
                          <Badge variant="secondary" className="ml-1 bg-purple-600 text-white text-xs">
                            {activeFilterCount()}
                          </Badge>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => setUseMultiTopic(!useMultiTopic)}
                        size="sm"
                        className={cn(
                          "gap-2 border-gray-600 text-gray-400 hover:bg-gray-700 text-xs sm:text-sm",
                          useMultiTopic && "border-purple-500 bg-purple-500/10 text-purple-400"
                        )}
                      >
                        <span className="hidden xs:inline">Advanced</span>
                        <span className="xs:hidden">Adv</span>
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                      {isTyping ? (
                        <span className="text-purple-400">Typing...</span>
                      ) : (
                        <span>{searchQuery.length} characters</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Boolean Search Mode */}
                {useMultiTopic && (
                  <Card className="mt-4 p-4 sm:p-6 bg-gray-900/50 backdrop-blur-xl border-gray-800 animate-in slide-in-from-top-3">
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">Advanced Search</h3>
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-gray-400">Combine with:</span>
                        {['AND', 'OR', 'NOT'].map(op => (
                          <button
                            key={op}
                            onClick={() => setOperator(op)}
                            className={cn(
                              "px-3 py-1 text-sm rounded-lg transition-all",
                              operator === op
                                ? "bg-purple-600 text-white"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                            )}
                          >
                            {op}
                          </button>
                        ))}
                      </div>
                      
                      {topics.map((topic, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={topic}
                            onChange={(e) => {
                              const newTopics = [...topics];
                              newTopics[index] = e.target.value;
                              setTopics(newTopics);
                            }}
                            placeholder={`Term ${index + 1}`}
                            className="flex-1 px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                          />
                          {topics.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setTopics(topics.filter((_, i) => i !== index))}
                              className="text-gray-400 hover:text-white"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTopics([...topics, ''])}
                        disabled={topics.length >= 5}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Add Term
                      </Button>
                    </div>
                  </Card>
                )}
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="max-w-4xl mx-auto mb-6 sm:mb-8 animate-in slide-in-from-top-3 duration-300">
                  <FilterPanel 
                    filters={filters}
                    setFilters={setFilters}
                    selectedSource={selectedSource}
                  />
                </div>
              )}

              {/* Trending & Recent */}
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                {/* Trending Topics */}
                <Card className="p-4 sm:p-6 bg-gray-900/30 backdrop-blur border-gray-800">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Trending Research
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {trendingTopics.map((topic, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSearchQuery(topic.label)}
                        className="w-full flex items-center gap-3 p-2 sm:p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all text-left group"
                      >
                        <topic.icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 group-hover:text-purple-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-300 group-hover:text-gray-100">
                          {topic.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Recent Searches */}
                <Card className="p-4 sm:p-6 bg-gray-900/30 backdrop-blur border-gray-800">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Recent Searches
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSearchQuery(search)}
                        className="w-full flex items-center gap-3 p-2 sm:p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all text-left group"
                      >
                        <div className="w-2 h-2 bg-gray-600 rounded-full group-hover:bg-purple-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-300 group-hover:text-gray-100">
                          {search}
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}