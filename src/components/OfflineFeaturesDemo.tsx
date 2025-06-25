
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOffline } from '@/contexts/OfflineContext';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Save, Send, Database, Clock } from 'lucide-react';

export const OfflineFeaturesDemo: React.FC = () => {
  const { isOnline, addToQueue, getCachedData, setCachedData } = useOffline();
  const { toast } = useToast();
  const [userInput, setUserInput] = useState('');

  const handleTransaction = () => {
    if (!isOnline) {
      toast({
        title: "Transaction Disabled",
        description: "Transactions are disabled while offline for security.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Transaction Processed",
      description: "Your transaction has been completed successfully."
    });
  };

  const handleSaveData = () => {
    if (userInput.trim()) {
      setCachedData('user_notes', userInput);
      toast({
        title: "Data Saved",
        description: isOnline ? "Saved to server" : "Cached locally for later sync"
      });
      
      if (!isOnline) {
        addToQueue({
          type: 'SAVE_USER_NOTES',
          payload: { notes: userInput }
        });
      }
      
      setUserInput('');
    }
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      if (isOnline) {
        toast({
          title: "Message Sent",
          description: "Your message has been delivered."
        });
      } else {
        addToQueue({
          type: 'SEND_MESSAGE',
          payload: { message: userInput }
        });
        toast({
          title: "Message Queued",
          description: "Message will be sent when connection is restored."
        });
      }
      setUserInput('');
    }
  };

  const loadCachedData = () => {
    const cached = getCachedData('user_notes');
    if (cached) {
      setUserInput(cached.data);
      toast({
        title: "Data Loaded",
        description: `Loaded from cache (saved ${new Date(cached.timestamp).toLocaleTimeString()})`
      });
    } else {
      toast({
        title: "No Cached Data",
        description: "No cached data found."
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Critical Features
          </CardTitle>
          <CardDescription>
            These features are disabled when offline for security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleTransaction}
            disabled={!isOnline}
            className="w-full"
            variant={isOnline ? "default" : "secondary"}
          >
            {isOnline ? "Process Transaction" : "Transaction Disabled (Offline)"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Save data locally when offline, sync when online
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter some data..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSaveData} size="sm" className="flex-1">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button onClick={loadCachedData} variant="outline" size="sm">
              Load Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Messaging
          </CardTitle>
          <CardDescription>
            Messages are queued when offline and sent when reconnected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Type a message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button onClick={handleSendMessage} className="w-full">
            <Send className="h-4 w-4 mr-1" />
            {isOnline ? "Send Message" : "Queue Message"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Connection Status
          </CardTitle>
          <CardDescription>
            Current system status and connectivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Network:</span>
              <span className={navigator.onLine ? "text-green-600" : "text-red-600"}>
                {navigator.onLine ? "Online" : "Offline"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Server:</span>
              <span className={isOnline ? "text-green-600" : "text-red-600"}>
                {isOnline ? "Reachable" : "Unreachable"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Mode:</span>
              <span className={isOnline ? "text-green-600" : "text-orange-600"}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
