// app/components/chat/ChatMessage.js
import React, { useState, useEffect } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const processPubMedLinks = (text) => {
  const patterns = [
    /(?:PubMed ID|PMID):\s*(\d{7,8})/gi,
    /\|\s*(\d{7,8})\s*\|/g,
  ];
  
  let processedText = text;
  
  processedText = processedText.replace(/(?:PubMed ID|PMID):\s*(\d{7,8})/gi, (match, id) => {
    return `[PubMed ID: ${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/)`;
  });
  
  processedText = processedText.replace(/\|\s*(\d{7,8})\s*\|/g, (match, id) => {
    return `| [${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/) |`;
  });
  
  return processedText;
};

export default function ChatMessage({ message }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.type === 'assistant' && !message.isLoading) {
      setIsTyping(true);
      let currentText = '';
      const text = message.text;
      let index = 0;

      const typeWriter = () => {
        if (index < text.length) {
          currentText += text.charAt(index);
          setDisplayText(currentText);
          index++;
          setTimeout(typeWriter, 20);
        } else {
          setIsTyping(false);
        }
      };

      typeWriter();
    } else {
      setDisplayText(message.text);
    }
  }, [message.text, message.type, message.isLoading]);

  if (message.isInitialLoad && !message.isLoading) {
    return null;
  }

  if (message.isLoading) {
    return (
      <div className="flex gap-3 animate-in fade-in slide-in-from-left duration-300">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-medium flex-shrink-0">
          V
        </div>
        <div className="flex-1 max-w-3xl">
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              <p className="text-base text-gray-300">
                {message.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : ''} animate-in fade-in ${
        message.type === 'user' ? 'slide-in-from-right' : 'slide-in-from-left'
      } duration-300 group`}
    >
      {message.type === 'assistant' && (
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-medium flex-shrink-0">
          V
        </div>
      )}
      
      <div className={`flex-1 max-w-3xl ${message.type === 'user' ? 'order-1' : ''}`}>
        <div 
          className={`p-4 rounded-2xl transition-all duration-300 ${
            message.type === 'user' 
              ? 'bg-blue-600 text-white' 
              : message.isError
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-white/5 border border-white/10'
          }`}
        >
          {message.type === 'assistant' ? (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({children}) => <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-100">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-bold mb-3 mt-5 text-gray-100">{children}</h2>,
                  h3: ({children}) => <h3 className="text-lg font-bold mb-3 mt-4 text-gray-100">{children}</h3>,
                  p: ({children}) => <p className="mb-4 leading-relaxed text-gray-300">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-300">{children}</ol>,
                  li: ({children}) => <li className="text-gray-300 ml-4">{children}</li>,
                  code: ({inline, children}) => 
                    inline ? 
                      <code className="bg-white/5 px-1.5 py-0.5 rounded text-sm font-mono text-blue-400">{children}</code> :
                      <pre className="bg-white/5 p-4 rounded-lg my-4 overflow-x-auto">
                        <code className="text-sm font-mono text-gray-300">{children}</code>
                      </pre>,
                  table: ({children}) => (
                    <div className="my-4 w-full overflow-x-auto rounded-lg border border-white/10">
                      <table className="w-full divide-y divide-white/10">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({children}) => (
                    <thead className="bg-white/5">
                      {children}
                    </thead>
                  ),
                  tbody: ({children}) => (
                    <tbody className="divide-y divide-white/10">
                      {children}
                    </tbody>
                  ),
                  tr: ({children}) => (
                    <tr className="hover:bg-white/5 transition-colors">
                      {children}
                    </tr>
                  ),
                  th: ({children}) => (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {children}
                    </th>
                  ),
                  td: ({children}) => (
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {children}
                    </td>
                  ),
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-blue-500/50 pl-4 my-4 italic text-gray-300">
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
                        className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
                      >
                        {children}
                        {isPubMedLink && <ExternalLink className="w-3 h-3" />}
                      </a>
                    );
                  }
                }}
              >
                {isTyping ? displayText : processPubMedLinks(message.text)}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-base">
              {message.text}
            </p>
          )}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs text-gray-400 mb-2 font-medium">Citations:</div>
              <div className="grid gap-2">
                {message.citations.map((citation, cidx) => (
                  <div key={cidx} className="bg-white/5 p-3 rounded-lg group/citation">
                    <a 
                      href={`https://doi.org/${citation.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                    >
                      {citation.title}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover/citation:opacity-100 transition-opacity" />
                    </a>
                    <div className="text-xs text-gray-500 mt-1">{citation.source}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {message.type === 'user' && (
        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 font-medium flex-shrink-0">
          U
        </div>
      )}
    </div>
  );
}