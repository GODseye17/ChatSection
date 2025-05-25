// app/components/chat/ChatMessage.js
import React from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Function to convert PubMed IDs to links
const processPubMedLinks = (text) => {
  // Multiple patterns to match PubMed IDs in different contexts
  const patterns = [
    // Match "PubMed ID: 12345678" or "PMID: 12345678"
    /(?:PubMed ID|PMID):\s*(\d{7,8})/gi,
    // Match standalone 7-8 digit numbers in specific contexts
    /\|\s*(\d{7,8})\s*\|/g,
    // Match "12345678 |" pattern
    /\|\s*(\d{7,8})\s*\|/g,
  ];
  
  let processedText = text;
  
  // First pass: Replace clear PubMed ID references
  processedText = processedText.replace(/(?:PubMed ID|PMID):\s*(\d{7,8})/gi, (match, id) => {
    return `[PubMed ID: ${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/)`;
  });
  
  // Second pass: Replace IDs in table cells (between pipes)
  processedText = processedText.replace(/\|\s*(\d{7,8})\s*\|/g, (match, id) => {
    return `| [${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/) |`;
  });
  
  return processedText;
};

export default function ChatMessage({ message }) {
  // Don't render the initial loading message once articles are ready
  if (message.isInitialLoad && !message.isLoading) {
    return (
      <div className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : ''}`}>
        {message.type === 'assistant' && (
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            V
          </div>
        )}
        
        <div className={`max-w-2xl ${message.type === 'user' ? 'order-1' : ''}`}>
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <p className="text-sm md:text-base">
              {message.text}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state with animation
  if (message.isLoading) {
    return (
      <div className="flex gap-4 animate-in fade-in slide-in-from-left duration-300">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 animate-pulse">
          V
        </div>
        <div className="max-w-2xl">
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400" />
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {message.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular message rendering with animations
  return (
    <div className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : ''} animate-in fade-in ${message.type === 'user' ? 'slide-in-from-right' : 'slide-in-from-left'} duration-300`}>
      {message.type === 'assistant' && (
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          V
        </div>
      )}
      
      <div className={`max-w-2xl ${message.type === 'user' ? 'order-1' : ''}`}>
        <div className={`p-4 rounded-2xl ${
          message.type === 'user' 
            ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white' 
            : message.isError
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
        }`}>
          {message.type === 'assistant' ? (
            <div className="w-full overflow-hidden">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom rendering for various elements
                  h1: ({children}) => <h1 className="text-2xl font-bold mb-3 mt-4">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-bold mb-2 mt-3">{children}</h2>,
                  h3: ({children}) => <h3 className="text-lg font-bold mb-2 mt-3">{children}</h3>,
                  p: ({children}) => <p className="mb-3 leading-7 text-gray-700 dark:text-gray-300">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1 ml-4">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">{children}</ol>,
                  li: ({children}) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
                  code: ({inline, children}) => 
                    inline ? 
                      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-purple-600 dark:text-purple-400">{children}</code> :
                      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-3 overflow-x-auto">
                        <code className="text-sm font-mono">{children}</code>
                      </pre>,
                  table: ({children}) => (
                    <div className="my-4 w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({children}) => (
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      {children}
                    </thead>
                  ),
                  tbody: ({children}) => (
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {children}
                    </tbody>
                  ),
                  tr: ({children}) => (
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      {children}
                    </tr>
                  ),
                  th: ({children}) => (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                      {children}
                    </th>
                  ),
                  td: ({children}) => (
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {children}
                    </td>
                  ),
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-purple-500 pl-4 my-3 italic text-gray-700 dark:text-gray-300">
                      {children}
                    </blockquote>
                  ),
                  a: ({href, children}) => {
                    // Check if this is a PubMed link
                    const isPubMedLink = href && href.includes('pubmed.ncbi.nlm.nih.gov');
                    return (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
                      >
                        {children}
                        {isPubMedLink && <ExternalLink className="w-3 h-3" />}
                      </a>
                    );
                  },
                  strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                  em: ({children}) => <em className="italic">{children}</em>,
                  hr: () => <hr className="my-4 border-gray-200 dark:border-gray-700" />,
                }}
              >
                {processPubMedLinks(message.text)}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm md:text-base">
              {message.text}
            </p>
          )}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Citations:</div>
              {message.citations.map((citation, cidx) => (
                <div key={cidx} className="text-sm mb-2">
                  <a href={`https://doi.org/${citation.doi}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                    {citation.title}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-xs text-gray-500 dark:text-gray-400"> - {citation.source}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {message.type === 'user' && (
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold flex-shrink-0">
          U
        </div>
      )}
    </div>
  );
}