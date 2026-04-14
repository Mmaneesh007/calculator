// src/components/Sidebar.jsx
import { Calculator, HardHat, Code, TrendingUp, Lock, Database, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ activeMode, setActiveMode, isPremium, onPremiumClick }) => {
  const { user, logout } = useAuth();

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

      {/* User Profile Section */}
      {user && (
        <div className="sidebar-user">
          <div className="user-info">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="user-avatar" referrerPolicy="no-referrer" />
            ) : (
              <div className="user-avatar-placeholder">
                {(user.displayName || user.email || '?')[0].toUpperCase()}
              </div>
            )}
            <div className="user-details">
              <span className="user-name">{user.displayName || 'User'}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
