// app/components/chat/ChatInput.js
import React from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';

export default function ChatInput({ 
  chatInput, 
  setChatInput, 
  handleSendMessage, 
  topicStatus,
  messages = [] 
}) {
  return (
    <div className="border-t border-gray-200/10 bg-gray-900/80 backdrop-blur-sm relative z-10">
      <div className="max-w-3xl mx-auto p-4">
        {topicStatus === 'processing' && (
          <div className="mb-4 text-sm text-amber-400 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing articles... This may take a few moments.
          </div>
        )}
        {topicStatus === 'ready' && (
          <div className="mb-4 text-sm text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Ready! You can now ask questions about the research.
          </div>
        )}
        <div className="flex gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={topicStatus === 'ready' ? "Message Vivum..." : "Waiting for articles to be processed..."}
            className="flex-1 px-4 py-3 bg-white/5 rounded-xl border border-white/10 outline-none text-gray-100 placeholder-gray-500 focus:border-blue-500/50 transition-colors"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={topicStatus !== 'ready'}
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || topicStatus !== 'ready'}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 shadow-lg shadow-blue-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {messages.length === 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left transition-colors">
              <div className="font-medium mb-1 text-gray-200">Explain a complex topic</div>
              <div className="text-sm text-gray-500">I'll help break down difficult concepts</div>
            </button>
            <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left transition-colors">
              <div className="font-medium mb-1 text-gray-200">Write code for me</div>
              <div className="text-sm text-gray-500">Get help with programming tasks</div>
            </button>
            <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left transition-colors">
              <div className="font-medium mb-1 text-gray-200">Help me analyze data</div>
              <div className="text-sm text-gray-500">Statistical analysis and insights</div>
            </button>
            <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left transition-colors">
              <div className="font-medium mb-1 text-gray-200">Creative writing assistance</div>
              <div className="text-sm text-gray-500">Get help with writing and editing</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}