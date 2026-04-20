import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bell, Settings, Activity, User, LogOut } from 'lucide-react';

const Sidebar = () => {
  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          PREDICTIX
        </h1>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
          {JSON.parse(localStorage.getItem('userInfo') || '{}').name?.charAt(0) || 'U'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {JSON.parse(localStorage.getItem('userInfo') || '{}').name || 'User Name'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--gray)', textTransform: 'uppercase' }}>
            {JSON.parse(localStorage.getItem('userInfo') || '{}').role || 'Operator'}
          </div>
        </div>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} role="navigation" aria-label="Main Navigation">
        <NavLink to="/" aria-label="Dashboard Overview" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <LayoutDashboard size={20} aria-hidden="true" /> Dashboard
        </NavLink>
        <NavLink to="/alerts" aria-label="View Alerts" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <Bell size={20} aria-hidden="true" /> Alerts
        </NavLink>
        <NavLink to="/machines" aria-label="Manage Machines" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <Activity size={20} aria-hidden="true" /> Machines
        </NavLink>
        <NavLink to="/admin" aria-label="System Administration" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <Settings size={20} aria-hidden="true" /> Admin
        </NavLink>
        <NavLink to="/profile" aria-label="User Profile" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <User size={20} aria-hidden="true" /> Profile
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button onClick={logoutHandler} className="btn" aria-label="Logout from system" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: 'transparent', color: 'var(--danger)' }}>
          <LogOut size={20} aria-hidden="true" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
