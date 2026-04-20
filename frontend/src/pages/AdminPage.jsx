import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Terminal, Save, Trash2, UserPlus } from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [globalThresholds, setGlobalThresholds] = useState({
    maxTemp: 90,
    maxVib: 8.5,
    maxRpm: 3500,
    criticalPressure: 120
  });

  const [users, setUsers] = useState([
    { id: 1, name: 'Soundarya', email: 'admin@predictix.io', role: 'Admin', status: 'Active' },
    { id: 2, name: 'John Doe', email: 'john@predictix.io', role: 'Engineer', status: 'Active' },
    { id: 3, name: 'Jane Smith', email: 'jane@predictix.io', role: 'Operator', status: 'Inactive' }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 101, action: 'Login', user: 'Soundarya', timestamp: '2026-04-20 19:45:12' },
    { id: 102, action: 'Update Threshold', user: 'Soundarya', timestamp: '2026-04-20 20:01:45' },
    { id: 103, action: 'Acknowledge Alert', user: 'John Doe', timestamp: '2026-04-20 20:15:30' }
  ]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Control Center</h2>
        <p style={{ color: 'var(--gray)' }}>System-wide configurations and administrative tools</p>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('users')} 
          className={`btn ${activeTab === 'users' ? 'btn-primary' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: activeTab === 'users' ? '' : 'rgba(255,255,255,0.05)' }}
        >
          <Users size={18} /> User Management
        </button>
        <button 
          onClick={() => setActiveTab('config')} 
          className={`btn ${activeTab === 'config' ? 'btn-primary' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: activeTab === 'config' ? '' : 'rgba(255,255,255,0.05)' }}
        >
          <Shield size={18} /> Global Config
        </button>
        <button 
          onClick={() => setActiveTab('logs')} 
          className={`btn ${activeTab === 'logs' ? 'btn-primary' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: activeTab === 'logs' ? '' : 'rgba(255,255,255,0.05)' }}
        >
          <Terminal size={18} /> Audit Trail
        </button>
      </div>

      <div className="glass-card">
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Active Personnel</h3>
              <button className="btn" style={{ background: 'var(--primary)', color: 'white', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <UserPlus size={14} /> Add User
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--gray)', fontSize: '0.8rem' }}>
                <tr>
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Role</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px' }}>{u.name}<br/><span style={{ fontSize: '0.7rem', color: 'var(--gray)' }}>{u.email}</span></td>
                    <td style={{ padding: '12px' }}><span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', fontSize: '0.8rem' }}>{u.role}</span></td>
                    <td style={{ padding: '12px' }}>{u.status}</td>
                    <td style={{ padding: '12px' }}><Trash2 size={16} color="var(--danger)" style={{ cursor: 'pointer' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'config' && (
          <div style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Global Maintenance Thresholds</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--gray)', marginBottom: '8px', fontSize: '0.9rem' }}>Max Temperature (°C)</label>
                <input type="number" className="glass-input" value={globalThresholds.maxTemp} onChange={e => setGlobalThresholds({...globalThresholds, maxTemp: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--gray)', marginBottom: '8px', fontSize: '0.9rem' }}>Max Vibration (mm/s)</label>
                <input type="number" className="glass-input" value={globalThresholds.maxVib} onChange={e => setGlobalThresholds({...globalThresholds, maxVib: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--gray)', marginBottom: '8px', fontSize: '0.9rem' }}>RPM Redline</label>
                <input type="number" className="glass-input" value={globalThresholds.maxRpm} onChange={e => setGlobalThresholds({...globalThresholds, maxRpm: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--gray)', marginBottom: '8px', fontSize: '0.9rem' }}>Critical Pressure (PSI)</label>
                <input type="number" className="glass-input" value={globalThresholds.criticalPressure} onChange={e => setGlobalThresholds({...globalThresholds, criticalPressure: e.target.value})} />
              </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18} /> Apply System Settings
            </button>
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Audit Logs</h3>
            <div style={{ background: 'var(--darker)', borderRadius: '8px', padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#10b981' }}>
              {auditLogs.map(log => (
                <div key={log.id} style={{ marginBottom: '4px' }}>
                  <span style={{ color: 'var(--gray)' }}>[{log.timestamp}]</span> {log.user} performed <span style={{ color: 'var(--secondary)' }}>{log.action}</span> (ID: {log.id})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .glass-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 10px;
          color: white;
          outline: none;
        }
      `}</style>
    </motion.div>
  );
};

export default AdminPage;
