// app/components/layout/Sidebar.js
import React from 'react';
import { Clock } from 'lucide-react';
import { formatTimestamp } from '../../utils/formatters';

export default function Sidebar({ 
  sidebarOpen, 
  conversationHistory, 
  onSelectConversation 
}) {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-400 bg-clip-text text-transparent">Vivum</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {conversationHistory.map((item, idx) => (
              <button 
                key={idx} 
                className="w-full p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 transition-colors text-left"
                onClick={() => onSelectConversation(item)}
              >
                <div className="font-medium text-sm mb-1 text-gray-200">{item.topic}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(item.timestamp)}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
              U
            </div>
            <span className="font-medium text-gray-300">My Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}