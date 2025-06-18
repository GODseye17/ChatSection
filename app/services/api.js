// app/services/api.js
const API_BASE_URL = 'https://ad-vivum-backend-production.up.railway.app';

export class VivumAPI {
  constructor() {
    this.currentTopicId = null;
    this.currentConversationId = null;
    this.pollingInterval = null;
  }

  // ============================================
  // HEALTH & STATUS ENDPOINTS
  // ============================================

  async checkSystemHealth() {
    const healthChecks = {
      server: false,
      database: false,
      models: false,
      tasks: 0,
      supabase: false
    };

    try {
      // Run health checks in parallel
      const [health, modelStatus, ping, supabase] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/health`),
        fetch(`${API_BASE_URL}/model-status`),
        fetch(`${API_BASE_URL}/ping`),
        fetch(`${API_BASE_URL}/supabase-status`)
      ]);

      // Process health check
      if (health.status === 'fulfilled' && health.value.ok) {
        const healthData = await health.value.json();
        healthChecks.server = healthData.status === 'healthy';
        healthChecks.database = healthData.database === 'connected';
      }

      // Process model status
      if (modelStatus.status === 'fulfilled' && modelStatus.value.ok) {
        const modelData = await modelStatus.value.json();
        healthChecks.models = modelData.embedding_model === 'loaded' && modelData.llm === 'loaded';
      }

      // Process ping
      if (ping.status === 'fulfilled' && ping.value.ok) {
        const pingData = await ping.value.json();
        healthChecks.tasks = pingData.active_tasks || 0;
      }

      // Process supabase status
      if (supabase.status === 'fulfilled' && supabase.value.ok) {
        const supabaseData = await supabase.value.json();
        healthChecks.supabase = supabaseData.status === 'connected';
      }

      return healthChecks;
    } catch (error) {
      console.error('Health check failed:', error);
      return healthChecks;
    }
  }

  async getCleanupStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/cleanup-status`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Cleanup status error:', error);
      return null;
    }
  }

  // ============================================
  // QUERY TRANSFORMATION
  // ============================================

  async transformQuery(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/transform-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) throw new Error('Transform failed');
      return await response.json();
    } catch (error) {
      console.error('Query transform error:', error);
      return {
        original_query: query,
        transformed_query: query,
        is_transformed: false,
        explanation: 'Transformation failed'
      };
    }
  }

  // ============================================
  // ARTICLE FETCHING
  // ============================================

  async fetchArticles(options = {}) {
    const {
      topic = null,
      topics = null,
      operator = 'AND',
      advanced_query = null,
      max_results = 20,
      auto_transform = true,
      create_embeddings = true,
      filters = null,
      onStatusUpdate = null
    } = options;

    try {
      const body = {
        max_results,
        auto_transform,
        create_embeddings
      };

      // Add search method
      if (topics && topics.length > 0) {
        body.topics = topics;
        body.operator = operator;
      } else if (advanced_query) {
        body.advanced_query = advanced_query;
      } else if (topic) {
        body.topic = topic;
      } else {
        throw new Error('Must provide topic, topics, or advanced_query');
      }

      // Add filters if provided
      if (filters && Object.keys(filters).length > 0) {
        body.filters = filters;
      }

      // Initiate fetch
      const fetchResponse = await fetch(`${API_BASE_URL}/fetch-topic-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!fetchResponse.ok) {
        const error = await fetchResponse.json();
        throw new Error(error.detail || 'Fetch failed');
      }

      const fetchData = await fetchResponse.json();
      this.currentTopicId = fetchData.topic_id;

      // Start monitoring if callback provided
      if (onStatusUpdate) {
        await this.monitorFetchProgress(this.currentTopicId, onStatusUpdate);
      }

      return {
        topicId: this.currentTopicId,
        success: true
      };

    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  async monitorFetchProgress(topicId, onStatusUpdate) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 60; // 2 minutes max

      this.pollingInterval = setInterval(async () => {
        attempts++;

        try {
          const statusResponse = await fetch(`${API_BASE_URL}/topic/${topicId}/status`);
          
          if (!statusResponse.ok) {
            throw new Error('Status check failed');
          }
          
          const statusData = await statusResponse.json();
          const status = statusData.status;
          
          console.log(`Status check ${attempts}:`, status); // Debug log

          // Callback for UI updates
          if (onStatusUpdate) {
            onStatusUpdate({
              status,
              attempts,
              maxAttempts,
              elapsed: attempts * 2,
              message: this.getStatusMessage(status)
            });
          }

          // Check completion - wait for 'completed' status specifically
          if (status === 'completed') {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            
            // Add a small delay to ensure backend has finished writing data
            setTimeout(() => {
              resolve({ status: 'completed', topicId });
            }, 500);
          } else if (status.startsWith('error') || status === 'failed') {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            reject(new Error(`Fetch failed: ${status}`));
          } else if (attempts >= maxAttempts) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            reject(new Error('Fetch timeout'));
          }

        } catch (error) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
          reject(error);
        }
      }, 2000); // Check every 2 seconds
    });
  }

  getStatusMessage(status) {
    const messages = {
      'processing': 'Processing articles...',
      'completed': 'Processing complete!',
      'failed': 'Processing failed'
    };
    return messages[status] || 'Processing...';
  }

  stopMonitoring() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // ============================================
  // ARTICLE RETRIEVAL
  // ============================================

  async getArticles(topicId = null, limit = 100, offset = 0) {
    const id = topicId || this.currentTopicId;
    if (!id) throw new Error('No topic ID provided');

    try {
      const response = await fetch(
        `${API_BASE_URL}/topic/${id}/articles?limit=${limit}&offset=${offset}`
      );

      if (!response.ok) {
        console.error('Failed to get articles:', response.status);
        throw new Error('Failed to get articles');
      }
      
      const data = await response.json();
      console.log('API getArticles response:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Get articles error:', error);
      throw error;
    }
  }

  // ============================================
  // RAG CHAT
  // ============================================

  async query(question, topicId = null, conversationId = null) {
    const id = topicId || this.currentTopicId;
    if (!id) throw new Error('No topic ID provided');

    try {
      const body = {
        topic_id: id,
        query: question
      };

      // Use existing conversation if available
      if (conversationId || this.currentConversationId) {
        body.conversation_id = conversationId || this.currentConversationId;
      }

      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Query failed');
      }

      const data = await response.json();
      
      // Save conversation ID for follow-ups
      if (data.conversation_id) {
        this.currentConversationId = data.conversation_id;
      }

      return data;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  // ============================================
  // CLEANUP
  // ============================================

  async cleanupTopic(topicId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cleanup-topic/${topicId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Cleanup failed');
      return await response.json();
    } catch (error) {
      console.error('Cleanup error:', error);
      throw error;
    }
  }

  async cleanupOldTopics(daysOld = 7) {
    try {
      const response = await fetch(`${API_BASE_URL}/cleanup-old?days=${daysOld}`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Old topics cleanup failed');
      return await response.json();
    } catch (error) {
      console.error('Old topics cleanup error:', error);
      throw error;
    }
  }

  // ============================================
  // PERFORMANCE
  // ============================================

  async testPerformance() {
    try {
      const response = await fetch(`${API_BASE_URL}/test-performance`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Performance test error:', error);
      return null;
    }
  }
}

// Create singleton instance
export const apiService = new VivumAPI();

// For debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.apiService = apiService;
}

// For backward compatibility
export default apiService;