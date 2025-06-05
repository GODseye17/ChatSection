import React from 'react';
import { Clock, Search, ChevronRight, FileText } from 'lucide-react';
import { formatTimestamp } from '../../utils/formatters';
import { ScrollArea } from '../ui/scroll-area';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/app/lib/utils';
import Image from 'next/image';
import logo from '@/app/assets/Vivum.png';

export default function Sidebar({
  sidebarOpen,
  conversationHistory,
  onSelectConversation
}) {
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300",
      "bg-gray-900 border-r border-gray-800",
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    )}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* 3D Sphere with emerging logo */}
              <div className="relative w-12 h-12">
                {/* Black sphere base with gradient and shadow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-xl">
                  {/* Inner shadow for depth */}
                  <div className="absolute inset-0.5 rounded-full bg-gradient-to-tl from-transparent via-gray-800/20 to-gray-700/40"></div>
                  {/* Highlight for 3D effect */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 rounded-full bg-gradient-to-br from-gray-600/60 to-transparent blur-sm"></div>
                </div>
                
                {/* Logo emerging from sphere */}
                <div className="absolute top-0.5 left-0.5 w-11 h-11 rounded-full overflow-hidden border border-gray-700/50 shadow-lg transform hover:scale-105 transition-transform duration-300">
                  {/* Using Next.js Image component */}
                  <div className="relative w-full h-full">
                    <Image 
                      src={logo} 
                      alt="Vivum Logo" 
                      fill
                      className="object-cover filter brightness-110 contrast-105"
                      priority
                    />
                    {/* Subtle overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/20 rounded-full"></div>
                  </div>

                  {/* Option 2: Using regular img tag (if Image component doesn't work) */}
                  {/* 
                  <img 
                    src="/assets/Vivum.png" 
                    alt="Vivum Logo" 
                    className="w-full h-full object-cover filter brightness-110 contrast-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/20 rounded-full"></div>
                  */}
                </div>

                {/* Animated glow ring */}
                <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-pulse"></div>
                
                {/* Status indicator */}
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse shadow-lg">
                  <div className="absolute inset-0.5 bg-green-400 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-xl text-gray-100" style={{ 
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: '500',
                letterSpacing: '-0.025em',
                lineHeight: '1.2'
              }}>
                Vivum
              </h1>
              <p className="text-xs text-gray-500">Research Assistant</p>
            </div>
          </div>
        </div>
        
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Recent Conversations
            </h3>
            
            {conversationHistory.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No conversations yet</p>
                <p className="text-xs text-gray-600 mt-1">Start a new search to begin</p>
              </div>
            ) : (
              conversationHistory.map((item, idx) => (
                <Card
                  key={idx}
                  className="p-3 hover:bg-gray-800 cursor-pointer transition-all group border-gray-700"
                  onClick={() => onSelectConversation(item)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-150 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-100 truncate mb-1">
                        {item.topic}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                          {item.source}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
        
        {/* User section */}
        <div className="p-4 border-t border-gray-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 hover:bg-gray-800"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                U
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium">My Profile</p>
              <p className="text-xs text-gray-500">Manage settings</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}