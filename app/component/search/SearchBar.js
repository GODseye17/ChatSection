// app/components/search/SearchBar.js
import React from 'react';
import { ChevronDown, Filter, Search, Loader2, Lock } from 'lucide-react';

export default function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  selectedSource, 
  setSelectedSource, 
  handleFetchArticles, 
  loading,
  showFilters,
  setShowFilters,
  activeFilterCount = 0
}) {
  
  const handleSourceChange = (e) => {
    const newSource = e.target.value;
    
    if (newSource === 'scopus') {
      // Show alert and prevent selection
      alert('🚀 Scopus integration coming soon! Stay tuned for updates.');
      // Keep the current selection (should be pubmed)
      return;
    }
    
    setSelectedSource(newSource);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl p-2 border border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative">
          <select 
            value={selectedSource}
            onChange={handleSourceChange}
            className="appearance-none bg-gray-100 dark:bg-gray-800 text-sm font-medium px-4 py-3 pr-10 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <option value="pubmed">PubMed</option>
            <option value="scopus" className="text-gray-500">
              Scopus (Coming Soon)
            </option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            {selectedSource === 'scopus' && (
              <Lock className="w-3 h-3 text-gray-500" />
            )}
            <ChevronDown className="w-4 h-4" />
          </div>
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
            className={`px-4 py-3 rounded-xl transition-colors flex items-center gap-2 relative ${
              showFilters || activeFilterCount > 0
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          
          <button
            onClick={handleFetchArticles}
            disabled={loading || !searchQuery.trim() || selectedSource === 'scopus'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {selectedSource === 'scopus' ? 'Coming Soon' : 'Fetch Articles'}
          </button>
        </div>
      </div>
    </div>
  );
}