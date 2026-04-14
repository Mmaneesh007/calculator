// src/App.jsx
import { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import Calculator from './components/Calculator';
import DeveloperCalculator from './components/DeveloperCalculator';
import ConstructionCalculator from './components/ConstructionCalculator';
import FinanceCalculator from './components/FinanceCalculator';
import MiniBI from './components/MiniBI';
import PaywallModal from './components/PaywallModal';
import LegalPortal from './components/LegalPortal';
import { useEffect } from 'react';

function AppContent() {
  const { user, loading, isPremium } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const [activeMode, setActiveMode] = useState('basic');
  const [showLegal, setShowLegal] = useState(null); // 'privacy' | 'terms' | null

  // Hash router for legal pages
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#privacy') setShowLegal('privacy');
      else if (hash === '#terms') setShowLegal('terms');
      else setShowLegal(null);
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
    switch (activeMode) {
      case 'developer':
        return <DeveloperCalculator />;
      case 'construction':
        return <ConstructionCalculator />;
      case 'finance':
        return <FinanceCalculator />;
      case 'minibi':
        return <MiniBI />;
      case 'basic':
      default:
        return <Calculator />;
    }
  };

  return (
    <div className="layout-with-sidebar">
      <Sidebar 
        activeMode={activeMode} 
        setActiveMode={setActiveMode} 
        isPremium={isPremium}
        onPremiumClick={() => setShowPaywall(true)}
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
