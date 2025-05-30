// app/component/chat/ChatInput.js
import React from 'react';
import { Send, Loader2, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function ChatInput({
  chatInput,
  setChatInput,
  handleSendMessage,
  topicStatus,
  setIsSearchView,
  onTyping
}) {
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
    <div className="p-4 space-y-3">
      {topicStatus === 'processing' && (
        <div className="flex items-center justify-center">
          <Badge variant="secondary" className="bg-amber-900/20 text-amber-500 border-amber-900/50">
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Processing articles... This may take a few moments
          </Badge>
        </div>
      )}
      
      <Card className="p-2 border-gray-800 bg-gray-900/50">
        <div className="flex items-end gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchView(true)}
                  className="text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Search</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex-1 relative">
            <Input
              type="text"
              value={chatInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={
                topicStatus === 'ready' 
                  ? "Ask a question about the research..." 
                  : "Waiting for articles to be processed..."
              }
              disabled={topicStatus !== 'ready'}
              className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 pr-2 py-6 text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {topicStatus !== 'ready' && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <AlertCircle className="h-5 w-5 text-gray-500" />
              </div>
            )}
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || topicStatus !== 'ready'}
                  size="icon"
                  className="h-10 w-10 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Card>
      
      <div className="flex justify-center">
        <p className="text-xs text-gray-500">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}