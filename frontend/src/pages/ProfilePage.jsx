import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Briefcase, Calendar, MapPin } from 'lucide-react';

const ProfilePage = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const profileData = [
    { label: 'Full Name', value: userInfo.name || 'Demo User', icon: <User size={20} /> },
    { label: 'Email Address', value: userInfo.email || 'demo@predictix.io', icon: <Mail size={20} /> },
    { label: 'System Role', value: userInfo.role || 'Operator', icon: <Shield size={20} /> },
    { label: 'Department', value: 'Operations & Maintenance', icon: <Briefcase size={20} /> },
    { label: 'Location', value: 'Central Hub - Sector 4', icon: <MapPin size={20} /> },
    { label: 'Member Since', value: 'April 2026', icon: <Calendar size={20} /> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>User Profile</h2>
        <p style={{ color: 'var(--gray)' }}>Manage your personal account and system preferences</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Profile Card */}
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: '800',
            color: 'white',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            {(userInfo.name || 'D').charAt(0).toUpperCase()}
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{userInfo.name || 'Demo User'}</h3>
          <p style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>
            {userInfo.role || 'Operator'}
          </p>
          
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>12</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gray)', textTransform: 'uppercase' }}>Assets</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>45</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gray)', textTransform: 'uppercase' }}>Reports</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>0</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gray)', textTransform: 'uppercase' }}>Alerts</div>
            </div>
          </div>
        </div>

        {/* Details List */}
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {profileData.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--primary)', marginTop: '4px' }}>
                {item.icon}
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--gray)', fontSize: '0.8rem', marginBottom: '4px', textTransform: 'uppercase' }}>
                  {item.label}
                </label>
                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
          
          <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <button className="btn btn-primary" style={{ width: 'auto' }}>
              Edit Profile Information
            </button>
            <button className="btn" style={{ marginLeft: '1rem', background: 'rgba(255, 255, 255, 0.05)' }}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
