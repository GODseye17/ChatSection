// app/components/chat/ChatInput.js
import React from 'react';
import { Send, Loader2, CheckCircle, PlusCircle } from 'lucide-react';

export default function ChatInput({ 
  chatInput, 
  setChatInput, 
  handleSendMessage, 
  topicStatus,
  setIsSearchView 
}) {
  return (
    <div className="border-t border-gray-800 bg-gradient-to-b from-gray-900 to-black py-4 px-4 md:px-8 sticky bottom-0">
      <div className="max-w-3xl mx-auto space-y-4">
        {topicStatus === 'processing' && (
          <div className="mb-2 text-sm text-amber-400 flex items-center gap-2 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing articles... This may take a few moments.
          </div>
        )}
        {topicStatus === 'ready' && (
          <div className="mb-2 text-sm text-green-400 flex items-center gap-2 justify-center">
            <CheckCircle className="w-4 h-4" />
            Ready! You can now ask questions about the research.
          </div>
        )}
        <div className="flex gap-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50 shadow-lg">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={topicStatus === 'ready' ? "Message AI..." : "Waiting for articles to be processed..."}
            className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-100 placeholder-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={topicStatus !== 'ready'}
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || topicStatus !== 'ready'}
            className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <button
          onClick={() => setIsSearchView(true)}
          className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Search
        </button>
      </div>
    </div>
  );
}