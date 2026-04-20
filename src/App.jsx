import { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import PaywallModal from './components/PaywallModal';
import LegalPortal from './components/LegalPortal';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load heavy components for performance
const Calculator = lazy(() => import('./components/Calculator'));
const DeveloperCalculator = lazy(() => import('./components/DeveloperCalculator'));
const ConstructionCalculator = lazy(() => import('./components/ConstructionCalculator'));
const FinanceCalculator = lazy(() => import('./components/FinanceCalculator'));
const MiniBI = lazy(() => import('./components/MiniBI'));

function AppContent() {
  const { user, loading, isPremium } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const [activeMode, setActiveMode] = useState('basic');
  const [showLegal, setShowLegal] = useState(null); // 'privacy' | 'terms' | null
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hash router for legal pages
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#privacy') setShowLegal('privacy');
      else if (hash === '#terms') setShowLegal('terms');
      else if (hash === '#refund') setShowLegal('refund');
      else if (hash === '#pricing') setShowLegal('pricing');
      else setShowLegal(null);
      
      // Close sidebar on navigation on mobile
      setIsSidebarOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const closeLegal = () => {
    window.location.hash = '';
    setShowLegal(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthPage />
        {showLegal && <LegalPortal initialTab={showLegal} onClose={closeLegal} />}
      </>
    );
  }

  const renderActiveCalculator = () => {
    return (
      <Suspense fallback={
        <div className="calculator-loader">
          <div className="loading-spinner" />
          <p>Initializing Engine...</p>
        </div>
      }>
        {(() => {
          switch (activeMode) {
            case 'developer': return <DeveloperCalculator />;
            case 'construction': return <ConstructionCalculator />;
            case 'finance': return <FinanceCalculator />;
            case 'minibi': return <MiniBI />;
            case 'basic':
            default: return <Calculator />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className={`layout-with-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <button 
          className="menu-toggle" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="mobile-brand">CalQube</span>
        {isPremium && <span className="premium-badge-small">PRO</span>}
      </header>

      {/* Sidebar Overlay (Mobile Only) */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      <Sidebar 
        activeMode={activeMode} 
        setActiveMode={(mode) => {
          setActiveMode(mode);
          setIsSidebarOpen(false); // Close sidebar on selection
        }} 
        isPremium={isPremium}
        onPremiumClick={() => setShowPaywall(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="main-content">
        {renderActiveCalculator()}
      </div>
      
      {showPaywall && (
        <PaywallModal 
          onClose={() => setShowPaywall(false)} 
        />
      )}

      {showLegal && (
        <LegalPortal initialTab={showLegal} onClose={closeLegal} />
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1f2e',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
