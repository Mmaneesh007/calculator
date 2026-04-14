import React, { useState, useEffect } from 'react';
import { Shield, FileText, X, ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';

const LegalPortal = ({ onClose, initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'privacy');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const renderPrivacy = () => (
    <div className="legal-content fade-in">
      <h2>Privacy Policy</h2>
      <p className="last-updated">Last Updated: April 14, 2026</p>
      <section>
        <h3>1. Information We Collect</h3>
        <p>At CalQube, we collect information to provide better services to our users. This includes Account Information (Name, email) and User Content (Dashboards, filters).</p>
      </section>
      <section>
        <h3>2. Data Security</h3>
        <p>We use industry-standard encryption and secure Firebase infrastructure to protect your data.</p>
      </section>
      <section>
        <h3>3. Contact Us</h3>
        <p>Email: <strong>maneeshsau@zohomail.in</strong></p>
        <p>Address: West Bengal, India</p>
      </section>
    </div>
  );

  const renderTerms = () => (
    <div className="legal-content fade-in">
      <h2>Terms of Service</h2>
      <p className="last-updated">Last Updated: April 14, 2026</p>
      <section>
        <h3>1. Acceptance of Terms</h3>
        <p>By using CalQube, you agree to these terms. We provide a cloud-based calculation platform.</p>
      </section>
      <section>
        <h3>2. Usage Rules</h3>
        <p>You are responsible for your account's security and the data you upload.</p>
      </section>
    </div>
  );

  const renderRefund = () => (
    <div className="legal-content fade-in">
      <h2>Refund & Cancellation</h2>
      <p className="last-updated">Last Updated: April 14, 2026</p>
      <section>
        <h3>1. Cancellation</h3>
        <p>You may cancel your subscription at any time via account settings. Access remains until the billing cycle ends.</p>
      </section>
      <section>
        <h3>2. Refunds</h3>
        <p>We offer a **7-day money-back guarantee**. If you're unsatisfied, request a refund via maneeshsau@zohomail.in within 7 days of purchase.</p>
      </section>
      <section>
        <h3>3. Timeline</h3>
        <p>Approved refunds are processed to the original payment method within **5–7 business days**.</p>
      </section>
    </div>
  );

  const renderPricing = () => (
    <div className="legal-content fade-in">
      <h2>Pricing & Plans</h2>
      <section>
        <h3>Domestic (India)</h3>
        <ul>
          <li>Monthly: ₹199</li>
          <li>Yearly: ₹2200</li>
        </ul>
      </section>
      <section>
        <h3>International</h3>
        <ul>
          <li>Monthly: $30</li>
          <li>Yearly: $300</li>
        </ul>
      </section>
    </div>
  );

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'privacy': return renderPrivacy();
      case 'terms': return renderTerms();
      case 'refund': return renderRefund();
      case 'pricing': return renderPricing();
      default: return renderPrivacy();
    }
  };

  return (
    <div className="legal-portal-overlay">
      <div className="legal-portal-card">
        <div className="legal-sidebar">
          <div className="legal-brand">
            <Shield className="text-purple-400" size={24} />
            <span>CalQube Legal</span>
          </div>
          
          <nav className="legal-nav">
            <button className={`legal-nav-item ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
              <Shield size={18} /> Privacy Policy
            </button>
            <button className={`legal-nav-item ${activeTab === 'terms' ? 'active' : ''}`} onClick={() => setActiveTab('terms')}>
              <FileText size={18} /> Terms & Conditions
            </button>
            <button className={`legal-nav-item ${activeTab === 'refund' ? 'active' : ''}`} onClick={() => setActiveTab('refund')}>
              <CreditCard size={18} /> Refund Policy
            </button>
            <button className={`legal-nav-item ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => setActiveTab('pricing')}>
              <HelpCircle size={18} /> Pricing
            </button>
          </nav>

          <button className="legal-back-btn" onClick={onClose}>
            <ArrowLeft size={18} /> Back to App
          </button>
        </div>

        <div className="legal-main">
          <button className="legal-close-mobile" onClick={onClose}>
            <X size={24} />
          </button>
          <div className="legal-scroll-area">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPortal;
