import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("URBAN_FABRIC_CRITICAL_FAULT:", error, errorInfo);
    // You could send this to an analytics service like Sentry or Google Analytics
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-10 text-center text-white space-y-8 font-hero">
          <div className="w-20 h-20 border-2 border-neon-green rounded-full flex items-center justify-center animate-pulse">
            <span className="text-4xl text-neon-green">!</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">System Desync_Fault</h1>
          <p className="text-[10px] opacity-40 uppercase tracking-[0.5em] max-w-md leading-loose">
            The design engine has encountered an unexpected variance. Your identity manifest is safe, but we need a manual refresh to re-sync the reality mesh.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-14 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-neon-white"
          >
            Re-Forge Reality
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
