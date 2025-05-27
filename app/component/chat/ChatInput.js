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
    <div className="border-t border-gray-800 p-4 bg-gray-900 sticky bottom-0">
      <div className="max-w-3xl mx-auto">
        {topicStatus === 'processing' && (
          <div className="mb-2 text-sm text-amber-400 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing articles... This may take a few moments.
          </div>
        )}
        {topicStatus === 'ready' && (
          <div className="mb-2 text-sm text-green-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Ready! You can now ask questions about the research.
          </div>
        )}
        <div className="flex gap-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={topicStatus === 'ready' ? "Ask about the research..." : "Waiting for articles to be processed..."}
            className="flex-1 px-3 py-2 bg-transparent outline-none text-gray-100 placeholder-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={topicStatus !== 'ready'}
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || topicStatus !== 'ready'}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}