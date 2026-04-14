import { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Globe, CreditCard, Zap, Sparkles } from 'lucide-react';
import { createCheckoutSession, updateUserPremiumStatus, recordPayment } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';
import { onSnapshot, doc } from 'firebase/firestore';

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
      monthly: { amount: 199, display: '₹199', original: '₹499' }, 
      yearly: { amount: 2200, display: '₹2,200', original: '₹2,388' } 
    }
  };

  const RAZORPAY_KEY = "rzp_live_SdJFhcs4xWWQTn";

  const currentPrice = PRICE_MAP[region][interval];

  const handleSubscribe = async () => {
    if (!user) {
      alert("Please sign in to subscribe.");
      return;
    }
    
    setIsRedirecting(true);

    if (region === 'india') {
      try {
        const options = {
          key: RAZORPAY_KEY,
          amount: currentPrice.amount * 100, // Razorpay takes paisa
          currency: "INR",
          name: "CalQube Premium",
          description: `Subscription - ${interval === 'monthly' ? 'Monthly' : 'Yearly'}`,
          image: "https://mmaneesh007.github.io/calculator/favicon.svg",
          handler: async function (response) {
            // SUCCESS HANDLER
            await updateUserPremiumStatus(user.uid, true);
            await recordPayment(user.uid, {
              amount: currentPrice.amount,
              currency: "INR",
              gateway: "Razorpay",
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              status: "Success"
            });
            setIsRedirecting(false);
            onClose(); // Close modal on success
            alert("Upgrade Successful! Welcome to CalQube Pro.");
          },
          prefill: {
            name: user.displayName || "",
            email: user.email || ""
          },
          theme: { color: "#8b5cf6" },
          modal: {
            ondismiss: function() {
              setIsRedirecting(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("Razorpay Error:", err);
        alert("Could not load payment gateway. Please check your internet connection.");
        setIsRedirecting(false);
      }
      return;
    }

    // STRIPE FLOW (For International)
    try {
      const docRef = await createCheckoutSession(user.uid, currentPrice.id);
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
              <span className="pw-amount">{currentPrice.display || currentPrice.amount}</span>
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
            {isRedirecting ? 'Opening Secure Checkout...' : 'Upgrade Now'}
            <Zap size={18} fill="currentColor" />
          </button>
          
          <div className="pw-security">
            <div className="security-item">
              <ShieldCheck size={14} /> Razorpay & Stripe
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

