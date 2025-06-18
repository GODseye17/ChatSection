// app/component/search/MultiTopicSearch.js
import React, { useState } from 'react';
import { Plus, X, Info, HelpCircle, Code2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '@/app/lib/utils';

export default function MultiTopicSearch({ 
  topics, 
  setTopics, 
  operator, 
  setOperator,
  useMultiTopic,
  setUseMultiTopic,
  onSearch 
}) {
  const [showAdvancedQuery, setShowAdvancedQuery] = useState(false);
  const [advancedQuery, setAdvancedQuery] = useState('');

  const addTopic = () => {
    if (topics.length < 5) {
      setTopics([...topics, '']);
    }
  };

  const removeTopic = (index) => {
    if (topics.length > 1) {
      setTopics(topics.filter((_, i) => i !== index));
    }
  };

  const updateTopic = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const getPreviewQuery = () => {
    const validTopics = topics.filter(t => t.trim());
    if (validTopics.length === 0) return '';
    if (validTopics.length === 1) return validTopics[0];

    return validTopics
      .map(t => t.includes(' ') ? `"${t}"` : t)
      .join(` ${operator} `);
  };

  const handleAdvancedSearch = () => {
    onSearch({ advanced_query: advancedQuery });
  };

  return (
    <Card className="border-gray-700 bg-gray-900/50 backdrop-blur-sm p-6 mb-6">
      <div className="space-y-4">
        
        {/* Toggle Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setUseMultiTopic(!useMultiTopic)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                useMultiTopic ? "bg-purple-600" : "bg-gray-700"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  useMultiTopic ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <label className="text-sm font-medium text-gray-300">
              Advanced Search Mode
            </label>
            <Badge variant="outline" className="text-xs">Beta</Badge>
          </div>

          {useMultiTopic && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedQuery(!showAdvancedQuery)}
              className="gap-2 text-xs"
            >
              <Code2 className="w-3 h-3" />
              {showAdvancedQuery ? 'Boolean Mode' : 'Query Builder'}
            </Button>
          )}
        </div>

        {/* Advanced Search Block */}
        {useMultiTopic && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            
            {/* Query Builder Mode */}
            {!showAdvancedQuery ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Info className="w-4 h-4" />
                    <span>Combine multiple topics with boolean operators</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Operator:</span>
                    <div className="flex gap-1">
                      {['AND', 'OR', 'NOT'].map(op => (
                        <button
                          key={op}
                          onClick={() => setOperator(op)}
                          className={cn(
                            "px-3 py-1 text-xs rounded-md transition-colors",
                            operator === op
                              ? "bg-purple-600 text-white"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                          )}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                    <button className="ml-2 text-gray-500 hover:text-gray-300">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {topics.map((topic, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => updateTopic(index, e.target.value)}
                          placeholder={`Topic ${index + 1}`}
                          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        {topics.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTopic(index)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        {index < topics.length - 1 && (
                          <Badge variant="outline" className="text-xs">
                            {operator}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {topics.length < 5 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addTopic}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Topic
                    </Button>
                  )}

                  {getPreviewQuery() && (
                    <div className="p-3 bg-purple-600/10 rounded-lg border border-purple-600/20">
                      <p className="text-xs text-purple-400 mb-1">Query Preview:</p>
                      <code className="text-sm text-purple-300 font-mono">
                        {getPreviewQuery()}
                      </code>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Advanced Query Mode */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Code2 className="w-4 h-4" />
                    <span>Write a custom PubMed query</span>
                  </div>

                  <textarea
                    value={advancedQuery}
                    onChange={(e) => setAdvancedQuery(e.target.value)}
                    placeholder='Example: (diabetes[MeSH] OR "diabetes mellitus"[Title]) AND treatment[MeSH] NOT insulin'
                    className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono"
                  />

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Quick examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'cancer[MeSH] AND immunotherapy',
                        '"machine learning" AND healthcare',
                        'COVID-19 AND vaccine NOT mRNA'
                      ].map((example, i) => (
                        <button
                          key={i}
                          onClick={() => setAdvancedQuery(example)}
                          className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 rounded border border-gray-700"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleAdvancedSearch}
                      disabled={!advancedQuery.trim()}
                      size="sm"
                      className="gap-2"
                    >
                      <Code2 className="w-4 h-4" />
                      Run Advanced Query
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Boolean Help Section */}
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-xs text-gray-400">
              <p className="font-medium mb-1">Boolean Operators:</p>
              <ul className="space-y-1 ml-4">
                <li><span className="text-purple-400">AND</span> - Both terms must be present</li>
                <li><span className="text-purple-400">OR</span> - Either term can be present</li>
                <li><span className="text-purple-400">NOT</span> - Exclude terms after NOT</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
