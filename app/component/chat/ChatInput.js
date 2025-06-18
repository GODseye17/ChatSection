// app/component/chat/ChatInput.js
import React, { useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/app/lib/utils';

export default function ChatInput({
  chatInput,
  setChatInput,
  handleSendMessage,
  topicStatus,
  setIsSearchView,
  onTyping
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  }, [chatInput]);

  const handleInputChange = (e) => {
    setChatInput(e.target.value);
    onTyping?.(!!e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Suggested questions
  const suggestions = [
    "What are the main findings?",
    "How does this compare to previous studies?",
    "What are the limitations?",
    "Explain the methodology"
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 z-20">
      <div className="max-w-4xl mx-auto p-4">
        {/* Suggested questions - only show when no input */}
        {topicStatus === 'ready' && !chatInput && (
          <div className="mb-3 flex gap-2 flex-wrap justify-center">
            <Sparkles className="w-4 h-4 text-purple-400 self-center" />
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setChatInput(suggestion)}
                className="px-3 py-1.5 text-xs bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-gray-100 rounded-full border border-gray-700 hover:border-purple-500/50 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={chatInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={topicStatus === 'ready' ? "Ask about the research..." : "Waiting for processing..."}
              disabled={topicStatus !== 'ready'}
              className={cn(
                "w-full resize-none bg-gray-800/50 border border-gray-700 rounded-2xl",
                "text-gray-100 placeholder-gray-500 p-3 pr-12",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500",
                "transition-all min-h-[52px] max-h-[200px]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              rows={1}
              style={{ height: '52px' }}
            />
          </div>

          {/* Send button */}
          <Button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || topicStatus !== 'ready'}
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full transition-all",
              chatInput.trim() && topicStatus === 'ready'
                ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg" 
                : "bg-gray-700 text-gray-400"
            )}
          >
            {topicStatus === 'processing' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}