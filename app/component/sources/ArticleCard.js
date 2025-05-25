// app/components/sources/ArticleCard.js
import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function ArticleCard({ article }) {
  return (
    <div className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
      <h3 className="font-semibold text-lg mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
        {article.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
        {article.abstract}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
          {article.source}
        </span>
        {article.doi && (
          <a 
            href={`https://doi.org/${article.doi}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 text-sm font-medium"
          >
            View Article
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}