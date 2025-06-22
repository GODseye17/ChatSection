// app/component/canvas/SourcesCanvas.js
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  X, 
  ExternalLink, 
  FileText, 
  Copy,
  Check,
  Search,
  ChevronRight,
  BookOpen,
  Calendar,
  Users,
  Menu
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function SourcesCanvas({ articles, isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  console.log('SourcesCanvas - Articles:', articles); // Debug log

  // Ensure articles is an array
  const articleList = Array.isArray(articles) ? articles : [];

  const filteredArticles = articleList.filter(article => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (article.title && article.title.toLowerCase().includes(searchLower)) ||
      (article.abstract && article.abstract.toLowerCase().includes(searchLower)) ||
      (article.authors && article.authors.toLowerCase().includes(searchLower))
    );
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Format authors string for display
  const formatAuthors = (authors) => {
    if (!authors) return 'Unknown authors';
    if (typeof authors === 'string') {
      // If authors is a string like "Smith, J.; Doe, J.", split and format
      const authorList = authors.split(';').map(a => a.trim()).filter(a => a);
      if (authorList.length > 3) {
        return authorList.slice(0, 3).join(', ') + ` et al. (${authorList.length} authors)`;
      }
      return authorList.join(', ');
    }
    return authors;
  };

  // Extract year from created_at date
  const getYear = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).getFullYear();
    } catch {
      return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className={cn(
        "w-full sm:w-[90%] md:w-[700px] lg:w-[800px] h-full bg-gray-900 border-l border-gray-800 shadow-2xl",
        "animate-in slide-in-from-right duration-300"
      )}>
        <div className="h-full flex flex-col">
          {/* Header - responsive */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 bg-purple-600/10 rounded-lg border border-purple-600/20 flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-gray-100 truncate">Research Sources</h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  {articleList.length} {articleList.length === 1 ? 'article' : 'articles'} available
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-800 rounded-lg flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar - responsive */}
          <div className="p-3 sm:p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, abstract, or authors..."
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Articles List - responsive */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">No articles found</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto px-4">
                    {searchQuery 
                      ? `No articles match your search for "${searchQuery}"`
                      : articleList.length === 0 
                        ? 'No articles have been loaded yet' 
                        : 'Try adjusting your search terms'}
                  </p>
                </div>
              ) : (
                filteredArticles.map((article, idx) => {
                  const year = getYear(article.created_at);
                  const isExpanded = selectedArticle === article.id;
                  
                  return (
                    <Card
                      key={article.id || idx}
                      className={cn(
                        "p-3 sm:p-4 border-gray-700 hover:border-purple-600/50 cursor-pointer transition-all duration-200",
                        "hover:shadow-lg hover:shadow-purple-600/10",
                        "animate-in fade-in slide-in-from-bottom-2",
                        isExpanded && "border-purple-600 bg-purple-600/5"
                      )}
                      style={{
                        animationDelay: `${Math.min(idx * 50, 300)}ms`,
                        animationFillMode: 'both'
                      }}
                      onClick={() => setSelectedArticle(isExpanded ? null : article.id)}
                    >
                      <div className="space-y-2 sm:space-y-3">
                        {/* Title and metadata - responsive */}
                        <div>
                          <h3 className="font-medium text-gray-100 text-sm sm:text-base leading-snug pr-6 sm:pr-8">
                            {article.title || 'Untitled Article'}
                          </h3>
                          
                          {/* Metadata row - responsive */}
                          <div className="flex items-center gap-2 sm:gap-3 mt-2 flex-wrap">
                            {article.pubmed_id && (
                              <Badge variant="secondary" className="text-xs gap-1">
                                PMID: {article.pubmed_id}
                              </Badge>
                            )}
                            {year && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Calendar className="w-3 h-3" />
                                {year}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Authors - responsive */}
                        {article.authors && (
                          <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
                            <Users className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2 sm:line-clamp-1 leading-relaxed">
                              {formatAuthors(article.authors)}
                            </span>
                          </div>
                        )}

                        {/* Abstract Preview (when not expanded) - responsive */}
                        {article.abstract && !isExpanded && (
                          <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                            {article.abstract}
                          </p>
                        )}

                        {/* Expanded Content - responsive */}
                        {isExpanded && (
                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700 space-y-3 sm:space-y-4 animate-in slide-in-from-top-2 duration-200">
                            {/* Full Abstract */}
                            {article.abstract && (
                              <div>
                                <h4 className="text-xs sm:text-sm font-medium text-gray-300 mb-2">Abstract</h4>
                                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                                  {article.abstract}
                                </p>
                              </div>
                            )}

                            {/* Actions - responsive */}
                            <div className="flex items-center gap-2 pt-2 flex-wrap">
                              {article.url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2 text-xs border-purple-600/30 hover:border-purple-600 hover:bg-purple-600/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(article.url, '_blank');
                                  }}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span className="hidden sm:inline">View on PubMed</span>
                                  <span className="sm:hidden">PubMed</span>
                                </Button>
                              )}
                              {article.pubmed_id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(article.pubmed_id, `pmid-${article.id}`);
                                  }}
                                >
                                  {copiedId === `pmid-${article.id}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-green-500" />
                                      <span className="text-green-500 hidden sm:inline">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span className="hidden sm:inline">Copy PMID</span>
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Expand/Collapse Indicator - responsive */}
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                          <ChevronRight className={cn(
                            "w-4 h-4 text-gray-600 transition-transform duration-200",
                            isExpanded && "rotate-90"
                          )} />
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer - responsive */}
          <div className="p-3 sm:p-4 border-t border-gray-800 bg-gray-900/95 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="text-xs sm:text-sm text-gray-400">
                {searchQuery && filteredArticles.length !== articleList.length ? (
                  <>
                    Showing {filteredArticles.length} of {articleList.length} articles
                  </>
                ) : (
                  <>
                    {articleList.length} {articleList.length === 1 ? 'article' : 'articles'} loaded
                  </>
                )}
              </div>
              
              {articleList.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={() => {
                    const text = articleList.map(a => 
                      `Title: ${a.title}\nPMID: ${a.pubmed_id || 'N/A'}\nAuthors: ${a.authors || 'N/A'}\n---`
                    ).join('\n\n');
                    handleCopy(text, 'all');
                  }}
                >
                  {copiedId === 'all' ? (
                    <>
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-green-500 hidden sm:inline">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="hidden sm:inline">Copy All References</span>
                      <span className="sm:hidden">Copy All</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}