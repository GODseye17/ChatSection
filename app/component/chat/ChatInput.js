// app/components/chat/ChatInput.js
import React from 'react';
import { Send, Loader2, CheckCircle, Image, Paperclip } from 'lucide-react';

export default function ChatInput({ 
  chatInput, 
  setChatInput, 
  handleSendMessage, 
  topicStatus,
  messages = [] 
}) {
  return (
    <div className="border-t border-white/10 bg-[#0A0A0A] relative z-10">
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
        
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-white/5 rounded-2xl border border-white/10">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={topicStatus === 'ready' ? "Message Vivum..." : "Waiting for articles to be processed..."}
                className="w-full px-4 pt-3 pb-2 bg-transparent outline-none text-gray-100 placeholder-gray-500 resize-none min-h-[44px] max-h-32"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={topicStatus !== 'ready'}
                rows={1}
              />
              <div className="flex items-center px-3 py-2 border-t border-white/5">
                <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-gray-300">
                  <Image className="w-5 h-5" />
                </button>
                <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-gray-300">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || topicStatus !== 'ready'}
              className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {messages.length === 0 && (
            <div className="grid grid-cols-2 gap-3 mt-2">
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
    </div>
  );
}