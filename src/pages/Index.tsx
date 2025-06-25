
import { OfflineWarningBanner } from "@/components/OfflineWarningBanner";
import { OfflineFeaturesDemo } from "@/components/OfflineFeaturesDemo";
import { ConnectionStatusIndicator } from "@/components/ConnectionStatusIndicator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Offline Mode Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Experience how the app handles server downtime and network issues
          </p>
          <ConnectionStatusIndicator />
        </div>
        
        <OfflineWarningBanner />
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Try These Features
          </h2>
          <p className="text-gray-600 mb-6">
            Disconnect your internet or simulate server downtime to see how the app behaves.
            Critical features will be disabled, data will be cached locally, and actions will be queued for later.
          </p>
        </div>
        
        <OfflineFeaturesDemo />
        
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">How It Works</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• <strong>Network Detection:</strong> Automatically detects when you go offline/online</li>
            <li>• <strong>Server Health:</strong> Periodically pings the server to check availability</li>
            <li>• <strong>Data Caching:</strong> Uses localStorage to cache data for offline access</li>
            <li>• <strong>Action Queuing:</strong> Queues non-critical actions to execute when back online</li>
            <li>• <strong>Feature Disabling:</strong> Disables critical features like transactions when offline</li>
            <li>• <strong>Visual Feedback:</strong> Shows clear indicators of connection status</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
