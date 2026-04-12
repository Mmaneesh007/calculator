import { useState } from 'react';
import Calculator from './components/Calculator';
import PaywallModal from './components/PaywallModal';

function App() {
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingCalculation, setPendingCalculation] = useState(null);
  const [singleUnlockTrigger, setSingleUnlockTrigger] = useState(false);

  const handleEqualPress = (result) => {
    if (!isPremium) {
      setPendingCalculation(result);
      setShowPaywall(true);
      return false; // Tells calculator not to show result yet
    }
    return true; // Premium user, show result
  };

  const handlePaymentSuccess = (planType) => {
    if (planType === 'premium') {
      setIsPremium(true);
    } else {
      setSingleUnlockTrigger(true);
    }
    setShowPaywall(false);
  };

  return (
    <div className="app-main">
      <Calculator 
        isPremium={isPremium} 
        onEqualPress={handleEqualPress} 
        pendingCalculation={pendingCalculation}
        singleUnlockTrigger={singleUnlockTrigger}
        onSingleUnlockConsumed={() => setSingleUnlockTrigger(false)}
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
