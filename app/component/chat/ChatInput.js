// app/component/chat/ChatInput.js
import React, { useRef, useEffect } from 'react';
import { Send, Loader2, CheckCircle, Search, Paperclip, Mic, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
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
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
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
    <div className="border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto p-4">
        <div className="space-y-3">
          {/* Status indicators */}
          {topicStatus === 'processing' && (
            <div className="flex justify-center">
              <Badge variant="secondary" className="gap-2 bg-purple-600/10 text-purple-400 border-purple-600/20">
                <Loader2 className="w-3 h-3 animate-spin" />
                Processing articles...
              </Badge>
            </div>
          )}
          
          {topicStatus === 'ready' && chatInput.length === 0 && (
            <div className="flex justify-center">
              <Badge variant="default" className="gap-2 bg-green-600/10 text-green-400 border-green-600/20">
                <CheckCircle className="w-3 h-3" />
                Ready to answer your questions
              </Badge>
            </div>
          )}

          {/* Input area */}
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-xl">
            <div className="flex items-end gap-3 p-3">
              {/* Textarea */}
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={chatInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={topicStatus === 'ready' ? "Ask about the research..." : "Waiting for processing..."}
                  disabled={topicStatus !== 'ready'}
                  className="min-h-[56px] max-h-[200px] resize-none bg-transparent border-0 focus:ring-0 py-4 px-4 text-base"
                  rows={1}
                />
                
                {/* Character count */}
                {chatInput.length > 0 && (
                  <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {chatInput.length}/2000
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-gray-400 hover:text-gray-100"
                  disabled={topicStatus !== 'ready'}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || topicStatus !== 'ready'}
                  size="icon"
                  className={cn(
                    "h-10 w-10 transition-all",
                    chatInput.trim() 
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg" 
                      : "bg-gray-700 text-gray-400"
                  )}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Suggestions */}
            {topicStatus === 'ready' && !chatInput && (
              <div className="px-3 pb-3 -mt-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-gray-400">Suggested questions</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setChatInput(suggestion)}
                      className="px-3 py-1.5 text-xs bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-gray-100 rounded-lg border border-gray-600 hover:border-gray-500 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* New search link */}
          <div className="text-center">
            <button
              onClick={() => setIsSearchView(true)}
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Search className="w-3 h-3" />
              New Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}