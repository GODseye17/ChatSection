// app/components/chat/ChatInput.js
import React from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';

export default function ChatInput({ 
  chatInput, 
  setChatInput, 
  handleSendMessage, 
  topicStatus 
}) {
  return (
    <div className="border-t border-gray-800/50 p-6 bg-gray-900/80 backdrop-blur-sm relative z-10">
      <div className="max-w-3xl mx-auto">
        {topicStatus === 'processing' && (
          <div className="mb-4 text-sm text-amber-400 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing articles... This may take a few moments.
          </div>
        )}
        {topicStatus === 'ready' && (
          <div className="mb-4 text-sm text-green-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Ready! You can now ask questions about the research.
          </div>
        )}
        <div className="flex gap-3 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50 shadow-xl">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={topicStatus === 'ready' ? "Ask about the research..." : "Waiting for articles to be processed..."}
            className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-100 placeholder-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={topicStatus !== 'ready'}
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || topicStatus !== 'ready'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}