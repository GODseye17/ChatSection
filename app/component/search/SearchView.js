// app/component/search/SearchView.js
import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Info } from 'lucide-react';
import { cn } from '@/app/lib/utils';

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
  const [filters, setFilters] = useState({
    publication_date: '',
    custom_start_date: '',
    custom_end_date: '',
    text_availability: [],
    article_types: [],
    languages: [],
    species: [],
    sex: [],
    age_groups: [],
    other_filters: [],
    sort_by: 'relevance',
    search_field: 'title/abstract'
  });

  const [booleanMode, setBooleanMode] = useState(false);

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

  const handleSearch = () => {
    // Pass filters along with the search
    handleFetchArticles(filters);
  };

  // Check if query contains boolean operators
  useEffect(() => {
    const hasBooleanOperators = /\b(AND|OR|NOT)\b/i.test(searchQuery);
    setBooleanMode(hasBooleanOperators);
  }, [searchQuery]);

  // Count active filters
  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'sort_by' || key === 'search_field') return count;
    if (Array.isArray(value) && value.length > 0) return count + 1;
    if (typeof value === 'string' && value !== '') return count + 1;
    return count;
  }, 0);

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
                Take a Leap to <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">Analyze.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-in slide-in-from-bottom-3 duration-500">
                The world's first real-time AI agent for research and evidence synthesis from PubMed and Scopus.
              </p>
              
              {/* Boolean mode indicator */}
              {booleanMode && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-purple-600/10 rounded-full">
                  <Info className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400">Boolean search mode active</span>
                </div>
              )}
            </div>

            {/* Search and filters section */}
            <div className="space-y-4">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedSource={selectedSource}
                setSelectedSource={setSelectedSource}
                handleFetchArticles={handleSearch}
                loading={loading}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                activeFilterCount={activeFilterCount}
              />

              {showFilters && (
                <FilterPanel 
                  filters={filters}
                  setFilters={setFilters}
                  selectedSource={selectedSource}
                />
              )}

              {/* Search tips - only show when filters are hidden */}
              {!showFilters && (
                <div className="text-center space-y-2 mt-6">
                  <p className="text-sm text-gray-500">
                    Pro tip: Use AND, OR, NOT for boolean searches
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-gray-800 text-xs"
                      onClick={() => setSearchQuery('diabetes AND prevention')}
                    >
                      diabetes AND prevention
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-gray-800 text-xs"
                      onClick={() => setSearchQuery('cancer OR tumor')}
                    >
                      cancer OR tumor
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-gray-800 text-xs"
                      onClick={() => setSearchQuery('hypertension NOT pediatric')}
                    >
                      hypertension NOT pediatric
                    </Badge>
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