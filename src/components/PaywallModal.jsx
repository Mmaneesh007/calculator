import { useState } from 'react';

const PaywallModal = ({ onClose, onPay }) => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setStep(3);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing delay (1.5 seconds)
    setTimeout(() => {
      onPay(selectedPlan);
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        {step === 1 && (
          <>
            <div className="modal-icon">✨</div>
            <h2 className="modal-title">Unlock the Answer</h2>
            <p className="modal-description">
              You've reached the limit of the free version. Upgrade to Premium to see your calculation results instantly!
            </p>

            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Unlimited calculations</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>View all hidden answers</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>No annoying ads</span>
              </div>
            </div>

            <button className="pay-btn" onClick={() => setStep(2)}>
              Pay Now & Unlock
            </button>
          </>
        )}
        
        {step === 2 && (
          <>
            <div className="modal-icon">💳</div>
            <h2 className="modal-title">Choose Your Plan</h2>
            <p className="modal-description">Select how you want to proceed</p>
            
            <div className="plans-container">
              <div className="plan-card" onClick={() => handlePlanSelect('basic')}>
                <h3>Basic Plan</h3>
                <div className="price">₹499<span>/month</span></div>
                <p>Unlock 1 answer</p>
              </div>
              
              <div className="plan-card premium-card" onClick={() => handlePlanSelect('premium')}>
                <h3>Premium</h3>
                <div className="price">₹999<span>/month</span></div>
                <p>Unlimited math</p>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="modal-icon">🔒</div>
            <h2 className="modal-title">Secure Checkout</h2>
            <p className="modal-description">
              {selectedPlan === 'premium' ? 'Premium Plan - ₹999/month' : 'Basic Plan - ₹499/month'}
            </p>
            
            <div className="payment-form">
              <div className="input-group">
                <label>Card Number</label>
                <div className="fake-input">
                  <span>💳</span>
                  <span>•••• •••• •••• 4242</span>
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Expiry</label>
                  <div className="fake-input">12/26</div>
                </div>
                <div className="input-group">
                  <label>CVV</label>
                  <div className="fake-input">•••</div>
                </div>
              </div>
            </div>

            <button 
              className={`pay-btn ${isProcessing ? 'processing' : ''}`} 
              onClick={handleProcessPayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Transaction...' : 'Pay Securely'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaywallModal;
