import { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Globe, CreditCard, Zap, Sparkles } from 'lucide-react';
import { createCheckoutSession } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';
import { onSnapshot } from 'firebase/firestore';

const PaywallModal = ({ onClose }) => {
  const { user } = useAuth();
  const [region, setRegion] = useState('international'); // 'international' | 'india'
  const [interval, setInterval] = useState('monthly'); // 'monthly' | 'yearly'
  const [isRedirecting, setIsRedirecting] = useState(false);

  // PLACEHOLDER PRICE IDs - User will replace these with real ones from Stripe
  const PRICE_MAP = {
    international: {
      monthly: { id: 'price_usd_monthly_placeholder', amount: '$30', original: '$45' },
      yearly: { id: 'price_usd_yearly_placeholder', amount: '$300', original: '$360' }
    },
    india: {
      monthly: { id: 'price_inr_monthly_placeholder', amount: '₹199', original: '₹499' },
      yearly: { id: 'price_inr_yearly_placeholder', amount: '₹2,200', original: '₹2,388' }
    }
  };

  const currentPrice = PRICE_MAP[region][interval];

  const handleSubscribe = async () => {
    if (!user) {
      alert("Please sign in to subscribe.");
      return;
    }
    
    setIsRedirecting(true);
    try {
      const docRef = await createCheckoutSession(user.uid, currentPrice.id);
      
      // Listen for the checkout URL from the Firebase extension
      const unsubscribe = onSnapshot(docRef, (snap) => {
        const data = snap.data();
        if (data?.url) {
          window.location.assign(data.url);
        }
        if (data?.error) {
          setIsRedirecting(false);
          alert("Could not create checkout session: " + data.error.message);
          unsubscribe();
        }
      });
    } catch (err) {
      console.error(err);
      setIsRedirecting(false);
      alert("Failed to initiate checkout. Please try again.");
    }
  };

  return (
    <div className="paywall-overlay fade-in" onClick={onClose}>
      <div className="paywall-card glass-morphism" onClick={(e) => e.stopPropagation()}>
        <button className="pw-close" onClick={onClose}><X size={20} /></button>
        
        <div className="pw-header">
          <div className="pw-badge">
            <Sparkles size={14} /> PREMIUM ACCESS
          </div>
          <h1>Unlock the Full Power of SaaS Calc</h1>
          <p>Join 10,000+ professionals using advanced analysis</p>
        </div>

        {/* Toggles */}
        <div className="pw-controls">
          <div className="pw-toggle-group">
            <button 
              className={`pw-toggle ${region === 'international' ? 'active' : ''}`}
              onClick={() => setRegion('international')}
            >
              <Globe size={14} /> International
            </button>
            <button 
              className={`pw-toggle ${region === 'india' ? 'active' : ''}`}
              onClick={() => setRegion('india')}
            >
              🇮🇳 India
            </button>
          </div>

          <div className="pw-toggle-group">
            <button 
              className={`pw-toggle ${interval === 'monthly' ? 'active' : ''}`}
              onClick={() => setInterval('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`pw-toggle ${interval === 'yearly' ? 'active' : ''}`}
              onClick={() => setInterval('yearly')}
            >
              Yearly <span className="save-tag">SAVE 15%</span>
            </button>
          </div>
        </div>

        <div className="pw-content">
          {/* Plan Summary */}
          <div className="pw-plan-box">
            <div className="pw-price-area">
              <span className="pw-original">{currentPrice.original}</span>
              <span className="pw-amount">{currentPrice.amount}</span>
              <span className="pw-period">/{interval === 'monthly' ? 'month' : 'year'}</span>
            </div>
            <p className="pw-saving-note">
              {interval === 'yearly' ? 'One-time payment. Best for professionals.' : 'Cancel anytime. No lock-in.'}
            </p>
          </div>

          {/* Features */}
          <div className="pw-features">
            <div className="pw-feature">
              <div className="check-box"><Check size={14} /></div>
              <span>Unlimited Cloud Dashboard Storage</span>
            </div>
            <div className="pw-feature">
              <div className="check-box"><Check size={14} /></div>
              <span>Advanced Power Query & DAX Engines</span>
            </div>
            <div className="pw-feature">
              <div className="check-box"><Check size={14} /></div>
              <span>Secure Sharing & Shareable Links</span>
            </div>
            <div className="pw-feature">
              <div className="check-box"><Check size={14} /></div>
              <span>Real-time Financial Reporting</span>
            </div>
          </div>
        </div>

        <div className="pw-footer">
          <button 
            className={`pw-primary-btn ${isRedirecting ? 'loading' : ''}`} 
            onClick={handleSubscribe}
            disabled={isRedirecting}
          >
            {isRedirecting ? 'Redirecting to Secure Checkout...' : 'Upgrade Now'}
            <Zap size={18} fill="currentColor" />
          </button>
          
          <div className="pw-security">
            <div className="security-item">
              <ShieldCheck size={14} /> Secure with Stripe
            </div>
            <div className="security-item">
              <CreditCard size={14} /> UPI & Worldwide Cards
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;

