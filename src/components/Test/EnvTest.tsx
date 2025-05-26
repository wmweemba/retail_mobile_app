import React from 'react';

const EnvTest: React.FC = () => {
  // Log all VITE_ prefixed environment variables
  const envVars = Object.entries(import.meta.env)
    .filter(([key]) => key.startsWith('VITE_'));

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Environment Variables Test</h2>
      <div className="space-y-2">
        {envVars.map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {key}:
            </span>
            <span className="text-gray-700">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvTest; 