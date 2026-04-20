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
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen">
          <div className="error-card">
            <h1>Oops! Something went wrong.</h1>
            <p>The application encountered an unexpected error. Don't worry, your data is safe.</p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Reload Application
            </button>
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px', color: '#888' }}>
              {this.state.error && this.state.error.toString()}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
