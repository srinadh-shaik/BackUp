
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';

export const OfflineWarningBanner: React.FC = () => {
  const { isOnline, queuedActions } = useOffline();

  if (isOnline) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4 border-orange-500 bg-orange-50 text-orange-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>
            You're currently offline. Some features are disabled.
            {queuedActions.length > 0 && (
              <span className="ml-2 text-sm">
                ({queuedActions.length} action{queuedActions.length !== 1 ? 's' : ''} queued)
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          Checking connection...
        </div>
      </AlertDescription>
    </Alert>
  );
};
