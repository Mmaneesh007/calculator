import { useState } from 'react';

const PaywallModal = ({ onClose, onPay }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        {step === 1 ? (
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
        ) : (
          <>
            <div className="modal-icon">💳</div>
            <h2 className="modal-title">Choose Your Plan</h2>
            <p className="modal-description">Select how you want to proceed</p>
            
            <div className="plans-container">
              <div className="plan-card" onClick={() => onPay('basic')}>
                <h3>Basic Plan</h3>
                <div className="price">₹499<span>/month</span></div>
                <p>Unlock 1 answer</p>
              </div>
              
              <div className="plan-card premium-card" onClick={() => onPay('premium')}>
                <h3>Premium</h3>
                <div className="price">₹999<span>/month</span></div>
                <p>Unlimited math</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default PaywallModal;
