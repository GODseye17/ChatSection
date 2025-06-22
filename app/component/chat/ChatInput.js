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
      // Responsive max height: smaller on mobile
      const maxHeight = window.innerWidth < 640 ? 120 : 200;
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
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

  // Suggested questions - responsive
  const suggestions = [
    { full: "What are the main findings?", short: "Main findings?" },
    { full: "How does this compare to previous studies?", short: "Compare studies?" },
    { full: "What are the limitations?", short: "Limitations?" },
    { full: "Explain the methodology", short: "Methodology?" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 z-20">
      <div className="w-full px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* Suggested questions - only show when no input, responsive grid */}
        {topicStatus === 'ready' && !chatInput && (
          <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-400 font-medium hidden sm:inline">Quick questions:</span>
            </div>
            <div className="flex gap-2 flex-wrap w-full sm:justify-start">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setChatInput(suggestion.full)}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-gray-100 rounded-full border border-gray-700 hover:border-purple-500/50 transition-all whitespace-nowrap"
                >
                  <span className="sm:hidden">{suggestion.short}</span>
                  <span className="hidden sm:inline">{suggestion.full}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area - responsive layout */}
        <div className="relative flex items-end gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={chatInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={topicStatus === 'ready' ? "Ask about the research..." : "Waiting for processing..."}
              disabled={topicStatus !== 'ready'}
              className={cn(
                "w-full resize-none bg-gray-800/50 border border-gray-700 rounded-xl sm:rounded-2xl",
                "text-gray-100 placeholder-gray-500 p-3 sm:p-4 pr-12",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500",
                "transition-all min-h-[48px] sm:min-h-[52px]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "text-sm sm:text-base"
              )}
              rows={1}
              style={{ 
                height: window.innerWidth < 640 ? '48px' : '52px',
                maxHeight: window.innerWidth < 640 ? '120px' : '200px'
              }}
            />
          </div>

          {/* Send button - responsive size */}
          <Button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || topicStatus !== 'ready'}
            size="icon"
            className={cn(
              "h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl transition-all flex-shrink-0",
              chatInput.trim() && topicStatus === 'ready'
                ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105" 
                : "bg-gray-700 text-gray-400"
            )}
          >
            {topicStatus === 'processing' ? (
              <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
            ) : (
              <Send className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </Button>
        </div>

        {/* Character count - mobile only, subtle */}
        {chatInput && (
          <div className="mt-2 text-right sm:hidden">
            <span className="text-xs text-gray-500">
              {chatInput.length} characters
            </span>
          </div>
        )}
      </div>
    </div>
  );
}