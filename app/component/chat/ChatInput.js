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
    <div className="border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm relative z-10">
      <div className="max-w-3xl mx-auto p-4">
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
        <div className="flex gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={topicStatus === 'ready' ? "Ask about the research..." : "Waiting for articles to be processed..."}
            className="flex-1 px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700/50 outline-none text-gray-100 placeholder-gray-500 focus:border-purple-500/50 transition-colors"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={topicStatus !== 'ready'}
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || topicStatus !== 'ready'}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-purple-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}