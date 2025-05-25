// app/hooks/useTopicStatus.js
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useTopicStatus = (topicId) => {
  const [status, setStatus] = useState('idle');
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!topicId || status === 'ready') return;

    const checkStatus = async () => {
      try {
        const data = await apiService.checkTopicStatus(topicId);
        
        if (data.status === 'completed' || data.status === 'ready') {
          setStatus('ready');
          const fetchedArticles = await apiService.fetchTopicArticles(topicId);
          setArticles(fetchedArticles);
        } else {
          setStatus(data.status);
        }
      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    };

    // Initial check
    checkStatus();

    // Poll if processing
    if (status === 'processing') {
      const interval = setInterval(checkStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [topicId, status]);

  return { status, articles, error };
};