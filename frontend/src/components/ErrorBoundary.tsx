/**
 * Error Boundary component for catching React render errors
 * Displays a friendly error page with retry functionality
 */
import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  toggleDetails = (): void => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  };

  handleRefresh = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-[#0D0F16] flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/10 p-4 rounded-2xl flex items-center justify-center">
                <AlertTriangle size={48} className="text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl font-semibold text-white mt-4 text-center">
              Something went wrong
            </h1>

            {/* Message */}
            <p className="text-gray-500 text-sm text-center mt-2">
              An unexpected error occurred. Please refresh the page to continue.
            </p>

            {/* Error Details (collapsible, for dev) */}
            {this.state.error && (
              <div className="mt-4">
                <button
                  onClick={this.toggleDetails}
                  className="text-xs text-gray-700 hover:text-gray-600 transition-colors"
                >
                  {this.state.showDetails ? 'Hide details' : 'Show details'}
                </button>
                {this.state.showDetails && (
                  <div className="bg-white/5 rounded-xl p-3 text-xs text-gray-500 font-mono mt-3 text-left overflow-auto max-h-40">
                    {this.state.error.message}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3 justify-center">
              <button
                onClick={this.handleRefresh}
                className="btn-primary flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="btn-ghost flex items-center gap-2"
              >
                <Home size={16} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
