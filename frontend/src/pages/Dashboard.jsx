import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import MachineCard from '../components/MachineCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Dashboard = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState({});
  const [chartHistory, setChartHistory] = useState([]);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const { data } = await api.get('/machines');
        setMachines(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchMachines();

    // Listen for global machine status updates
    socket.on('machine-status-update', ({ machineId, status }) => {
      setMachines(prev => prev.map(m => m._id === machineId ? { ...m, status } : m));
    });

    // Listen for live sensor data and update history
    const handleData = (data) => {
      setLiveData(prev => ({
        ...prev,
        [data.machineId]: data
      }));

      // Update chart history (rolling 20 points)
      setChartHistory(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString().split(' ')[0],
          temperature: data.temperature,
          vibration: data.vibration,
          pressure: data.pressure,
          machineId: data.machineId
        };
        const updated = [...prev, newPoint];
        if (updated.length > 50) return updated.slice(1);
        return updated;
      });
    };

    // For demo, we listen to a generic broadcast or specific IDs
    // In real app, we would subscribe to specific rooms
    socket.onAny((event, data) => {
      if (event.startsWith('machine-data-')) {
        handleData(data);
      }
    });

    return () => {
      socket.off('machine-status-update');
      socket.offAny();
    };
  }, []);

  const stats = [
    { label: 'Total Machines', value: machines.length, icon: <TrendingUp />, color: 'var(--primary)' },
    { label: 'Critical', value: machines.filter(m => m.status === 'Critical').length, icon: <AlertTriangle />, color: 'var(--danger)' },
    { label: 'Warning', value: machines.filter(m => m.status === 'Warning').length, icon: <AlertTriangle />, color: 'var(--warning)' },
    { label: 'Healthy', value: machines.filter(m => m.status === 'Healthy').length, icon: <CheckCircle />, color: 'var(--success)' },
  ];

  const dummyData = [
    { name: '10:00', temp: 65, vib: 2.1 },
    { name: '10:10', temp: 68, vib: 2.3 },
    { name: '10:20', temp: 72, vib: 2.8 },
    { name: '10:30', temp: 70, vib: 2.5 },
    { name: '10:40', temp: 75, vib: 3.1 },
    { name: '10:50', temp: 82, vib: 4.2 },
    { name: '11:00', temp: 78, vib: 3.8 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      role="main"
      aria-labelledby="dashboard-title"
    >
      <header style={{ marginBottom: '2rem' }}>
        <h2 id="dashboard-title" style={{ fontSize: '2rem', fontWeight: '700' }}>Operations Overview</h2>
        <p style={{ color: 'var(--gray)' }}>Real-time health monitoring of all assets</p>
      </header>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[1,2,3,4].map(i => <div key={i} className="glass-card" style={{ height: '100px', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {stats.map((stat, i) => (
            <section key={i} className="glass-card stat-card" style={{ borderLeft: `4px solid ${stat.color}` }} aria-label={stat.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="stat-label">{stat.label}</span>
                <div style={{ color: stat.color }} aria-hidden="true">{stat.icon}</div>
              </div>
              <span className="stat-value">{stat.value}</span>
            </section>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>System Performance (Real-Time)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartHistory}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="var(--gray)" fontSize={12} />
                <YAxis stroke="var(--gray)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="temperature" stroke="var(--primary)" fillOpacity={1} fill="url(#colorTemp)" />
                <Line type="monotone" dataKey="vibration" stroke="var(--secondary)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '8px', display: 'flex', gap: '12px' }}>
              <AlertTriangle color="var(--danger)" />
              <div>
                <p style={{ fontWeight: '600', margin: 0 }}>High Vibration - Pump #4</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>10 minutes ago</p>
              </div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', borderRadius: '8px', display: 'flex', gap: '12px' }}>
              <AlertTriangle color="var(--warning)" />
              <div>
                <p style={{ fontWeight: '600', margin: 0 }}>Temperature Spike - Motor #2</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>25 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <Cpu size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>AI Maintenance Automation</h3>
          </div>
          <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--primary)', color: 'white' }}><TrendingUp size={18} /></div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Predictive Schedule Generated</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray)', margin: '4px 0' }}>AI has scheduled a calibration for <strong>Motor #2</strong> on April 25th based on current vibration trends.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--secondary)', color: 'white' }}><CheckCircle size={18} /></div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Auto-Optimization Active</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray)', margin: '4px 0' }}>Cooling fan speed increased by 15% on <strong>Pump #4</strong> to compensate for ambient temperature rise.</p>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>Generate Full AI Maintenance Report</button>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1.5rem' }}>Asset Monitoring</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {machines.map(machine => (
          <MachineCard 
            key={machine._id} 
            machine={{
              ...machine,
              currentData: liveData[machine._id]
            }} 
            onClick={(id) => console.log('Click', id)} 
          />
        ))}
        {machines.length === 0 && !loading && (
           <p style={{ color: 'var(--gray)' }}>No machines found. Add machines in the Admin panel.</p>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
