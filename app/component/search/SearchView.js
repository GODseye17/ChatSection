// app/component/search/SearchView.js
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
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Elegant animated background */}
      <div className="search-background fixed inset-0 overflow-hidden pointer-events-none opacity-30"></div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="min-h-full p-6 md:p-12">
          <div className="w-full max-w-7xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-12 animate-in fade-in duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 rounded-full mb-6 border border-purple-600/20">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">AI-Powered Medical Research</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Vivum Research
              </h1>
              
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Discover insights from millions of medical papers instantly
              </p>
            </div>

            {/* Search Section */}
            <div className="max-w-4xl mx-auto mb-12 animate-in slide-in-from-bottom-5 duration-700">
              <Card className="p-8 bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl">
                <div className="space-y-6">
                  {/* Search Input */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <Search className="w-5 h-5" />
                    </div>
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
                      className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                          "gap-2",
                          showFilters && "border-purple-600 bg-purple-600/10 text-purple-400"
                        )}
                      >
                        <Filter className="w-4 h-4" />
                        Filters
                        {activeFilterCount() > 0 && (
                          <Badge variant="secondary" className="ml-1 bg-purple-600">
                            {activeFilterCount()}
                          </Badge>
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={() => setUseMultiTopic(!useMultiTopic)}
                        className="gap-2"
                      >
                        Advanced
                      </Button>
                    </div>

                    <Button
                      onClick={handleSearch}
                      disabled={loading || (!searchQuery.trim() && !useMultiTopic)}
                      size="lg"
                      className="gap-2 min-w-[150px] bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                    >
                      <Search className="w-5 h-5" />
                      Search
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Boolean Search Mode */}
              {useMultiTopic && (
                <Card className="mt-4 p-6 bg-gray-900/50 backdrop-blur-xl border-gray-800 animate-in slide-in-from-top-3">
                  <h3 className="text-lg font-semibold mb-4">Advanced Search</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
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
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {topics.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTopics(topics.filter((_, i) => i !== index))}
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
                    >
                      Add Term
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="max-w-4xl mx-auto mb-8 animate-in slide-in-from-top-3 duration-300">
                <FilterPanel 
                  filters={filters}
                  setFilters={setFilters}
                  selectedSource={selectedSource}
                />
              </div>
            )}

            {/* Trending & Recent */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Trending Topics */}
              <Card className="p-6 bg-gray-900/30 backdrop-blur border-gray-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Trending Research
                </h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(topic.label)}
                      className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all text-left group"
                    >
                      <topic.icon className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
                      <span className="text-sm text-gray-300 group-hover:text-gray-100">
                        {topic.label}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Recent Searches */}
              <Card className="p-6 bg-gray-900/30 backdrop-blur border-gray-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Recent Searches
                </h3>
                <div className="space-y-3">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(search)}
                      className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all text-left group"
                    >
                      <div className="w-2 h-2 bg-gray-600 rounded-full group-hover:bg-purple-400" />
                      <span className="text-sm text-gray-300 group-hover:text-gray-100">
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
  );
}