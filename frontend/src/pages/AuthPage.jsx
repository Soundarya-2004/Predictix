import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import api from '../utils/api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Operator'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            PREDICTIX
          </h1>
          <p style={{ color: 'var(--gray)' }}>{isLogin ? 'Welcome back to Operations' : 'Join the Maintenance Network'}</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid var(--danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div className="input-group">
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="glass-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="glass-input"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
              <input 
                type="password" 
                placeholder="Password" 
                className="glass-input"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="input-group">
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                <select 
                  className="glass-input"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{ appearance: 'none', background: 'var(--dark)' }}
                >
                  <option value="Operator">Operator</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', height: '45px' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--gray)' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', marginLeft: '8px' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </motion.div>

      <style>{`
        .glass-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 12px 12px 12px 40px;
          color: white;
          outline: none;
          transition: border-color 0.3s ease;
        }
        .glass-input:focus {
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
