import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Thermometer, Zap, BarChart3 } from 'lucide-react';

const MachineCard = ({ machine, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return 'var(--success)';
      case 'Warning': return 'var(--warning)';
      case 'Critical': return 'var(--danger)';
      default: return 'var(--gray)';
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick(machine._id)}
      className="glass-card stat-card"
      style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: getStatusColor(machine.status) }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h3 style={{ margin: 0 }}>{machine.name}</h3>
          <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>{machine.type} • {machine.location}</p>
        </div>
        <div className={`status-indicator status-${machine.status.toLowerCase()}`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Thermometer size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.9rem' }}>{machine.currentData?.temperature || machine.thresholds?.temperature}°C</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} color="var(--secondary)" />
          <span style={{ fontSize: '0.9rem' }}>{machine.currentData?.vibration || machine.thresholds?.vibration}mm/s</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} color="#fbbf24" />
          <span style={{ fontSize: '0.9rem' }}>{machine.currentData?.rpm || machine.thresholds?.rpm} RPM</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={16} color="#22d3ee" />
          <span style={{ fontSize: '0.9rem' }}>{machine.currentData?.pressure || machine.thresholds?.pressure} PSI</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MachineCard;
