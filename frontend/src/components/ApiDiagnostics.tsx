/**
 * API Diagnostics Component - Shows API configuration for debugging
 * Only visible in development or when there's an error
 */
import { API_URL } from '../config/constants';

interface ApiDiagnosticsProps {
  error?: string | null;
}

export const ApiDiagnostics = ({ error }: ApiDiagnosticsProps) => {
  // Only show in development or when there's an error
  if (!import.meta.env.DEV && !error) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-mono">
      <div className="font-bold mb-2 text-gray-700 dark:text-gray-300">API Configuration:</div>
      <div className="space-y-1 text-gray-600 dark:text-gray-400">
        <div>
          <span className="font-semibold">Base URL:</span> {API_URL || 'undefined'}
        </div>
        <div>
          <span className="font-semibold">Environment:</span>{' '}
          {import.meta.env.DEV ? 'Development' : 'Production'}
        </div>
        <div>
          <span className="font-semibold">VITE_API_URL:</span>{' '}
          {import.meta.env.VITE_API_URL || 'not set'}
        </div>
        {error && (
          <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
            <span className="font-semibold text-red-600 dark:text-red-400">Error:</span>
            <div className="mt-1 text-red-600 dark:text-red-400">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};
