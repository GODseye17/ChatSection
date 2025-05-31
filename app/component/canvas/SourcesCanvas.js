// app/component/canvas/SourcesCanvas.js
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  X, 
  ExternalLink, 
  FileText, 
  Calendar,
  Users,
  Copy,
  Check,
  Search,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function SourcesCanvas({ articles, isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filteredArticles = articles.filter(article =>
    (article.title && article.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (article.abstract && article.abstract.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopyDOI = (doi) => {
    navigator.clipboard.writeText(doi);
    setCopied(doi);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed right-0 top-0 h-screen bg-gray-900 border-l border-gray-800 shadow-2xl z-40",
      "w-full md:w-[600px] lg:w-[700px]",
      "transition-transform duration-300 ease-out",
      isAnimating ? "translate-x-0" : "translate-x-full",
      isOpen && !isAnimating && "translate-x-0"
    )}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-100">Research Sources</h2>
              <p className="text-sm text-gray-400">{articles.length} articles found</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Articles List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">No articles found</p>
              </div>
            ) : (
              filteredArticles.map((article, idx) => (
                <Card
                  key={idx}
                  className={cn(
                    "p-4 border-gray-700 hover:border-purple-600/50 cursor-pointer transition-all",
                    "hover:shadow-lg hover:shadow-purple-600/10",
                    "animate-in fade-in slide-in-from-right-5",
                    selectedArticle === idx && "border-purple-600 bg-purple-600/5"
                  )}
                  style={{
                    animationDelay: `${Math.min(idx * 50, 300)}ms`,
                    animationFillMode: 'both'
                  }}
                  onClick={() => setSelectedArticle(selectedArticle === idx ? null : idx)}
                >
                  <div className="space-y-3">
                    {/* Title and Source */}
                    <div>
                      <h3 className="font-medium text-gray-100 line-clamp-2 mb-1">
                        {article.title || 'Untitled Article'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Badge variant="secondary" className="text-xs">
                          {article.source || 'PubMed'}
                        </Badge>
                        {article.publicationDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.publicationDate).getFullYear()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Authors */}
                    {article.authors && Array.isArray(article.authors) && article.authors.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-3 h-3" />
                        <span className="truncate">
                          {article.authors.slice(0, 3).join(', ')}
                          {article.authors.length > 3 && ` +${article.authors.length - 3} more`}
                        </span>
                      </div>
                    )}

                    {/* Abstract Preview */}
                    {article.abstract && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {article.abstract}
                      </p>
                    )}

                    {/* Expanded Content */}
                    {selectedArticle === idx && (
                      <div className="mt-3 pt-3 border-t border-gray-700 space-y-3 animate-in slide-in-from-top-2">
                        {/* Full Abstract */}
                        {article.abstract && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-1">Abstract</h4>
                            <p className="text-sm text-gray-400">{article.abstract}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {article.doi && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`https://doi.org/${article.doi}`, '_blank');
                                }}
                              >
                                <ExternalLink className="w-3 h-3" />
                                View Article
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyDOI(article.doi);
                                }}
                              >
                                {copied === article.doi ? (
                                  <>
                                    <Check className="w-3 h-3 text-green-500" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    Copy DOI
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                          {article.pmid && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`, '_blank');
                              }}
                            >
                              PubMed
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Expand Indicator */}
                    <div className="flex justify-end">
                      <ChevronRight className={cn(
                        "w-4 h-4 text-gray-600 transition-transform",
                        selectedArticle === idx && "rotate-90"
                      )} />
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Showing {filteredArticles.length} of {articles.length} articles
            </span>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                const articlesText = articles.map(a => 
                  `${a.title}\n${a.authors?.join(', ') || 'No authors'}\n${a.doi || 'No DOI'}\n---`
                ).join('\n\n');
                navigator.clipboard.writeText(articlesText);
              }}
            >
              <Copy className="w-3 h-3" />
              Copy All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}