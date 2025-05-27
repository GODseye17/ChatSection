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
        <div className="absolute -top-8 left-0 right-0 text-sm text-amber-600 flex items-center justify-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          Processing articles...
        </div>
      )}
      {topicStatus === 'ready' && (
        <div className="absolute -top-8 left-0 right-0 text-sm text-green-600 flex items-center justify-center gap-2">
          <CheckCircle className="w-3 h-3" />
          Ready to answer questions
        </div>
      )}
      <div className="flex gap-3 bg-gray-50 rounded-2xl p-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder={topicStatus === 'ready' ? "What's on your mind?" : "Please wait..."}
          className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-800 placeholder-gray-400"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={topicStatus !== 'ready'}
        />
        <button
          onClick={handleSendMessage}
          disabled={!chatInput.trim() || topicStatus !== 'ready'}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl transition-all hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}