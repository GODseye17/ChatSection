// app/component/chat/ChatMessage.js
import React, { useState, useEffect } from 'react';
import { Loader2, ExternalLink, Copy, Check, RotateCw, User, Bot, Sparkles, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/app/lib/utils';

// Function to convert PubMed IDs to links
const processPubMedLinks = (text) => {
  let processedText = text;
  
  // Replace clear PubMed ID references
  processedText = processedText.replace(/(?:PubMed ID|PMID):\s*(\d{7,8})/gi, (match, id) => {
    return `[PubMed ID: ${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/)`;
  });
  
  // Replace IDs in table cells (between pipes)
  processedText = processedText.replace(/\|\s*(\d{7,8})\s*\|/g, (match, id) => {
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
      setIsTyping(true);
      const text = message.text;
      const words = text.split(' ');
      let currentWordIndex = 0;
      let displayedWords = [];

      const streamText = () => {
        if (currentWordIndex < words.length) {
          displayedWords.push(words[currentWordIndex]);
          setDisplayText(displayedWords.join(' '));
          currentWordIndex++;
          setTimeout(streamText, 20); // Faster streaming
        } else {
          setIsTyping(false);
        }
      };

      streamText();
    } else {
      setDisplayText(message.text);
    }
  }, [message.text, message.type, message.isLoading]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // System message
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4 animate-in fade-in duration-300">
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm",
          message.isError 
            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
        )}>
          <Sparkles className="w-4 h-4" />
          {message.text}
        </div>
      </div>
    );
  }

  // Loading state with skeleton
  if (message.isLoading) {
    return (
      <div className={cn(
        "flex gap-4 max-w-4xl mx-auto",
        "animate-in fade-in slide-in-from-left duration-300"
      )}>
        <Avatar className="h-10 w-10 border border-purple-600/20">
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <Bot className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-purple-400">Vivum AI</span>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              Analyzing
            </Badge>
          </div>
          <Card className="p-4 border-purple-600/20 bg-purple-600/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/10 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-300">{message.text}</p>
                <div className="mt-2 flex gap-2">
                  <div className="h-2 w-32 bg-purple-600/20 rounded animate-pulse" />
                  <div className="h-2 w-24 bg-purple-600/20 rounded animate-pulse" />
                  <div className="h-2 w-28 bg-purple-600/20 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // User message
  if (message.type === 'user') {
    return (
      <div className={cn(
        "flex gap-4 max-w-4xl mx-auto",
        "animate-in fade-in slide-in-from-right duration-300"
      )}>
        <div className="flex-1">
          <div className="flex justify-end items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-300">You</span>
          </div>
          <Card className="p-4 bg-gray-800/50 border-gray-700 ml-12">
            <p className="text-gray-100">{message.text}</p>
          </Card>
        </div>
        <Avatar className="h-10 w-10 border border-gray-700">
          <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-white">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  // Assistant message
  return (
    <div className={cn(
      "flex gap-4 max-w-4xl mx-auto group",
      "animate-in fade-in slide-in-from-left duration-300"
    )}>
      <Avatar className="h-10 w-10 border border-purple-600/20">
        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <Bot className="w-5 h-5" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-purple-400">Vivum AI</span>
          {message.isError && <Badge variant="destructive" className="text-xs">Error</Badge>}
          {isTyping && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Typing
            </Badge>
          )}
        </div>
        
        <Card className={cn(
          "p-5 relative transition-all",
          message.isError 
            ? "border-red-500/20 bg-red-500/5" 
            : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
        )}>
          {/* Message actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Message content */}
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => <h1 className="text-xl font-bold mb-4 mt-5 text-gray-100">{children}</h1>,
                h2: ({children}) => <h2 className="text-lg font-bold mb-3 mt-4 text-gray-100">{children}</h2>,
                h3: ({children}) => <h3 className="text-base font-bold mb-2 mt-3 text-gray-100">{children}</h3>,
                p: ({children}) => <p className="mb-3 leading-relaxed text-gray-200">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1.5 ml-2">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1.5 ml-2">{children}</ol>,
                li: ({children}) => <li className="text-gray-200">{children}</li>,
                code: ({inline, children}) => 
                  inline ? 
                    <code className="bg-purple-600/10 px-1.5 py-0.5 rounded text-sm font-mono text-purple-300 border border-purple-600/20">{children}</code> :
                    <pre className="bg-gray-800/50 p-4 rounded-lg my-3 overflow-x-auto border border-gray-700">
                      <code className="text-sm font-mono text-gray-300">{children}</code>
                    </pre>,
                table: ({children}) => (
                  <div className="my-4 w-full overflow-x-auto rounded-lg border border-gray-700">
                    <table className="w-full divide-y divide-gray-700">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({children}) => (
                  <thead className="bg-purple-600/10">
                    {children}
                  </thead>
                ),
                tbody: ({children}) => (
                  <tbody className="divide-y divide-gray-700">
                    {children}
                  </tbody>
                ),
                tr: ({children}) => (
                  <tr className="hover:bg-gray-800/30 transition-colors">
                    {children}
                  </tr>
                ),
                th: ({children}) => (
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({children}) => (
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {children}
                  </td>
                ),
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-purple-500 pl-4 my-4 italic text-gray-300 bg-purple-600/5 py-2 pr-4 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                a: ({href, children}) => {
                  const isPubMedLink = href && href.includes('pubmed.ncbi.nlm.nih.gov');
                  return (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/30 underline-offset-2 inline-flex items-center gap-1 transition-colors"
                    >
                      {children}
                      {isPubMedLink && <ExternalLink className="w-3 h-3" />}
                    </a>
                  );
                },
                strong: ({children}) => <strong className="font-semibold text-gray-50">{children}</strong>,
                em: ({children}) => <em className="italic text-gray-300">{children}</em>,
                hr: () => <hr className="my-6 border-gray-700" />,
              }}
            >
              {isTyping ? displayText : processPubMedLinks(message.text)}
            </ReactMarkdown>
          </div>

          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Citations</span>
                <Badge variant="outline" className="text-xs border-purple-600/30">
                  {message.citations.length} sources
                </Badge>
              </div>
              <div className="space-y-2">
                {message.citations.map((citation, cidx) => (
                  <div key={cidx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-800/30 transition-colors">
                    <span className="text-purple-400 font-mono text-sm mt-0.5">[{cidx + 1}]</span>
                    <div className="flex-1">
                      <a 
                        href={`https://doi.org/${citation.doi}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 text-sm font-medium"
                      >
                        {citation.title}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <p className="text-xs text-gray-500 mt-0.5">{citation.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}