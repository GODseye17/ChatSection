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
    <div className="relative">
      {topicStatus === 'processing' && (
        <div className="absolute -top-8 left-0 right-0 text-sm text-amber-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing articles... This may take a few moments.
        </div>
      )}
      {topicStatus === 'ready' && (
        <div className="absolute -top-8 left-0 right-0 text-sm text-green-400 flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Ready! You can now ask questions about the research.
        </div>
      )}
      
      <div className="relative flex items-center bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-lg overflow-hidden">
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
          className="p-2 mr-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}