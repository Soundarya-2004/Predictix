import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const AlertsPage = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [alerts, setAlerts] = useState([
    { id: 1, machineName: 'Pump #4', severity: 'Critical', message: 'Vibration exceeds 8.0mm/s', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
    { id: 2, machineName: 'Motor #2', severity: 'Warning', message: 'Temperature at 86°C', timestamp: new Date(Date.now() - 1000 * 60 * 45) }
  ]);
  const [resolvedAlerts, setResolvedAlerts] = useState([
    { id: 3, machineName: 'Conveyor #1', severity: 'Resolved', message: 'Pressure spike detected', resolution: 'Manual vent valve opened. Pressure stabilized.', technician: 'Soundarya', timestamp: new Date(Date.now() - 1000 * 60 * 120) }
  ]);

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    socket.on('new-alert', (alert) => {
      setAlerts(prev => [alert, ...prev]);
    });
    return () => socket.off('new-alert');
  }, []);

  const handleResolve = (alert) => {
    setSelectedAlert(alert);
  };

  const submitResolution = () => {
    const resolvedData = {
      ...selectedAlert,
      severity: 'Resolved',
      resolution: resolution,
      technician: JSON.parse(localStorage.getItem('userInfo') || '{}').name || 'System Admin',
      resolvedAt: new Date()
    };
    
    setResolvedAlerts(prev => [resolvedData, ...prev]);
    setAlerts(prev => prev.filter(a => a.id !== selectedAlert.id));
    setSelectedAlert(null);
    setResolution('');
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'Critical': return { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)', border: 'var(--danger)' };
      case 'Warning': return { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)', border: 'var(--warning)' };
      default: return { color: 'var(--success)', bg: 'rgba(34, 197, 94, 0.1)', border: 'var(--success)' };
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Maintenance Events</h2>
        <p style={{ color: 'var(--gray)' }}>System-wide alerts and resolution history</p>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('active')} className={`btn ${activeTab === 'active' ? 'btn-primary' : ''}`} style={{ background: activeTab === 'active' ? '' : 'rgba(255,255,255,0.05)' }}>
          Active Anomalies ({alerts.length})
        </button>
        <button onClick={() => setActiveTab('history')} className={`btn ${activeTab === 'history' ? 'btn-primary' : ''}`} style={{ background: activeTab === 'history' ? '' : 'rgba(255,255,255,0.05)' }}>
          Resolution History ({resolvedAlerts.length})
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activeTab === 'active' ? (
          alerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <motion.div 
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={alert.id || alert.timestamp} 
                className="glass-card" 
                style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: `4px solid ${styles.color}` }}
              >
                <div style={{ padding: '12px', borderRadius: '12px', background: styles.bg }}>
                  <ShieldAlert color={styles.color} size={24} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>{alert.machineName}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0', color: 'var(--light)', opacity: 0.8 }}>{alert.message}</p>
                  {alert.suggestion && (
                    <p style={{ margin: '8px 0 0', color: 'var(--primary)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      💡 AI Suggestion: {alert.suggestion}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>Acknowledge</button>
                  <button 
                    onClick={() => handleResolve(alert)}
                    className="btn" 
                    style={{ background: styles.bg, color: styles.color, border: `1px solid ${styles.color}`, fontSize: '0.8rem' }}
                  >
                    Resolve
                  </button>
                </div>
              </motion.div>
            )
          })
        ) : (
          resolvedAlerts.map((alert) => (
            <div key={alert.id || alert.timestamp} className="glass-card" style={{ borderLeft: '4px solid var(--success)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0 }}>{alert.machineName} <span style={{ fontSize: '0.7rem', color: 'var(--success)', marginLeft: '8px', padding: '2px 6px', background: 'rgba(34,197,94,0.1)', borderRadius: '4px' }}>RESOLVED</span></h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{new Date(alert.timestamp).toLocaleDateString()} {new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
              <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--gray)' }}>Original Alert: {alert.message}</p>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px dashed var(--glass-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>Technician Notes - {alert.technician}</div>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{alert.resolution}</p>
              </div>
            </div>
          ))
        )}
        {((activeTab === 'active' && alerts.length === 0) || (activeTab === 'history' && resolvedAlerts.length === 0)) && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray)' }}>
            <CheckCircle2 size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No records found in this category.</p>
          </div>
        )}
      </div>

      {selectedAlert && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '10px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ margin: 0 }}>Resolve Alert</h3>
            </div>
            
            <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>
              Document the maintenance actions taken for <strong>{selectedAlert.machineName}</strong>. This will be logged in the system audit trail.
            </p>

            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--light)' }}>Maintenance Log</label>
            <textarea 
              className="glass-input" 
              placeholder="E.g., Replaced bearing, topped up coolant, restarted system..."
              style={{ width: '100%', height: '120px', resize: 'none', marginBottom: '2rem' }}
              value={resolution}
              onChange={e => setResolution(e.target.value)}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setSelectedAlert(null)} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
              <button onClick={submitResolution} className="btn btn-primary" style={{ flex: 2 }}>Confirm Resolution</button>
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        .glass-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 12px;
          color: white;
          outline: none;
        }
      `}</style>
    </motion.div>
  );
};

export default AlertsPage;
