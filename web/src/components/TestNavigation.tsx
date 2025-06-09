// src/components/TestNavigation.tsx - Add this to debug navigation
import React from 'react';
import { useStore } from '@nanostores/react';
import { $router, goHome, goToModule, goToSettings, goToProfile } from '@/stores/router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const TestNavigation: React.FC = () => {
  const routerState = useStore($router);

  const testNavigations = [
    { label: 'Go Home', action: () => goHome() },
    { label: 'Go Module 1', action: () => goToModule(1) },
    { label: 'Go Module 2', action: () => goToModule(2) },
    { label: 'Go Module 3', action: () => goToModule(3) },
    { label: 'Go Module 4', action: () => goToModule(4) },
    { label: 'Go Module 5', action: () => goToModule(5) },
    { label: 'Go Settings', action: () => goToSettings() },
    { label: 'Go Profile', action: () => goToProfile() },
  ];

  return (
    <Card className="p-6 mb-6 bg-yellow-50 border-yellow-200">
      <h3 className="text-lg font-bold mb-4 text-yellow-800">🔧 Navigation Debug Panel</h3>
      
      <div className="mb-4 p-3 bg-white rounded border">
        <h4 className="font-semibold mb-2">Current Router State:</h4>
        <pre className="text-sm">{JSON.stringify(routerState, null, 2)}</pre>
        <p className="text-sm mt-2 text-gray-600">
          URL: {typeof window !== 'undefined' ? window.location.pathname : 'SSR'}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {testNavigations.map((nav, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => {
              console.log(`🧪 Testing navigation: ${nav.label}`);
              nav.action();
            }}
            className="text-xs"
          >
            {nav.label}
          </Button>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <p>• Check browser console for navigation logs</p>
        <p>• Watch router state changes above</p>
        <p>• Verify URL updates in address bar</p>
      </div>
    </Card>
  );
};

export default TestNavigation;