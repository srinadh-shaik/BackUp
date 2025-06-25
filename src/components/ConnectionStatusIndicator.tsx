
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Server, ServerOff } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';
import { useServerStatus } from '@/hooks/useServerStatus';

export const ConnectionStatusIndicator: React.FC = () => {
  const { isOnline, queuedActions } = useOffline();
  const { isServerReachable, isChecking, lastChecked } = useServerStatus();

  return (
    <div className="flex items-center gap-2 text-sm">
      <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
        {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isOnline ? "Online" : "Offline"}
      </Badge>
      
      {queuedActions.length > 0 && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Server className="h-3 w-3" />
          {queuedActions.length} queued
        </Badge>
      )}
      
      {isChecking && (
        <Badge variant="outline" className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          Checking...
        </Badge>
      )}
      
      {lastChecked && (
        <span className="text-xs text-muted-foreground">
          Last checked: {lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};
