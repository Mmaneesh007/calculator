const PaywallModal = ({ onClose, onPay }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
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

        <button className="pay-btn" onClick={onPay}>
          Pay Now & Unlock
        </button>
      </div>
    </div>
  );
};
export default PaywallModal;
