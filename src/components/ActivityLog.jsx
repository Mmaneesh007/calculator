import React, { useState, useEffect } from 'react';
import { Clock, User, X, Activity } from 'lucide-react';
import { getDashboardLogs } from '../services/firestore';

const ActivityLog = ({ dashboardId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dashboardId) return;
    
    const fetchLogs = async () => {
      setLoading(true);
      const data = await getDashboardLogs(dashboardId);
      setLogs(data);
      setLoading(false);
    };

    fetchLogs();
    // In a real production app, we would use onSnapshot here too, 
    // but for an activity log, a manual refresh or fetch-on-open is often enough.
  }, [dashboardId]);

  return (
    <div className="activity-sidebar-overlay" onClick={onClose}>
      <div className="activity-sidebar" onClick={e => e.stopPropagation()}>
        <div className="activity-header">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-purple-400" />
            <h3 className="m-0 text-white font-bold">Activity Log</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="activity-body">
          {loading ? (
            <div className="activity-loading">
              <div className="spinner-small"></div>
              <span>Fetching audit trail...</span>
            </div>
          ) : logs.length > 0 ? (
            <div className="log-list">
              {logs.map((log) => (
                <div key={log.id} className="log-item">
                  <div className="log-icon-box">
                    <User size={14} />
                  </div>
                  <div className="log-content">
                    <p className="log-action">
                      <span className="log-user">{log.userName}</span> {log.action}
                    </p>
                    <span className="log-time">
                      <Clock size={10} /> 
                      {log.timestamp?.toDate?.().toLocaleString() || 'Just now'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-activity">
              <p>No activity recorded yet.</p>
            </div>
          )}
        </div>

        <div className="activity-footer">
          <p>Activity is logged for compliance and security.</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
