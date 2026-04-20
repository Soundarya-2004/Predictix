import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Settings, MapPin, Cpu } from 'lucide-react';
import api from '../utils/api';

const MachinesPage = () => {
  const [machines, setMachines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [newMachine, setNewMachine] = useState({
    name: '',
    type: '',
    location: '',
    thresholds: { temperature: 80, vibration: 5, rpm: 3000, pressure: 100 }
  });

  const fetchMachines = async () => {
    try {
      const { data } = await api.get('/machines');
      setMachines(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleAddMachine = async (e) => {
    e.preventDefault();
    try {
      await api.post('/machines', newMachine);
      setShowAddModal(false);
      fetchMachines();
    } catch (error) {
      alert('Error adding machine (Demo mode: Additions are temporary)');
      // For demo, just add it to local state
      setMachines([...machines, { ...newMachine, _id: Date.now().toString(), status: 'Healthy' }]);
      setShowAddModal(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Machine Assets</h2>
          <p style={{ color: 'var(--gray)' }}>Manage and configure your industrial equipment</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Add Machine
        </button>
      </header>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--gray)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '16px 24px' }}>Machine Name</th>
              <th style={{ padding: '16px 24px' }}>Type</th>
              <th style={{ padding: '16px 24px' }}>Location</th>
              <th style={{ padding: '16px 24px' }}>Status</th>
              <th style={{ padding: '16px 24px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((machine) => (
              <tr key={machine._id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '16px 24px', fontWeight: '600' }}>
                  {machine.name}
                  <div style={{ fontSize: '0.65rem', color: 'var(--gray)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    ID: {machine._id}
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(machine._id);
                        alert('Machine ID Copied!');
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.65rem', padding: 0 }}
                    >
                      (Copy)
                    </button>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>{machine.type}</td>
                <td style={{ padding: '16px 24px' }}>{machine.location}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={`status-indicator status-${machine.status.toLowerCase()}`} style={{ marginRight: '8px' }} />
                  {machine.status}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => setSelectedMachine(machine)}
                      className="btn" 
                      style={{ padding: '4px', background: 'transparent' }}
                    >
                      <Settings size={18} color="var(--gray)" />
                    </button>
                    <button className="btn" style={{ padding: '4px', background: 'transparent' }}><Trash2 size={18} color="var(--danger)" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
            <h3>Register New Machine</h3>
            <form onSubmit={handleAddMachine} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <input type="text" placeholder="Machine Name" className="glass-input" value={newMachine.name} onChange={e => setNewMachine({...newMachine, name: e.target.value})} required />
              <input type="text" placeholder="Machine Type (e.g. Pump, Motor)" className="glass-input" value={newMachine.type} onChange={e => setNewMachine({...newMachine, type: e.target.value})} required />
              <input type="text" placeholder="Location" className="glass-input" value={newMachine.location} onChange={e => setNewMachine({...newMachine, location: e.target.value})} required />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Machine</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedMachine && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0 }}>Configure {selectedMachine.name}</h3>
              <button onClick={() => setSelectedMachine(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--gray)' }}>Warning Temp (°C)</label>
                <input type="number" className="glass-input" defaultValue={selectedMachine.thresholds?.temperature} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--gray)' }}>Warning Vibration (mm/s)</label>
                <input type="number" className="glass-input" defaultValue={selectedMachine.thresholds?.vibration} />
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button onClick={() => setSelectedMachine(null)} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
              <button onClick={() => setSelectedMachine(null)} className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .glass-input {
          width: 100%;
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

export default MachinesPage;
