// src/components/Sidebar.jsx
import { Calculator, HardHat, Code, TrendingUp, Lock, Database } from 'lucide-react';

const Sidebar = ({ activeMode, setActiveMode, isPremium, onPremiumClick }) => {
  const navItems = [
    { id: 'basic', label: 'Basic Calculator', icon: Calculator, isPro: false },
    { id: 'developer', label: 'Developer Mode', icon: Code, isPro: true },
    { id: 'construction', label: 'BOM Estimator', icon: HardHat, isPro: true },
    { id: 'finance', label: 'Wealth Planner', icon: TrendingUp, isPro: true },
    { id: 'minibi', label: 'Data Studio', icon: Database, isPro: true },
  ];

  const handleNavClick = (item) => {
    if (item.isPro && !isPremium) {
      onPremiumClick();
      return;
    }
    setActiveMode(item.id);
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>SaaS Calc</h2>
        {isPremium && <span className="premium-badge-small">PRO</span>}
      </div>
      <ul className="sidebar-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <li 
              key={item.id} 
              className={`nav-item ${activeMode === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}
            >
              <IconComponent size={20} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.isPro && !isPremium && <Lock size={14} className="lock-icon" />}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
