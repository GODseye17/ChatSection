// app/component/sources/SourcesOverlay.js
// Replace your existing file with this complete code

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Search, 
  Filter,
  Calendar,
  Users,
  FileText,
  Copy,
  Check,
  Download,
  BookOpen,
  ArrowUpRight,
  Star,
  Eye,
  Grid,
  List
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { cn } from '@/app/lib/utils';

// Individual article card component
const ArticleCard = ({ article, index, viewMode, isExpanded, onToggleExpand, onCopyDOI, copied }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Simulate journal image (in real app, you'd have actual journal logos)
  const getJournalImage = (journal) => {
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(journal || 'default')}&backgroundColor=8b5cf6,a78bfa,c4b5fd`;
  };

  // Get article type color
  const getTypeColor = (type) => {
    const colors = {
      'Clinical Trial': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Systematic Review': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Meta-Analysis': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'Review': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'Case Study': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'default': 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    };
    return colors[type] || colors.default;
  };

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden border-gray-700 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10",
      viewMode === 'grid' ? 'p-6' : 'p-4',
      "animate-in fade-in slide-in-from-bottom-3",
      isExpanded && "border-purple-500/50 bg-gray-900/80"
    )}
    style={{
      animationDelay: `${Math.min(index * 50, 300)}ms`,
      animationFillMode: 'both'
    }}>
      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {viewMode === 'grid' ? (
          // Grid view layout
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start gap-4">
              {/* Journal image */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 p-2 group-hover:border-purple-500/30 transition-colors">
                  <img 
                    src={getJournalImage(article.journal)} 
                    alt=""
                    className="w-full h-full object-cover rounded"
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
              </div>
              
              {/* Title and journal */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-100 text-base line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors cursor-pointer" onClick={onToggleExpand}>
                  {article.title || 'Untitled Article'}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <BookOpen className="w-3 h-3" />
                  <span className="truncate">{article.journal || 'Unknown Journal'}</span>
                  {article.publicationDate && (
                    <>
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(article.publicationDate).getFullYear()}</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Type badge */}
              {article.type && (
                <Badge className={cn("text-xs border", getTypeColor(article.type))}>
                  {article.type}
                </Badge>
              )}
            </div>

            {/* Authors */}
            {article.authors && Array.isArray(article.authors) && article.authors.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {article.authors.slice(0, 3).join(', ')}
                  {article.authors.length > 3 && ` +${article.authors.length - 3} more`}
                </span>
              </div>
            )}

            {/* Abstract preview */}
            {article.abstract && (
              <div className="space-y-2">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {isExpanded ? article.abstract : truncateText(article.abstract, 200)}
                </p>
                {article.abstract.length > 200 && (
                  <button 
                    onClick={onToggleExpand}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}

            {/* Metrics */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {article.citations && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>{article.citations} citations</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>ID: {article.pmid || article.doi || 'N/A'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
              {article.doi && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs border-gray-700 hover:border-purple-500"
                  onClick={() => window.open(`https://doi.org/${article.doi}`, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                  View Article
                </Button>
              )}
              
              {article.doi && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={() => onCopyDOI(article.doi)}
                >
                  {copied === article.doi ? (
                    <>
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-green-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy DOI
                    </>
                  )}
                </Button>
              )}
              
              {article.pmid && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={() => window.open(`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`, '_blank')}
                >
                  PubMed
                  <ArrowUpRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          // List view layout
          <div className="flex items-start gap-4">
            {/* Journal image */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded bg-gray-800 border border-gray-700 p-1.5 group-hover:border-purple-500/30 transition-colors">
                <img 
                  src={getJournalImage(article.journal)} 
                  alt=""
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-semibold text-gray-100 text-sm line-clamp-1 group-hover:text-purple-300 transition-colors cursor-pointer" onClick={onToggleExpand}>
                  {article.title || 'Untitled Article'}
                </h3>
                
                {article.type && (
                  <Badge className={cn("text-xs border flex-shrink-0", getTypeColor(article.type))}>
                    {article.type}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                <span className="truncate">{article.journal || 'Unknown Journal'}</span>
                {article.publicationDate && (
                  <>
                    <span>•</span>
                    <span>{new Date(article.publicationDate).getFullYear()}</span>
                  </>
                )}
                {article.authors && article.authors.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="truncate">{article.authors[0]} et al.</span>
                  </>
                )}
              </div>
              
              {article.abstract && (
                <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                  {truncateText(article.abstract, 150)}
                </p>
              )}
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                {article.doi && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs h-7 px-2"
                    onClick={() => window.open(`https://doi.org/${article.doi}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </Button>
                )}
                
                {article.doi && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs h-7 px-2"
                    onClick={() => onCopyDOI(article.doi)}
                  >
                    {copied === article.doi ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default function SourcesOverlay({ showSources, setShowSources, articles }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [expandedArticles, setExpandedArticles] = useState(new Set());
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    if (showSources) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [showSources]);

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      (article.title && article.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (article.abstract && article.abstract.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (article.authors && article.authors.some(author => 
        author.toLowerCase().includes(searchQuery.toLowerCase())
      ));

    const matchesType = !selectedType || article.type === selectedType;
    
    const matchesYear = !selectedYear || 
      (article.publicationDate && new Date(article.publicationDate).getFullYear().toString() === selectedYear);

    return matchesSearch && matchesType && matchesYear;
  });

  // Get unique article types and years for filtering
  const articleTypes = [...new Set(articles.map(a => a.type).filter(Boolean))];
  const publicationYears = [...new Set(articles.map(a => 
    a.publicationDate ? new Date(a.publicationDate).getFullYear() : null
  ).filter(Boolean))].sort((a, b) => b - a);

  const handleCopyDOI = (doi) => {
    navigator.clipboard.writeText(doi);
    setCopied(doi);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedArticles(newExpanded);
  };

  const handleExportAll = () => {
    alert('CSV Export - Coming Soon! 📊');
  };

  if (!showSources) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={cn(
        "bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden",
        "animate-in fade-in zoom-in-95 duration-300"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-600/10 rounded-lg border border-purple-600/20">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100">Research Articles</h2>
              <p className="text-sm text-gray-400">
                {filteredArticles.length} of {articles.length} articles
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-800 rounded-lg border border-gray-700">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAll}
              className="gap-2 border-gray-700 hover:border-purple-500"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSources(false)}
              className="hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-900/50 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, authors, or keywords..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            {/* Type filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Types</option>
              {articleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            {/* Year filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Years</option>
              {publicationYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles list */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No articles found</h3>
              <p className="text-gray-500 max-w-md">
                {searchQuery ? `No articles match your search for "${searchQuery}"` : 'No articles available to display'}
              </p>
            </div>
          ) : (
            <div className={cn(
              "gap-6",
              viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'space-y-4'
            )}>
              {filteredArticles.map((article, idx) => (
                <ArticleCard
                  key={`${article.doi || article.pmid || idx}`}
                  article={article}
                  index={idx}
                  viewMode={viewMode}
                  isExpanded={expandedArticles.has(idx)}
                  onToggleExpand={() => toggleExpanded(idx)}
                  onCopyDOI={handleCopyDOI}
                  copied={copied}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredArticles.length > 0 && (
          <div className="p-4 bg-gray-900/95 border-t border-gray-800 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <span>Showing {filteredArticles.length} articles</span>
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Clear search
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}