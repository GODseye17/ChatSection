// app/component/canvas/Canvas.js
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Code2, 
  FileText, 
  BarChart3, 
  Table, 
  X, 
  Maximize2, 
  Copy, 
  Check,
  Download,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

// Canvas types
const CANVAS_TYPES = {
  CODE: 'code',
  DOCUMENT: 'document',
  TABLE: 'table',
  CHART: 'chart',
  DIAGRAM: 'diagram'
};

const getCanvasIcon = (type) => {
  switch (type) {
    case CANVAS_TYPES.CODE:
      return Code2;
    case CANVAS_TYPES.DOCUMENT:
      return FileText;
    case CANVAS_TYPES.TABLE:
      return Table;
    case CANVAS_TYPES.CHART:
      return BarChart3;
    default:
      return FileText;
  }
};

export default function Canvas({ 
  content, 
  type, 
  title, 
  language,
  onClose,
  onUpdate,
  isGenerating = false
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const Icon = getCanvasIcon(type);

  useEffect(() => {
    // Trigger animation on mount
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'canvas'}.${language || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn(
      "relative",
      isFullscreen && "fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-sm p-4 flex items-center justify-center"
    )}>
      <Card className={cn(
        "border-purple-600/20 bg-gray-900/90 backdrop-blur-sm overflow-hidden",
        "transition-all duration-500",
        isAnimating && "animate-in slide-in-from-right-5 fade-in",
        isFullscreen ? "w-full h-full max-w-6xl" : "w-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg bg-purple-600/10",
              isAnimating && "animate-pulse"
            )}>
              <Icon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100">{title || 'Canvas'}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {type}
                </Badge>
                {language && (
                  <Badge variant="outline" className="text-xs">
                    {language}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="h-8 w-8"
            >
              <Download className="h-4 w-4" />
            </Button>
            {onUpdate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onUpdate}
                className="h-8 w-8"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={cn(
          "p-4 overflow-auto",
          isFullscreen ? "h-[calc(100%-4rem)]" : "max-h-[600px]"
        )}>
          {isGenerating ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-800 rounded animate-pulse w-1/2" />
            </div>
          ) : (
            <CanvasContent type={type} content={content} language={language} />
          )}
        </div>
      </Card>
    </div>
  );
}

// Separate component for rendering different content types
function CanvasContent({ type, content, language }) {
  switch (type) {
    case CANVAS_TYPES.CODE:
      return (
        <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
          <code className="text-sm font-mono text-gray-300">
            {content}
          </code>
        </pre>
      );
    
    case CANVAS_TYPES.DOCUMENT:
      return (
        <div className="prose prose-invert prose-sm max-w-none">
          {content}
        </div>
      );
    
    case CANVAS_TYPES.TABLE:
      return (
        <div className="overflow-x-auto">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    
    case CANVAS_TYPES.CHART:
      return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center">
          <div className="text-gray-500">Chart visualization would go here</div>
        </div>
      );
    
    default:
      return <div className="text-gray-300">{content}</div>;
  }
}