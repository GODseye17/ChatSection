// app/component/search/SearchBar.js
import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

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
  const handleSourceChange = (value) => {
    setSelectedSource(value);
    if (value === 'scopus') {
      toast.info("Coming Soon!", {
        description: "Scopus integration is currently under development.",
      });
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-1">
        <div className="relative bg-gray-950 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedSource} onValueChange={handleSourceChange}>
              <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-800 text-gray-100 hover:bg-gray-800 transition-colors">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="pubmed" className="text-gray-100 hover:bg-gray-800 focus:bg-gray-800 focus:text-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    PubMed
                  </div>
                </SelectItem>
                <SelectItem value="scopus" className="text-gray-100 hover:bg-gray-800 focus:bg-gray-800 focus:text-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    Scopus
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your research topic..."
              className="flex-1 bg-gray-900 border-gray-800 text-gray-100 placeholder:text-gray-500 h-10 text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleFetchArticles()}
            />
            
            <Button
              onClick={handleFetchArticles}
              disabled={loading || !searchQuery.trim() || selectedSource === 'scopus'}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium px-6 h-10"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Fetch Articles
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}