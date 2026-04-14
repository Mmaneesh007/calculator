import React, { useState, useEffect } from 'react';
import { Shield, FileText, X, ArrowLeft } from 'lucide-react';

const LegalPortal = ({ onClose, initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Lock scroll when open
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
        <p>At CalQube, we collect information to provide better services to our users. This includes:</p>
        <ul>
          <li><strong>Account Information:</strong> Name, email address, and profile picture when you sign in via Google or Email.</li>
          <li><strong>User Content:</strong> Data files you upload (.xlsx, .csv) and the dashboard configurations you create.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our Data Studio and calculators.</li>
        </ul>
      </section>

      <section>
        <h3>2. How We Use Information</h3>
        <p>We use the information we collect to maintain, protect, and improve our services, and to develop new ones. Specifically:</p>
        <ul>
          <li>To save and synchronize your dashboards across devices.</li>
          <li>To process payments via Stripe (if applicable).</li>
          <li>To provide real-time collaboration features.</li>
        </ul>
      </section>

      <section>
        <h3>3. Data Security</h3>
        <p>We use industry-standard encryption (SSL/TLS) and secure Firebase infrastructure to protect your data. Your uploaded files are stored in a private cloud environment accessible only to you and your authorized collaborators.</p>
      </section>

      <section>
        <h3>6. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at <strong>maneeshsau@zohomail.in</strong></p>
      </section>
    </div>
  );

  const renderTerms = () => (
    <div className="legal-content fade-in">
      <h2>Terms of Service</h2>
      <p className="last-updated">Last Updated: April 14, 2026</p>

      <section>
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using CalQube, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
      </section>

      <section>
        <h3>2. Description of Service</h3>
        <p>CalQube provides a cloud-based calculation and data visualization platform. We reserve the right to modify or discontinue features at any time.</p>
      </section>

      <section>
        <h3>3. User Accounts</h3>
        <p>You are responsible for maintaining the security of your account. CalQube cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>
      </section>

      <section>
        <h3>4. Intellectual Property</h3>
        <p>You retain all rights to the data you upload. CalQube retains all rights to the software, design, and intellectual property associated with the service.</p>
      </section>

      <section>
        <h3>5. Payments and Refunds</h3>
        <p>Premium features are provided on a subscription basis. Subscriptions are processed via Stripe and are non-refundable unless required by law.</p>
      </section>
    </div>
  );

  return (
    <div className="legal-portal-overlay">
      <div className="legal-portal-card">
        <div className="legal-sidebar">
          <div className="legal-brand">
            <Shield className="text-purple-400" size={24} />
            <span>CalQube Legal</span>
          </div>
          
          <nav className="legal-nav">
            <button 
              className={`legal-nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <Shield size={18} /> Privacy Policy
            </button>
            <button 
              className={`legal-nav-item ${activeTab === 'terms' ? 'active' : ''}`}
              onClick={() => setActiveTab('terms')}
            >
              <FileText size={18} /> Terms of Service
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
            {activeTab === 'privacy' ? renderPrivacy() : renderTerms()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPortal;
