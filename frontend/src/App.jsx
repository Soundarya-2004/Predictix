import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import MachinesPage from './pages/MachinesPage';
import AlertsPage from './pages/AlertsPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

// Simple Protected Route Component
const ProtectedRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) {
    return <Navigate to="/auth" />;
  }
  return (
    <div className="grid-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

const Placeholder = ({ title }) => (
  <div className="glass-card">
    <h2>{title}</h2>
    <p>This feature is coming soon...</p>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
        <Route path="/machines" element={<ProtectedRoute><MachinesPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
