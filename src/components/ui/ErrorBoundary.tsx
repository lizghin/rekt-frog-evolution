'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 React Error Boundary caught an error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Stack:', error.stack);
    
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-black flex items-center justify-center p-4">
          <div className="bg-black/80 backdrop-blur-sm border border-red-500 rounded-lg p-6 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">🚨 Game Error</h2>
            <p className="text-gray-300 mb-4">
              Something went wrong with the 3D scene. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-red-400 cursor-pointer">Error Details (Dev)</summary>
                <pre className="text-xs text-gray-400 mt-2 p-2 bg-gray-900 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
