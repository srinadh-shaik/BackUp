
import { useState, useEffect, useCallback } from 'react';

interface UseServerStatusOptions {
  serverUrl?: string;
  pingInterval?: number;
  timeout?: number;
  maxRetries?: number;
}

export const useServerStatus = (options: UseServerStatusOptions = {}) => {
  const {
    serverUrl = '/api/health',
    pingInterval = 30000, // 30 seconds
    timeout = 5000, // 5 seconds
    maxRetries = 3
  } = options;

  const [isServerReachable, setIsServerReachable] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkServerStatus = useCallback(async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(serverUrl, {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setIsServerReachable(true);
        setRetryCount(0);
        console.log('Server is reachable');
      } else {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.warn('Server check failed:', error);
      
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        // Exponential backoff for retries
        setTimeout(() => checkServerStatus(), Math.pow(2, retryCount) * 1000);
      } else {
        setIsServerReachable(false);
        setRetryCount(0);
      }
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  }, [serverUrl, timeout, isChecking, retryCount, maxRetries]);

  // Initial check and periodic pinging
  useEffect(() => {
    checkServerStatus();
    
    const interval = setInterval(checkServerStatus, pingInterval);
    
    return () => clearInterval(interval);
  }, [checkServerStatus, pingInterval]);

  // Check immediately when coming back online
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network back online, checking server status...');
      checkServerStatus();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [checkServerStatus]);

  return {
    isServerReachable,
    isChecking,
    lastChecked,
    retryCount,
    checkNow: checkServerStatus,
  };
};
