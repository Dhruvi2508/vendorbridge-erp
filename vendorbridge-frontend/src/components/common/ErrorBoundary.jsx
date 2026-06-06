import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-xl text-center">
          <div className="w-24 h-24 bg-error-container rounded-full flex items-center justify-center mb-lg">
            <span className="material-symbols-outlined text-[48px] text-error">warning</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Something went wrong</h1>
          <p className="text-on-surface-variant text-body-md mb-lg max-w-md">
            The application encountered an unexpected error. Please try refreshing the page or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-on-primary font-semibold px-lg py-md rounded-lg shadow-[0_2px_0_0_rgba(116,91,0,0.5)] hover:opacity-90 transition-all"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
