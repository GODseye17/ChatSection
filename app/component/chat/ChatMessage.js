// app/component/chat/ChatMessage.js
import React, { useState, useEffect } from 'react';
import { Loader2, ExternalLink, Copy, Check, User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { cn } from '@/app/lib/utils';

// Function to convert PubMed IDs to links
const processPubMedLinks = (text) => {
  let processedText = text;
  
  // Replace PMID references in various formats
  processedText = processedText.replace(/(?:PubMed ID|PMID|pmid):\s*(\d{7,9})/gi, (match, id) => {
    return `[PMID: ${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/)`;
  });
  
  // Replace standalone PMIDs in parentheses
  processedText = processedText.replace(/\(PMID:\s*(\d{7,9})\)/gi, (match, id) => {
    return `([PMID: ${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/))`;
  });
  
  // Replace PMIDs in table cell
  processedText = processedText.replace(/\|\s*(\d{7,9})\s*\|/g, (match, id) => {
    return `| [${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/) |`;
  });
  
  return processedText;
};

export default function ChatMessage({ message }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (message.type === 'assistant' && !message.isLoading) {
      // Show full text immediately for better UX
      setDisplayText(message.text);
    } else {
      setDisplayText(message.text);
    }
  }, [message.text, message.type, message.isLoading]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // System message - responsive
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-3 sm:my-4 px-3 sm:px-4">
        <div className={cn(
          "inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm",
          message.isError 
            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
        )}>
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-center">{message.text}</span>
        </div>
      </div>
    );
  }

  // Loading state - responsive
  if (message.isLoading) {
    return (
      <div className="flex gap-3 sm:gap-4 w-full px-3 sm:px-4">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-purple-600/20 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-purple-400">Vivum AI</span>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="hidden sm:inline">Analyzing</span>
            </Badge>
          </div>
          <Card className="p-3 sm:p-4 border-purple-600/20 bg-purple-600/5">
            <p className="text-xs sm:text-sm text-purple-300">{message.text}</p>
          </Card>
        </div>
      </div>
    );
  }

  // User message - responsive
  if (message.type === 'user') {
    return (
      <div className="flex gap-3 sm:gap-4 w-full px-3 sm:px-4">
        <div className="flex-1 min-w-0">
          <div className="flex justify-end items-center gap-2 mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-300">You</span>
          </div>
          <Card className="p-3 sm:p-4 bg-gray-800/50 border-gray-700 ml-8 sm:ml-12">
            <p className="text-sm sm:text-base text-gray-100 break-words">{message.text}</p>
          </Card>
        </div>
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-gray-700 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-white">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  // Assistant message - responsive
  return (
    <div className="flex gap-3 sm:gap-4 w-full px-3 sm:px-4 group">
      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-purple-600/20 flex-shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-purple-400">Vivum AI</span>
          {message.isError && <Badge variant="destructive" className="text-xs">Error</Badge>}
        </div>
        
        <Card className={cn(
          "p-4 sm:p-5 relative transition-all",
          message.isError 
            ? "border-red-500/20 bg-red-500/5" 
            : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
        )}>
          {/* Copy button - responsive positioning */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-8 sm:w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 h-3 sm:h-4 sm:w-4 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>

          {/* Message content with markdown - responsive typography */}
          <div className="prose prose-invert prose-sm sm:prose-base max-w-none pr-8 sm:pr-10">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({children}) => <p className="mb-2 sm:mb-3 leading-relaxed text-gray-200 text-sm sm:text-base">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-2 sm:mb-3 space-y-1 sm:space-y-1.5 ml-1 sm:ml-2 text-sm sm:text-base">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside mb-2 sm:mb-3 space-y-1 sm:space-y-1.5 ml-1 sm:ml-2 text-sm sm:text-base">{children}</ol>,
                li: ({children}) => <li className="text-gray-200 text-sm sm:text-base">{children}</li>,
                a: ({href, children}) => {
                  const isPubMedLink = href && href.includes('pubmed.ncbi.nlm.nih.gov');
                  return (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/30 underline-offset-2 inline-flex items-center gap-1 text-sm sm:text-base break-all sm:break-normal"
                    >
                      {children}
                      {isPubMedLink && <ExternalLink className="w-3 h-3 flex-shrink-0" />}
                    </a>
                  );
                },
                strong: ({children}) => <strong className="font-semibold text-gray-50 text-sm sm:text-base">{children}</strong>,
                h1: ({children}) => <h1 className="text-lg sm:text-xl font-bold text-gray-100 mb-2 sm:mb-3">{children}</h1>,
                h2: ({children}) => <h2 className="text-base sm:text-lg font-semibold text-gray-100 mb-2 sm:mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-sm sm:text-base font-semibold text-gray-100 mb-1 sm:mb-2">{children}</h3>,
                table: ({children}) => (
                  <div className="overflow-x-auto mb-2 sm:mb-3">
                    <table className="min-w-full text-xs sm:text-sm border-collapse border border-gray-700">{children}</table>
                  </div>
                ),
                th: ({children}) => <th className="border border-gray-700 px-2 py-1 bg-gray-800 text-left text-xs sm:text-sm">{children}</th>,
                td: ({children}) => <td className="border border-gray-700 px-2 py-1 text-xs sm:text-sm">{children}</td>,
                code: ({children}) => <code className="bg-gray-800 px-1 py-0.5 rounded text-xs sm:text-sm font-mono">{children}</code>,
                pre: ({children}) => (
                  <div className="overflow-x-auto mb-2 sm:mb-3">
                    <pre className="bg-gray-800 p-2 sm:p-3 rounded text-xs sm:text-sm font-mono whitespace-pre-wrap">{children}</pre>
                  </div>
                ),
              }}
            >
              {processPubMedLinks(displayText)}
            </ReactMarkdown>
          </div>
        </Card>
      </div>
    </div>
  );
}