// app/component/search/SearchView.js
import React, { useEffect, useState } from 'react';
import { Search, Sparkles, Filter, TrendingUp, Clock, Star, Zap, ChevronRight } from 'lucide-react';
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

  // Professional trending topics with real medical research examples
  const trendingTopics = [
    { 
      label: "Long COVID neurological effects", 
      icon: TrendingUp,
      description: "Latest research on persistent neurological symptoms"
    },
    { 
      label: "mRNA vaccine mechanisms", 
      icon: Zap,
      description: "Understanding how mRNA vaccines work"
    },
    { 
      label: "AI in medical diagnosis", 
      icon: Star,
      description: "Machine learning applications in healthcare"
    },
    { 
      label: "CRISPR gene therapy advances", 
      icon: Clock,
      description: "Recent breakthroughs in gene editing"
    }
  ];

  // Professional recent searches
  const recentSearches = [
    {
      query: "diabetes prevention strategies",
      description: "Type 2 diabetes prevention methods",
      time: "2 hours ago"
    },
    {
      query: "cancer immunotherapy",
      description: "Immune system cancer treatments",
      time: "1 day ago"
    },
    {
      query: "alzheimer's disease biomarkers",
      description: "Early detection markers for dementia",
      time: "3 days ago"
    }
  ];

  return (
    <div className={cn(
      "h-[calc(100vh-4rem)] flex flex-col overflow-hidden transition-all duration-300",
      "bg-gradient-to-b from-gray-950 to-gray-900",
      "dark:from-gray-950 dark:to-gray-900"
    )}>
      {/* Professional animated background */}
      <div className="search-background fixed inset-0 overflow-hidden pointer-events-none opacity-30"></div>
      
      {/* Main content with professional spacing */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="min-h-full p-6 md:p-12">
          <div className="w-full max-w-6xl mx-auto">
            
            {/* Professional Hero Section */}
            <div className={cn(
              "text-center mb-16 animate-in fade-in duration-700",
              "transform transition-all duration-500"
            )}>
              {/* Professional badge */}
              <div className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border transition-all duration-300",
                "bg-purple-600/10 border-purple-600/20 dark:bg-purple-600/10 dark:border-purple-600/20",
                "[data-theme='light'] &:bg-blue-600/10 [data-theme='light'] &:border-blue-600/20",
                "hover:scale-105 transform"
              )}>
                <Sparkles className={cn(
                  "w-4 h-4 transition-colors duration-300",
                  "text-purple-400 dark:text-purple-400",
                  "[data-theme='light'] &:text-blue-500"
                )} />
                <span className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  "text-purple-300 dark:text-purple-300",
                  "[data-theme='light'] &:text-blue-600"
                )}>
                  AI-Powered Medical Research
                </span>
              </div>
              
              {/* Professional main title */}
              <h1 className={cn(
                "text-5xl md:text-7xl font-bold mb-6 transition-all duration-500",
                "bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent",
                "dark:from-white dark:to-gray-400",
                "[data-theme='light'] &:from-gray-900 [data-theme='light'] &:to-gray-600",
                "hover:scale-105 transform",
                "leading-tight tracking-tight"
              )}>
                Vivum Research
              </h1>
              
              {/* Professional tagline */}
              <p className={cn(
                "text-xl md:text-2xl max-w-3xl mx-auto transition-colors duration-300 leading-relaxed",
                "text-gray-400 dark:text-gray-400",
                "[data-theme='light'] &:text-gray-600",
                "font-light"
              )}>
                Discover insights from millions of medical papers instantly
              </p>
            </div>

            {/* Professional Search Section */}
            <div className="max-w-5xl mx-auto mb-16 animate-in slide-in-from-bottom-5 duration-700">
              <Card className={cn(
                "p-8 md:p-12 backdrop-blur-xl border shadow-2xl transition-all duration-300",
                "bg-gray-900/50 border-gray-800 dark:bg-gray-900/50 dark:border-gray-800",
                "[data-theme='light'] &:bg-white/95 [data-theme='light'] &:border-gray-200",
                "[data-theme='light'] &:shadow-xl",
                "hover:shadow-3xl hover:scale-[1.01] transform",
                "rounded-2xl"
              )}>
                <div className="space-y-8">
                  {/* Professional Search Input */}
                  <div className="relative group">
                    <div className={cn(
                      "absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10",
                      "text-gray-500 dark:text-gray-500",
                      "[data-theme='light'] &:text-gray-400"
                    )}>
                      <Search className="w-6 h-6" />
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
                      className={cn(
                        "w-full pl-16 pr-6 py-5 rounded-2xl text-lg transition-all duration-300",
                        "bg-gray-800/50 border-2 border-gray-700 text-gray-100 placeholder-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500",
                        "dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500",
                        "dark:focus:ring-purple-500 dark:focus:border-purple-500",
                        "[data-theme='light'] &:bg-white [data-theme='light'] &:border-gray-300",
                        "[data-theme='light'] &:text-gray-900 [data-theme='light'] &:placeholder-gray-400",
                        "[data-theme='light'] &:focus:ring-blue-500 [data-theme='light'] &:focus:border-blue-500",
                        "hover:shadow-lg group-hover:scale-[1.005] transform",
                        "font-medium"
                      )}
                    />
                    {/* Professional animated border */}
                    <div className={cn(
                      "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                      "bg-gradient-to-r from-purple-500/10 to-purple-600/10 dark:from-purple-500/10 dark:to-purple-600/10",
                      "[data-theme='light'] &:from-blue-500/10 [data-theme='light'] &:to-blue-600/10"
                    )} />
                  </div>

                  {/* Professional Quick Actions */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                          "gap-2 transition-all duration-300 hover:scale-105 transform px-6 py-3",
                          "border-2 rounded-xl font-medium",
                          showFilters && "border-purple-600 bg-purple-600/10 text-purple-400",
                          showFilters && "dark:border-purple-600 dark:bg-purple-600/10 dark:text-purple-400",
                          showFilters && "[data-theme='light'] &:border-blue-600 [data-theme='light'] &:bg-blue-600/10 [data-theme='light'] &:text-blue-600"
                        )}
                      >
                        <Filter className="w-4 h-4" />
                        Filters
                        {activeFilterCount() > 0 && (
                          <Badge variant="secondary" className={cn(
                            "ml-1 transition-all duration-300 px-2 py-1",
                            "bg-purple-600 text-white dark:bg-purple-600",
                            "[data-theme='light'] &:bg-blue-600"
                          )}>
                            {activeFilterCount()}
                          </Badge>
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={() => setUseMultiTopic(!useMultiTopic)}
                        className={cn(
                          "gap-2 transition-all duration-300 hover:scale-105 transform px-6 py-3",
                          "rounded-xl font-medium",
                          "[data-theme='light'] &:hover:bg-gray-100"
                        )}
                      >
                        Advanced Search
                      </Button>
                    </div>

                    <Button
                      onClick={handleSearch}
                      disabled={loading || (!searchQuery.trim() && !useMultiTopic)}
                      size="lg"
                      className={cn(
                        "gap-3 min-w-[180px] transition-all duration-300 hover:scale-105 transform",
                        "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600",
                        "dark:from-purple-600 dark:to-purple-500 dark:hover:from-purple-700 dark:hover:to-purple-600",
                        "[data-theme='light'] &:from-blue-600 [data-theme='light'] &:to-blue-500",
                        "[data-theme='light'] &:hover:from-blue-700 [data-theme='light'] &:hover:to-blue-600",
                        "shadow-lg hover:shadow-xl px-8 py-4 rounded-xl font-semibold text-lg"
                      )}
                    >
                      <Search className="w-5 h-5" />
                      Search
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Professional Boolean Search Mode */}
              {useMultiTopic && (
                <Card className={cn(
                  "mt-6 p-8 backdrop-blur-xl border animate-in slide-in-from-top-3 transition-all duration-300",
                  "bg-gray-900/50 border-gray-800 dark:bg-gray-900/50 dark:border-gray-800",
                  "[data-theme='light'] &:bg-white/95 [data-theme='light'] &:border-gray-200",
                  "hover:shadow-lg transform hover:scale-[1.005]",
                  "rounded-2xl"
                )}>
                  <h3 className={cn(
                    "text-xl font-semibold mb-6 transition-colors duration-300",
                    "text-gray-100 dark:text-gray-100",
                    "[data-theme='light'] &:text-gray-900"
                  )}>
                    Advanced Boolean Search
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={cn(
                        "text-sm font-medium transition-colors duration-300",
                        "text-gray-400 dark:text-gray-400",
                        "[data-theme='light'] &:text-gray-600"
                      )}>
                        Combine terms with:
                      </span>
                      {['AND', 'OR', 'NOT'].map(op => (
                        <button
                          key={op}
                          onClick={() => setOperator(op)}
                          className={cn(
                            "px-4 py-2 text-sm rounded-lg transition-all duration-300 hover:scale-105 transform font-medium",
                            operator === op
                              ? "bg-purple-600 text-white shadow-lg dark:bg-purple-600 [data-theme='light'] &:bg-blue-600"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 [data-theme='light'] &:bg-gray-100 [data-theme='light'] &:text-gray-600 [data-theme='light'] &:hover:bg-gray-200"
                          )}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                    
                    {topics.map((topic, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => {
                            const newTopics = [...topics];
                            newTopics[index] = e.target.value;
                            setTopics(newTopics);
                          }}
                          placeholder={`Research term ${index + 1}`}
                          className={cn(
                            "flex-1 px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium",
                            "bg-gray-800 border-2 border-gray-700 text-gray-100 placeholder-gray-500",
                            "focus:outline-none focus:ring-2 focus:ring-purple-500",
                            "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500",
                            "dark:focus:ring-purple-500",
                            "[data-theme='light'] &:bg-white [data-theme='light'] &:border-gray-300",
                            "[data-theme='light'] &:text-gray-900 [data-theme='light'] &:placeholder-gray-400",
                            "[data-theme='light'] &:focus:ring-blue-500 [data-theme='light'] &:focus:border-blue-500",
                            "hover:shadow-md focus:scale-[1.01] transform"
                          )}
                        />
                        {topics.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTopics(topics.filter((_, i) => i !== index))}
                            className="transition-all duration-300 hover:scale-110 transform px-3 py-2 rounded-lg"
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
                      className="transition-all duration-300 hover:scale-105 transform px-6 py-3 rounded-xl font-medium"
                    >
                      Add Research Term
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Professional Filters Panel */}
            {showFilters && (
              <div className="max-w-5xl mx-auto mb-12 animate-in slide-in-from-top-3 duration-300">
                <FilterPanel 
                  filters={filters}
                  setFilters={setFilters}
                  selectedSource={selectedSource}
                />
              </div>
            )}

            {/* Professional Content Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Professional Trending Research */}
              <Card className={cn(
                "p-8 backdrop-blur border transition-all duration-300 hover:scale-[1.02] transform",
                "bg-gray-900/30 border-gray-800 dark:bg-gray-900/30 dark:border-gray-800",
                "[data-theme='light'] &:bg-white/80 [data-theme='light'] &:border-gray-200",
                "hover:shadow-lg rounded-2xl"
              )}>
                <h3 className={cn(
                  "text-xl font-semibold mb-6 flex items-center gap-3 transition-colors duration-300",
                  "text-gray-100 dark:text-gray-100",
                  "[data-theme='light'] &:text-gray-900"
                )}>
                  <TrendingUp className={cn(
                    "w-6 h-6 transition-colors duration-300",
                    "text-purple-400 dark:text-purple-400",
                    "[data-theme='light'] &:text-blue-500"
                  )} />
                  Trending Research
                </h3>
                <div className="space-y-4">
                  {trendingTopics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(topic.label)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left group",
                        "bg-gray-800/50 hover:bg-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800",
                        "[data-theme='light'] &:bg-gray-50 [data-theme='light'] &:hover:bg-gray-100",
                        "hover:scale-[1.02] transform hover:shadow-md border border-transparent hover:border-gray-700",
                        "[data-theme='light'] &:hover:border-gray-200"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-colors duration-300",
                        "bg-purple-600/20 text-purple-400 group-hover:bg-purple-600/30",
                        "[data-theme='light'] &:bg-blue-600/20 [data-theme='light'] &:text-blue-500 [data-theme='light'] &:group-hover:bg-blue-600/30"
                      )}>
                        <topic.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "font-medium transition-colors duration-300 mb-1",
                          "text-gray-300 group-hover:text-gray-100",
                          "dark:text-gray-300 dark:group-hover:text-gray-100",
                          "[data-theme='light'] &:text-gray-700 [data-theme='light'] &:group-hover:text-gray-900"
                        )}>
                          {topic.label}
                        </div>
                        <div className={cn(
                          "text-xs transition-colors duration-300",
                          "text-gray-500 group-hover:text-gray-400",
                          "[data-theme='light'] &:text-gray-500 [data-theme='light'] &:group-hover:text-gray-600"
                        )}>
                          {topic.description}
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1",
                        "text-gray-500 group-hover:text-purple-400",
                        "[data-theme='light'] &:group-hover:text-blue-500"
                      )} />
                    </button>
                  ))}
                </div>
              </Card>

              {/* Professional Recent Searches */}
              <Card className={cn(
                "p-8 backdrop-blur border transition-all duration-300 hover:scale-[1.02] transform",
                "bg-gray-900/30 border-gray-800 dark:bg-gray-900/30 dark:border-gray-800",
                "[data-theme='light'] &:bg-white/80 [data-theme='light'] &:border-gray-200",
                "hover:shadow-lg rounded-2xl"
              )}>
                <h3 className={cn(
                  "text-xl font-semibold mb-6 flex items-center gap-3 transition-colors duration-300",
                  "text-gray-100 dark:text-gray-100",
                  "[data-theme='light'] &:text-gray-900"
                )}>
                  <Clock className={cn(
                    "w-6 h-6 transition-colors duration-300",
                    "text-purple-400 dark:text-purple-400",
                    "[data-theme='light'] &:text-blue-500"
                  )} />
                  Recent Searches
                </h3>
                <div className="space-y-4">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(search.query)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left group",
                        "bg-gray-800/50 hover:bg-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800",
                        "[data-theme='light'] &:bg-gray-50 [data-theme='light'] &:hover:bg-gray-100",
                        "hover:scale-[1.02] transform hover:shadow-md border border-transparent hover:border-gray-700",
                        "[data-theme='light'] &:hover:border-gray-200"
                      )}
                    >
                      <div className={cn(
                        "w-3 h-3 rounded-full transition-colors duration-300",
                        "bg-gray-600 group-hover:bg-purple-400",
                        "dark:bg-gray-600 dark:group-hover:bg-purple-400",
                        "[data-theme='light'] &:bg-gray-400 [data-theme='light'] &:group-hover:bg-blue-500"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "font-medium transition-colors duration-300 mb-1",
                          "text-gray-300 group-hover:text-gray-100",
                          "dark:text-gray-300 dark:group-hover:text-gray-100",
                          "[data-theme='light'] &:text-gray-700 [data-theme='light'] &:group-hover:text-gray-900"
                        )}>
                          {search.query}
                        </div>
                        <div className={cn(
                          "text-xs transition-colors duration-300",
                          "text-gray-500 group-hover:text-gray-400",
                          "[data-theme='light'] &:text-gray-500 [data-theme='light'] &:group-hover:text-gray-600"
                        )}>
                          {search.description} • {search.time}
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1",
                        "text-gray-500 group-hover:text-purple-400",
                        "[data-theme='light'] &:group-hover:text-blue-500"
                      )} />
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