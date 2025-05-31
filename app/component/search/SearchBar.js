// app/components/search/SearchBar.js
import React from 'react';
import { ChevronDown, Filter, Search, Loader2 } from 'lucide-react';

export default function SearchBar({ 
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
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl p-2 border border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative">
          <select 
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="appearance-none bg-gray-100 dark:bg-gray-800 text-sm font-medium px-4 py-3 pr-10 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <option value="pubmed">PubMed</option>
            <option value="scopus">Scopus</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter your research topic..."
          className="flex-1 px-4 py-3 bg-transparent outline-none text-lg"
          onKeyPress={(e) => e.key === 'Enter' && handleFetchArticles()}
        />
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          
          <button
            onClick={handleFetchArticles}
            disabled={loading || !searchQuery.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Fetch Articles
          </button>
        </div>
      </div>
    </div>
  );
}