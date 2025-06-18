// app/component/search/SearchBar.js
import React from 'react';
import { ChevronDown, Filter, Search, Loader2, Lock, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/app/lib/utils';

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
      alert('🚀 Scopus integration coming soon! Stay tuned for updates.');
      return;
    }
    
    setSelectedSource(newSource);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFetchArticles();
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-3 border border-gray-800">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Source Selector */}
        <div className="relative">
          <select 
            value={selectedSource}
            onChange={handleSourceChange}
            className="appearance-none bg-gray-800/50 text-sm font-medium px-4 py-3 pr-10 rounded-xl cursor-pointer hover:bg-gray-700/50 transition-all border border-gray-700"
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
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your research topic..."
            className="w-full px-5 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all pr-12"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Sparkles className="w-4 h-4 text-purple-400/50" />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className={cn(
              "gap-2 border-gray-700",
              showFilters && "border-purple-600 bg-purple-600/10 text-purple-400"
            )}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs bg-purple-600">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          
          <Button
            onClick={handleFetchArticles}
            disabled={loading || !searchQuery.trim()}
            className="gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg transform hover:scale-105 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}