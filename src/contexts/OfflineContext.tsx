
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface QueuedAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

interface OfflineContextType {
  isOnline: boolean;
  isServerReachable: boolean;
  queuedActions: QueuedAction[];
  addToQueue: (action: Omit<QueuedAction, 'id' | 'timestamp'>) => void;
  clearQueue: () => void;
  getCachedData: (key: string) => any;
  setCachedData: (key: string, data: any) => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServerReachable, setIsServerReachable] = useState(true);
  const [queuedActions, setQueuedActions] = useState<QueuedAction[]>([]);

  // Load queued actions from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('offline_queued_actions');
    if (saved) {
      try {
        setQueuedActions(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading queued actions:', e);
      }
    }
  }, []);

  // Save queued actions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('offline_queued_actions', JSON.stringify(queuedActions));
  }, [queuedActions]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToQueue = (action: Omit<QueuedAction, 'id' | 'timestamp'>) => {
    const queuedAction: QueuedAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setQueuedActions(prev => [...prev, queuedAction]);
  };

  const clearQueue = () => {
    setQueuedActions([]);
    localStorage.removeItem('offline_queued_actions');
  };

  const getCachedData = (key: string) => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.error('Error getting cached data:', e);
      return null;
    }
  };

  const setCachedData = (key: string, data: any) => {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (e) {
      console.error('Error setting cached data:', e);
    }
  };

  const value: OfflineContextType = {
    isOnline: isOnline && isServerReachable,
    isServerReachable,
    queuedActions,
    addToQueue,
    clearQueue,
    getCachedData,
    setCachedData,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};
