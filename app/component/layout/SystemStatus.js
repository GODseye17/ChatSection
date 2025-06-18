// app/component/layout/SystemStatus.js
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Loader2, Activity, Database, Brain, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '@/app/lib/utils';
import { apiService } from '@/app/services/api';

export default function SystemStatus({ isOpen, onClose }) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    if (isOpen) {
      checkHealth();
      checkPerformance();
    }
  }, [isOpen]);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const healthData = await apiService.checkSystemHealth();
      setHealth(healthData);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPerformance = async () => {
    try {
      const perfData = await apiService.testPerformance();
      setPerformance(perfData);
    } catch (error) {
      console.error('Performance check failed:', error);
    }
  };

  const cleanupOldTopics = async () => {
    if (confirm('Clean up topics older than 7 days?')) {
      try {
        const result = await apiService.cleanupOldTopics(7);
        alert(`Cleaned ${result.cleaned} topics, failed ${result.failed}`);
        checkHealth(); // Refresh status
      } catch (error) {
        alert(`Cleanup failed: ${error.message}`);
      }
    }
  };

  const getStatusIcon = (status) => {
    if (status === true) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === false) return <XCircle className="w-4 h-4 text-red-500" />;
    return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusColor = (status) => {
    if (status === true) return 'text-green-500';
    if (status === false) return 'text-red-500';
    return 'text-yellow-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold">System Status</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <XCircle className="w-5 h-5" />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
              <p className="text-gray-400">Checking system health...</p>
            </div>
          ) : (
            <>
              {/* Core Services */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Core Services</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                    {getStatusIcon(health?.server)}
                    <div>
                      <p className="font-medium">API Server</p>
                      <p className={cn("text-sm", getStatusColor(health?.server))}>
                        {health?.server ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                    {getStatusIcon(health?.database)}
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Database</p>
                        <p className={cn("text-sm", getStatusColor(health?.database))}>
                          {health?.database ? 'Connected' : 'Disconnected'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                    {getStatusIcon(health?.models)}
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium">AI Models</p>
                        <p className={cn("text-sm", getStatusColor(health?.models))}>
                          {health?.models ? 'Loaded' : 'Not Ready'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                    {getStatusIcon(health?.supabase)}
                    <div>
                      <p className="font-medium">Supabase</p>
                      <p className={cn("text-sm", getStatusColor(health?.supabase))}>
                        {health?.supabase ? 'Connected' : 'Disconnected'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Tasks */}
              {health?.tasks > 0 && (
                <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
                    <div>
                      <p className="font-medium text-yellow-300">Active Tasks</p>
                      <p className="text-sm text-yellow-400">{health.tasks} operations in progress</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              {performance && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Performance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">
                        {performance.search_time?.toFixed(2)}s
                      </p>
                      <p className="text-sm text-gray-400">Avg Search Time</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">
                        {performance.embedding_time?.toFixed(2)}s
                      </p>
                      <p className="text-sm text-gray-400">Avg Embedding Time</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-400">
                        {performance.query_time?.toFixed(2)}s
                      </p>
                      <p className="text-sm text-gray-400">Avg Query Time</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cleanup Status */}
              {health?.cleanup && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Storage Management</h3>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-gray-500" />
                        <p className="font-medium">Cleanup Status</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cleanupOldTopics}
                        className="text-xs"
                      >
                        Clean Old Topics
                      </Button>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p>Topics: {health.cleanup.total_topics || 0}</p>
                      <p>Old topics (7+ days): {health.cleanup.old_topics || 0}</p>
                      <p>Total size: {health.cleanup.total_size || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <Button
                  variant="outline"
                  onClick={checkHealth}
                  className="gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Refresh
                </Button>
                <Button
                  variant="default"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}