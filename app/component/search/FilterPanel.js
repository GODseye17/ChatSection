// app/components/search/FilterPanel.js
import React from 'react';

export default function FilterPanel() {
  return (
    <div className="mt-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-2">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Date Range</label>
          <input
            type="text"
            placeholder="e.g., 2020-2024"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Article Type</label>
          <input
            type="text"
            placeholder="e.g., Review, Clinical Trial"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Author</label>
          <input
            type="text"
            placeholder="e.g., John Doe"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
}