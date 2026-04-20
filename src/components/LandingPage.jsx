import React, { useEffect } from 'react';
import { 
  ArrowRight, 
  BarChart3, 
  Code, 
  Construction, 
  CreditCard, 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  Calculator,
  ChevronRight,
  Github
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  // Simple SEO Title update
  useEffect(() => {
    document.title = "CalQube | Enterprise Computation & BI Studio";
  }, []);

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav fade-in">
        <div className="nav-logo">
          <div className="logo-icon">C</div>
          <span>CalQube</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
          <button className="nav-cta" onClick={onGetStarted}>Launch App</button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge fade-in">
              <Zap size={14} className="icon-pulse" />
              <span>Version 1.2.1 Now Live</span>
            </div>
            <h1 className="hero-title slide-up">
              The Ultimate <span className="gradient-text">Computation Engine</span> for Modern Professionals
            </h1>
            <p className="hero-subtitle slide-up-delay">
              Elite technical calculators meeting enterprise-grade data visualization. 
              CalQube bridges the gap between raw logic and actionable business intelligence.
            </p>
            <div className="hero-actions slide-up-delay-2">
              <button className="btn-primary" onClick={onGetStarted}>
                Get Started for Free <ArrowRight size={18} />
              </button>
              <a href="https://github.com/Mmaneesh007/calculator" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <Github size={18} /> View on GitHub
              </a>
            </div>
          </div>
          
          <div className="hero-visual fade-in-delay">
            <div className="glass-dashboard">
              <div className="dashboard-header">
                <div className="dots"><span/><span/><span/></div>
                <div className="title">CalQube Engine v1.2</div>
              </div>
              <div className="dashboard-content">
                <div className="chart-preview">
                  <div className="bar b1"></div>
                  <div className="bar b2"></div>
                  <div className="bar b3"></div>
                  <div className="bar b4"></div>
                </div>
                <div className="data-preview">
                  <div className="row"><span>Segment Analysis</span><strong>98.4%</strong></div>
                  <div className="row"><span>ROI Projections</span><strong>+12.5k</strong></div>
                </div>
              </div>
            </div>
            <div className="hero-glow"></div>
          </div>
        </section>

        {/* Multi-Vertical Suites */}
        <section id="features" className="features">
          <div className="section-header">
            <h2 className="section-title">One Platform. <span className="text-secondary">Unlimited Precision.</span></h2>
            <p className="section-desc">Four specialized technical suites designed to handle your most complex workflows with zero friction.</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card glass-hover">
              <div className="card-icon dev"><Code size={24} /></div>
              <h3>Developer Suite</h3>
              <p>Bitwise operations, base conversions, and high-precision technical logic tools for architects.</p>
              <ul className="card-list">
                <li><ShieldCheck size={14} /> Base 2-36 Support</li>
                <li><ShieldCheck size={14} /> Bitwise Logic Engine</li>
              </ul>
            </div>

            <div className="feature-card glass-hover">
              <div className="card-icon finance"><BarChart3 size={24} /></div>
              <h3>Finance Suite</h3>
              <p>Advanced ROI analysis, compounding projections, and enterprise mortgage calculators.</p>
              <ul className="card-list">
                <li><ShieldCheck size={14} /> Amortization Schedules</li>
                <li><ShieldCheck size={14} /> Global Tax Logic</li>
              </ul>
            </div>

            <div className="feature-card glass-hover">
              <div className="card-icon construction"><Construction size={24} /></div>
              <h3>Construction Suite</h3>
              <p>Structural material estimation, area optimization, and structural unit conversions.</p>
              <ul className="card-list">
                <li><ShieldCheck size={14} /> Material Quantities</li>
                <li><ShieldCheck size={14} /> Precision Estimation</li>
              </ul>
            </div>

            <div className="feature-card glass-hover">
              <div className="card-icon bi"><LayoutDashboard size={24} /></div>
              <h3>Mini BI Studio</h3>
              <p>The core intelligence engine. Transform raw CSV/Excel data into stunning interactive reports.</p>
              <ul className="card-list">
                <li><ShieldCheck size={14} /> Power Query Engine</li>
                <li><ShieldCheck size={14} /> Recharts Integration</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing">
          <div className="section-header">
            <h2 className="section-title">Built for <span className="text-secondary">Scale</span></h2>
            <p className="section-desc">Transparent pricing designed for individual professionals and enterprise teams.</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card free fade-in">
              <div className="pricing-header">
                <span className="tier-name">Individual</span>
                <div className="price">₹0<span>/mo</span></div>
              </div>
              <ul className="pricing-list">
                <li><ShieldCheck size={18} /> Basic Calculation Engine</li>
                <li><ShieldCheck size={18} /> Essential BI Visuals</li>
                <li><ShieldCheck size={18} /> Local Storage</li>
                <li className="disabled"><ShieldCheck size={18} /> Advanced Suites Access</li>
                <li className="disabled"><ShieldCheck size={18} /> Cloud Sync & Backups</li>
              </ul>
              <button className="pricing-cta secondary" onClick={onGetStarted}>Get Started</button>
            </div>

            <div className="pricing-card pro featured pop-in">
              <div className="pricing-header">
                <span className="featured-chip">Most Popular</span>
                <span className="tier-name">Premium Pro</span>
                <div className="price">₹2,499<span>/mo</span></div>
              </div>
              <ul className="pricing-list">
                <li><Zap size={18} /> All Specialized Suites</li>
                <li><Zap size={18} /> Unlimited Cloud Dashboards</li>
                <li><Zap size={18} /> Enterprise PDF Exports</li>
                <li><Zap size={18} /> Razorpay Live Priority</li>
                <li><Zap size={18} /> Advanced Power Query</li>
              </ul>
              <button className="pricing-cta primary" onClick={onGetStarted}>Upgrade to Elite</button>
            </div>
          </div>
        </section>

        {/* Stats / Proof Section */}
        <section className="stats-section fade-in">
          <div className="stat-item">
            <div className="stat-value">50k+</div>
            <div className="stat-label">Calculations Daily</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Engine Accuracy</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">250ms</div>
            <div className="stat-label">Response Time</div>
          </div>
        </section>

        {/* Pre-footer CTA */}
        <section className="pre-footer pop-in">
          <div className="pre-footer-content">
            <h2>Ready to transform your technical workflow?</h2>
            <p>Join the next generation of data-driven architects and financial analysts.</p>
            <button className="btn-large" onClick={onGetStarted}>
              Launch CalQube Studio <ChevronRight size={20} />
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-col branding">
            <div className="nav-logo">
              <div className="logo-icon">C</div>
              <span>CalQube</span>
            </div>
            <p>The ultimate professional calculus and BI automation engine.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="/#pricing">Cloud Specs</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="/#terms">Terms</a>
            <a href="/#privacy">Privacy</a>
            <a href="mailto:support@calqube.com">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 CalQube SaaS. Built with precision by Manish Sau.</p>
        </div>
      </footer>

      {/* SEO Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "CalQube",
          "operatingSystem": "Web",
          "applicationCategory": "BusinessApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          },
          "featureList": "Data Visualization, Technical Calculators, Finance ROI, Construction Estimation, Power Query Engine"
        })}
      </script>
    </div>
  );
};

export default LandingPage;
