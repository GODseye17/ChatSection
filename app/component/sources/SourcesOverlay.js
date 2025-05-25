// app/components/sources/SourcesOverlay.js
import React from 'react';
import { X } from 'lucide-react';
import ArticleCard from './ArticleCard';

export default function SourcesOverlay({ showSources, setShowSources, articles }) {
  if (!showSources) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8" 
      onClick={() => setShowSources(false)}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Fetched Articles ({articles.length})</h2>
          <button
            onClick={() => setShowSources(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
          {articles.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No articles fetched yet. Start by searching for a topic.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article, idx) => (
                <ArticleCard key={idx} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}