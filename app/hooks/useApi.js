// app/hooks/useApi.js
import { useState, useCallback } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    execute,
    reset
  };
};

// Custom hook for managing multiple API states
export const useApiState = () => {
  const [states, setStates] = useState({});

  const setApiState = useCallback((key, state) => {
    setStates(prev => ({
      ...prev,
      [key]: state
    }));
  }, []);

  const getApiState = useCallback((key) => {
    return states[key] || { loading: false, error: null };
  }, [states]);

  const execute = useCallback(async (key, apiCall) => {
    setApiState(key, { loading: true, error: null });
    
    try {
      const result = await apiCall();
      setApiState(key, { loading: false, error: null });
      return result;
    } catch (err) {
      setApiState(key, { loading: false, error: err.message || 'An error occurred' });
      throw err;
    }
  }, [setApiState]);

  return {
    states,
    getApiState,
    execute
  };
};