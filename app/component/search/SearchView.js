// app/components/search/SearchView.js
import React from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

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
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8 relative">
      <div className="animated-bg"></div>
      <div className="w-full max-w-4xl relative z-10">
        {/* Decorative elements */}
        <div className="relative mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 animate-in fade-in duration-500">
            Take a Leap to <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">Analyze.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto animate-in slide-in-from-bottom-3 duration-500">
            The world's first real-time AI agent for research and evidence synthesis from PubMed and Scopus.
          </p>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          handleFetchArticles={handleFetchArticles}
          loading={loading}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {showFilters && <FilterPanel />}
      </div>
    </div>
  );
}