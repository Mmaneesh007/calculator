import { useState, useEffect } from 'react';
import { X, Sparkles, BrainCircuit, TrendingUp, AlertCircle, BarChart3, Lightbulb, Copy, Check } from 'lucide-react';

const AIInsightPanel = ({ insights, onClose, isPremium }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [copied, setCopied] = useState(false);

  // Typing effect
  useEffect(() => {
    if (!insights) return;
    
    if (index < insights.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + insights[index]);
        setIndex(prev => prev + 1);
      }, 5); // Fast typing speed
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [index, insights]);

  const handleCopy = () => {
    navigator.clipboard.writeText(insights);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to parse simple markdown bold and bullet points for better rendering
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, i) => {
      // Very basic markdown parsing for visual appeal
      let content = line.trim();
      if (!content) return <br key={i} />;

      // Bullet points
      if (content.startsWith('* ') || content.startsWith('- ')) {
        return (
          <div key={i} className="ai-bullet">
            <span className="bullet-dot">•</span>
            {parseBold(content.substring(2))}
          </div>
        );
      }

      // Headers (e.g. 1. Title:)
      if (/^\d+\./.test(content)) {
        return <div key={i} className="ai-header">{parseBold(content)}</div>;
      }

      return <p key={i} className="ai-para">{parseBold(content)}</p>;
    });
  };

  const parseBold = (text) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.substring(2, part.length - 2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="ai-panel-overlay fade-in">
      <div className="ai-panel">
        <div className="ai-panel-header">
          <div className="ai-title">
            <Sparkles className="icon-pulse" size={20} style={{ color: '#8b5cf6' }} />
            <span>AI Narrative Engine</span>
          </div>
          <div className="ai-actions">
            <button className="ai-action-btn" onClick={handleCopy} title="Copy Insights">
              {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            </button>
            <button className="ai-close" onClick={onClose}><X size={20} /></button>
          </div>
        </div>

        <div className="ai-panel-content custom-scrollbar">
          {!isPremium && (
            <div className="ai-premium-lock">
              <Sparkles size={32} />
              <h3>Premium Feature</h3>
              <p>Upgrade to Pro to unlock advanced AI narrative analysis and trend forecasting.</p>
            </div>
          )}

          <div className="ai-text-container">
            {renderFormattedText(displayedText)}
            {isTyping && <span className="ai-cursor">|</span>}
          </div>
        </div>

        <div className="ai-panel-footer">
          <div className="ai-footer-info">
            <BrainCircuit size={14} />
            <span>Powered by Gemini 1.5 Flash</span>
          </div>
          {!isTyping && (
             <button className="ai-done-btn" onClick={onClose}>Understood</button>
          )}
        </div>
      </div>

      <style>{`
        .ai-panel-overlay {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
          padding: 20px;
        }

        .ai-panel {
          width: 100%;
          max-width: 450px;
          background: rgba(13, 17, 26, 0.95);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.1);
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideInRight {
          from { transform: translateX(100%) scale(0.95); opacity: 0; }
          to { transform: translateX(0) scale(1); opacity: 1; }
        }

        .ai-panel-header {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ai-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 18px;
          background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ai-actions {
          display: flex;
          gap: 8px;
        }

        .ai-action-btn, .ai-close {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #94a3b8;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ai-action-btn:hover, .ai-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .ai-panel-content {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .ai-text-container {
          color: #e2e8f0;
          font-size: 15px;
          line-height: 1.6;
        }

        .ai-bullet {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          padding-left: 8px;
        }

        .bullet-dot {
          color: #8b5cf6;
          font-weight: bold;
        }

        .ai-header {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          margin: 24px 0 12px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ai-para {
          margin-bottom: 16px;
        }

        .ai-cursor {
          color: #8b5cf6;
          font-weight: bold;
          animation: blink 0.8s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .ai-panel-footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ai-footer-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ai-done-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .ai-done-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .icon-pulse {
          animation: glowPulse 2s infinite ease-in-out;
        }

        @keyframes glowPulse {
          0% { filter: drop-shadow(0 0 2px rgba(139, 92, 246, 0.4)); }
          50% { filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.8)); }
          100% { filter: drop-shadow(0 0 2px rgba(139, 92, 246, 0.4)); }
        }
      `}</style>
    </div>
  );
};

export default AIInsightPanel;
