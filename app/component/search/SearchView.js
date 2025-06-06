// app/component/search/SearchView.js
import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import { Info, Sparkles } from 'lucide-react';

export default function SearchView({ 
  searchQuery, 
  setSearchQuery, 
  selectedSource, 
  setSelectedSource, 
  handleFetchArticles, 
  loading,
  showFilters,
  setShowFilters
}) {
  // Initialize filters with defaults
  const [filters, setFilters] = useState({
    publication_date: '',
    custom_start_date: '',
    custom_end_date: '',
    article_types: [],
    languages: ['english'], // Default to English
    species: ['humans'], // Default to humans
    sex: [],
    age_groups: [],
    other_filters: [],
    custom_filters: '',
    sort_by: 'relevance',
    search_field: 'title/abstract'
  });
  
  const [booleanMode, setBooleanMode] = useState(false);

  // Clean filters function - only include non-default values
  const buildCleanFilters = () => {
    const cleanFilters = {};
    
    // Only add non-empty string fields
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
    
    // Only add non-empty arrays or arrays that differ from defaults
    if (filters.article_types && filters.article_types.length > 0) {
      cleanFilters.article_types = filters.article_types;
    }
    
    // Only include languages if not default English
    if (filters.languages && filters.languages.length > 0 && 
        !(filters.languages.length === 1 && filters.languages[0] === 'english')) {
      cleanFilters.languages = filters.languages;
    }
    
    // Only include species if not default humans
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
    
    // Handle custom filters
    if (filters.custom_filters && filters.custom_filters.trim()) {
      cleanFilters.custom_filters = [filters.custom_filters.trim()];
    }
    
    return Object.keys(cleanFilters).length > 0 ? cleanFilters : null;
  };

  // Handle search with filters
  const handleSearch = () => {
    const cleanFilters = buildCleanFilters();
    handleFetchArticles(cleanFilters);
  };

  useEffect(() => {
    // Create particles
    const createParticles = () => {
      const particlesContainer = document.querySelector('.particles');
      if (!particlesContainer) return;

      particlesContainer.innerHTML = '';

      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();
  }, []);

  // Check if query contains boolean operators
  useEffect(() => {
    const hasBooleanOperators = /\b(AND|OR|NOT)\b/i.test(searchQuery);
    setBooleanMode(hasBooleanOperators);
  }, [searchQuery]);

  // Count active filters (excluding defaults)
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

  // Helper function to apply CSS classes conditionally
  const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  // Search tip examples
  const searchTips = [
    { query: 'diabetes AND prevention', label: 'diabetes AND prevention' },
    { query: 'cancer OR tumor', label: 'cancer OR tumor' },
    { query: 'hypertension NOT pediatric', label: 'hypertension NOT pediatric' },
    { query: 'COVID-19 AND vaccine', label: 'COVID-19 AND vaccine' },
    { query: 'alzheimer OR dementia', label: 'alzheimer OR dementia' }
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Animated background */}
      <div className="animated-bg">
        <div className="grid-pattern"></div>
        <div className="particles"></div>
        <div className="gradient-layer"></div>
      </div>
      
      {/* Main content container with scroll */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className={cn(
          "min-h-full p-4 md:p-8",
          showFilters ? "pb-8" : "flex items-center justify-center"
        )}>
          <div className="w-full max-w-6xl mx-auto">
            {/* Header section */}
            <div className={cn(
              "relative mb-8 md:mb-12 text-center",
              showFilters && "mt-8"
            )}>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-in fade-in duration-500">
                Discover Research with <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">Precision.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-in slide-in-from-bottom-3 duration-500">
                Advanced AI-powered search across PubMed and Scopus with intelligent filtering and evidence synthesis.
              </p>
              
              {/* Boolean mode indicator */}
              {booleanMode && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-purple-600/10 rounded-full">
                  <Info className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400">Boolean search mode active</span>
                </div>
              )}

              {/* Active filters indicator */}
              {activeFilterCount() > 0 && !showFilters && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 rounded-full">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400">
                    {activeFilterCount()} filter{activeFilterCount() > 1 ? 's' : ''} applied
                  </span>
                </div>
              )}
            </div>

            {/* Search and filters section */}
            <div className="space-y-6">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedSource={selectedSource}
                setSelectedSource={setSelectedSource}
                handleFetchArticles={handleSearch}
                loading={loading}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                activeFilterCount={activeFilterCount()}
              />

              {showFilters && (
                <div className="animate-in slide-in-from-top-3 duration-300">
                  <FilterPanel 
                    filters={filters}
                    setFilters={setFilters}
                    selectedSource={selectedSource}
                  />
                </div>
              )}

              {/* Search tips - only show when filters are hidden */}
              {!showFilters && (
                <div className="text-center space-y-4 mt-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    💡 Pro tip: Use Boolean operators for precise searches
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {searchTips.map((tip, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(tip.query)}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full border border-gray-300 dark:border-gray-600 transition-colors cursor-pointer"
                      >
                        {tip.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Additional helpful info */}
                  <div className="text-center mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg max-w-2xl mx-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Search operators:</strong>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <div><code className="bg-purple-100 dark:bg-purple-900/30 px-1 rounded">AND</code> - Both terms</div>
                      <div><code className="bg-purple-100 dark:bg-purple-900/30 px-1 rounded">OR</code> - Either term</div>
                      <div><code className="bg-purple-100 dark:bg-purple-900/30 px-1 rounded">NOT</code> - Exclude term</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}