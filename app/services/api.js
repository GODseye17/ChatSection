// app/services/api.js
const API_BASE_URL = 'https://ad-vivum-backend-production.up.railway.app';

export const apiService = {
  // Status checks
  async checkModelStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/model-status`);
      return response.ok;
    } catch (error) {
      console.error('❌ Model status check failed:', error);
      return false;
    }
  },

  async checkSupabaseStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/supabase-status`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.status === 'connected';
    } catch (error) {
      console.error('❌ Supabase status check failed:', error);
      return false;
    }
  },

  async checkAPIStatus() {
    console.log('🔍 Checking API status...');
    const [model, supabase] = await Promise.all([
      this.checkModelStatus(),
      this.checkSupabaseStatus()
    ]);
    
    console.log('✅ API Status Check Complete:', { model, supabase });
    return { model, supabase };
  },

  // Topic operations
  async fetchTopicData(topic, source, filters = null) {
    console.log(`📤 Sending request to ${API_BASE_URL}/fetch-topic-data`);
    
    // Build request payload that matches backend expectations
    const requestPayload = {
      topic,  // Single topic for backward compatibility
      source: source.toLowerCase(),
      max_results: 20  // Default value
    };
    
    // Only add filters if they exist and have content
    if (filters && Object.keys(filters).length > 0) {
      requestPayload.filters = filters;
    }
    
    console.log('📤 Request payload:', requestPayload);
    
    const response = await fetch(`${API_BASE_URL}/fetch-topic-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log(`📥 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Topic data received:', data);
    return data;
  },

  // Multi-topic boolean search (for advanced users)
  async fetchMultiTopicData(topics, operator = 'AND', source = 'pubmed', filters = null, maxResults = 20) {
    console.log(`📤 Sending multi-topic request to ${API_BASE_URL}/fetch-topic-data`);
    
    const requestPayload = {
      topics,  // Array of topics
      operator,  // AND, OR, NOT
      source: source.toLowerCase(),
      max_results: maxResults
    };
    
    // Only add filters if they exist and have content
    if (filters && Object.keys(filters).length > 0) {
      requestPayload.filters = filters;
    }
    
    console.log('📤 Multi-topic request payload:', requestPayload);
    
    const response = await fetch(`${API_BASE_URL}/fetch-topic-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log(`📥 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Multi-topic data received:', data);
    return data;
  },

  // Advanced query search (for power users)
  async fetchAdvancedQuery(advancedQuery, source = 'pubmed', filters = null, maxResults = 20) {
    console.log(`📤 Sending advanced query request to ${API_BASE_URL}/fetch-topic-data`);
    
    const requestPayload = {
      advanced_query: advancedQuery,
      source: source.toLowerCase(),
      max_results: maxResults
    };
    
    // Only add filters if they exist and have content
    if (filters && Object.keys(filters).length > 0) {
      requestPayload.filters = filters;
    }
    
    console.log('📤 Advanced query request payload:', requestPayload);
    
    const response = await fetch(`${API_BASE_URL}/fetch-topic-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log(`📥 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Advanced query data received:', data);
    return data;
  },

  async checkTopicStatus(topicId) {
    console.log(`🔄 Checking topic status for ID: ${topicId}`);
    
    const response = await fetch(`${API_BASE_URL}/topic/${topicId}/status`);
    
    if (!response.ok) {
      console.error(`❌ Topic status check failed with status ${response.status}:`, response.statusText);
      throw new Error(`Failed to check topic status: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`📊 Topic status response:`, data);
    return data;
  },

  async fetchTopicArticles(topicId) {
    console.log(`📚 Fetching articles for topic ID: ${topicId}`);
    
    const response = await fetch(`${API_BASE_URL}/topic/${topicId}/articles`);
    
    if (!response.ok) {
      console.error(`❌ Failed to fetch articles with status ${response.status}:`, response.statusText);
      return [];
    }
    
    const data = await response.json();
    console.log(`✅ Articles fetched successfully:`, {
      count: data.articles?.length || 0,
      articles: data.articles
    });
    
    return data.articles || [];
  },

  async sendQuery(query, topicId) {
    console.log(`📤 Sending query to ${API_BASE_URL}/query`);
    console.log('Request payload:', { query, topic_id: topicId });

    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        topic_id: topicId
      }),
    });

    console.log(`📥 Query response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details');
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Query response received:', {
      hasResponse: !!data.response,
      citationCount: data.citations?.length || 0,
      response: data
    });
    
    return data;
  }
};