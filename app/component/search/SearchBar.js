// app/component/search/SearchBar.js
import React from 'react';
import { ChevronDown, Filter, Search, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
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
  activeFilterCount
}) {
  return (
    <Card className="border-gray-700 bg-gray-900/50 backdrop-blur-sm shadow-xl">
      <div className="p-2">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Source selector */}
          <div className="relative">
            <select 
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="appearance-none bg-gray-800 text-sm font-medium px-4 py-3 pr-10 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="pubmed">PubMed</option>
              <option value="scopus">Scopus</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
          </div>
          
          {/* Search input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter search terms (supports AND, OR, NOT)..."
              className="w-full px-4 py-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-gray-100 placeholder-gray-500 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleFetchArticles()}
            />
            {/* Boolean operators hint */}
            {searchQuery && /\b(AND|OR|NOT)\b/i.test(searchQuery) && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Badge variant="secondary" className="text-xs">
                  Boolean
                </Badge>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? "secondary" : "outline"}
              className={cn(
                "gap-2",
                activeFilterCount > 0 && "ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900"
              )}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-1 px-1.5 py-0 text-xs bg-purple-600">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            
            <Button
              onClick={handleFetchArticles}
              disabled={loading || !searchQuery.trim()}
              className="gap-2 bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}