// app/components/chat/ChatMessage.js
import React from 'react';
import { Loader2, ExternalLink } from 'lucide-react';

export default function ChatMessage({ message }) {
  return (
    <div className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : ''}`}>
      {message.type === 'assistant' && (
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          V
        </div>
      )}
      
      <div className={`max-w-2xl ${message.type === 'user' ? 'order-1' : ''}`}>
        <div className={`p-4 rounded-2xl ${
          message.type === 'user' 
            ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white' 
            : message.isError
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
        }`}>
          <p className="text-sm md:text-base flex items-center gap-2">
            {message.isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {message.text}
          </p>
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Citations:</div>
              {message.citations.map((citation, cidx) => (
                <div key={cidx} className="text-sm mb-2">
                  <a href={`https://doi.org/${citation.doi}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                    {citation.title}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-xs text-gray-500 dark:text-gray-400"> - {citation.source}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {message.type === 'user' && (
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold flex-shrink-0">
          U
        </div>
      )}
    </div>
  );
}