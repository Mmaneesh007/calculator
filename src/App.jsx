// src/App.jsx
import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Calculator from './components/Calculator';
import DeveloperCalculator from './components/DeveloperCalculator';
import ConstructionCalculator from './components/ConstructionCalculator';
import FinanceCalculator from './components/FinanceCalculator';
import MiniBI from './components/MiniBI';
import PaywallModal from './components/PaywallModal';

function App() {
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [activeMode, setActiveMode] = useState('basic');

  const handlePaymentSuccess = (planType) => {
    if (planType === 'premium' || planType === 'basic') {
      setIsPremium(true);
    }
    setShowPaywall(false);
  };

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
          onPay={handlePaymentSuccess} 
        />
      )}
    </div>
  );
}

export default App;
