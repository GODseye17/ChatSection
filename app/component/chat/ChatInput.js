// app/component/chat/ChatInput.js
import React, { useRef, useEffect } from 'react';
import { Send, Loader2, CheckCircle, Search, Paperclip, Mic } from 'lucide-react';
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

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Status indicators */}
        {topicStatus === 'processing' && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Processing articles... This may take a few moments
            </Badge>
          </div>
        )}
        {topicStatus === 'ready' && chatInput.length === 0 && (
          <div className="flex justify-center">
            <Badge variant="default" className="gap-2 bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-3 h-3" />
              Ready! You can now ask questions about the research
            </Badge>
          </div>
        )}

        {/* Input area - Claude style */}
        <div className="relative">
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-lg hover:border-gray-600 transition-colors">
            <div className="flex items-end gap-2 p-2">
              {/* Textarea */}
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={chatInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={topicStatus === 'ready' ? "Ask about the research..." : "Waiting for articles to be processed..."}
                  disabled={topicStatus !== 'ready'}
                  className="min-h-[24px] max-h-[200px] resize-none bg-transparent border-0 focus:ring-0 py-3 px-3"
                  rows={1}
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 pb-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-gray-100"
                  disabled={topicStatus !== 'ready'}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || topicStatus !== 'ready'}
                  size="icon"
                  className="h-8 w-8"
                  variant={chatInput.trim() ? "default" : "ghost"}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Suggestions */}
            {topicStatus === 'ready' && !chatInput && (
              <div className="px-3 pb-3 -mt-1">
                <div className="flex gap-2 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-700 text-xs border-gray-600"
                    onClick={() => setChatInput("What are the key findings?")}
                  >
                    What are the key findings?
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-700 text-xs border-gray-600"
                    onClick={() => setChatInput("Summarize the methodology")}
                  >
                    Summarize the methodology
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-700 text-xs border-gray-600"
                    onClick={() => setChatInput("What are the limitations?")}
                  >
                    What are the limitations?
                  </Badge>
                </div>
              </div>
            )}
          </Card>

          {/* Character counter */}
          {chatInput.length > 0 && (
            <span className="absolute bottom-3 right-12 text-xs text-gray-500">
              {chatInput.length}/4000
            </span>
          )}
        </div>

        {/* New search link */}
        <div className="text-center">
          <button
            onClick={() => setIsSearchView(true)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-100 transition-colors"
          >
            <Search className="w-3 h-3" />
            New Search
          </button>
        </div>
      </div>
    </div>
  );
}