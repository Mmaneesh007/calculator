import { useState } from 'react';
import Calculator from './components/Calculator';
import PaywallModal from './components/PaywallModal';

function App() {
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingCalculation, setPendingCalculation] = useState(null);

  const handleEqualPress = (result) => {
    if (!isPremium) {
      setPendingCalculation(result);
      setShowPaywall(true);
      return false; // Tells calculator not to show result yet
    }
    return true; // Premium user, show result
  };

  const handlePaymentSuccess = () => {
    setIsPremium(true);
    setShowPaywall(false);
    // Note: The calculator component handles applying the pending calculation when isPremium changes
  };

  return (
    <div className="app-main">
      <Calculator 
        isPremium={isPremium} 
        onEqualPress={handleEqualPress} 
        pendingCalculation={pendingCalculation}
      />
      
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
