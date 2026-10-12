import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, User, Mail, Shield, ArrowRight, CheckCircle2, UserPlus, LogIn, Settings, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const LoginView = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [customServerUrl, setCustomServerUrl] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('CMS_API_URL')) || '';
  });

  // Login form state
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin123');

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('Admin');

  const [error, setError] = useState('');
  const { login, register, loading } = useAuth();
  const { addToast } = useToast();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    const res = await login(loginUsername, loginPassword);
    if (!res.success) {
      setError(res.error || 'Authentication failed. Please verify credentials.');
      addToast('Login failed: Invalid credentials', 'error');
    } else {
      addToast(`Welcome back, ${res.user.name || 'Admin'}!`, 'success');
      navigate('/dashboard');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!regUsername.trim() || !regPassword.trim() || !regName.trim() || !regEmail.trim()) {
      setError('Please fill in all required registration fields.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const res = await register({
      username: regUsername.trim(),
      password: regPassword.trim(),
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
    });

    if (!res.success) {
      setError(res.error || 'Registration failed. Please check inputs.');
      addToast(`Registration failed: ${res.error}`, 'error');
    } else {
      addToast(`Account created successfully! Welcome, ${res.user.name}`, 'success');
      navigate('/dashboard');
    }
  };

  const handleDemoFill = () => {
    setLoginUsername('admin');
    setLoginPassword('admin123');
    setError('');
  };

  const handleSaveServerUrl = (e) => {
    e.preventDefault();
    if (!customServerUrl.trim()) {
      localStorage.removeItem('CMS_API_URL');
      addToast('Reset backend URL to default', 'info');
    } else {
      let formatted = customServerUrl.trim().replace(/\/+$/, '');
      if (!formatted.endsWith('/api')) formatted += '/api';
      localStorage.setItem('CMS_API_URL', formatted);
      setCustomServerUrl(formatted);
      addToast(`Backend server URL updated to: ${formatted}`, 'success');
    }
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#f8fafc',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 1040,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        overflow: 'hidden'
      }}>
        {/* Left Visual / Hero Panel */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
          padding: '48px 40px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              padding: '8px 16px',
              borderRadius: 30,
              marginBottom: 32,
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Building2 size={20} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Apex Institute of Technology</span>
            </div>

            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.25, color: '#ffffff', marginBottom: 16 }}>
              Comprehensive College Administration & ERP
            </h2>
            <p style={{ color: '#bfdbfe', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Manage student admissions, faculty roster, curricula, daily attendance registers, and academic evaluations in one unified cloud portal.
            </p>
          </div>

          <div style={{ marginTop: 40, borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#e0f2fe' }}>
                <CheckCircle2 size={18} style={{ color: '#38bdf8' }} />
                <span>MongoDB Atlas Cloud Persistent Database</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#e0f2fe' }}>
                <CheckCircle2 size={18} style={{ color: '#38bdf8' }} />
                <span>Real-time Spring Boot & REST APIs on Render</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#e0f2fe' }}>
                <CheckCircle2 size={18} style={{ color: '#38bdf8' }} />
                <span>Fast & Responsive React Vite UI on Vercel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Mode Tabs: Sign In / Register */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: 12,
            marginBottom: 20
          }}>
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: !isRegister ? '#ffffff' : 'transparent',
                color: !isRegister ? '#1e293b' : '#64748b',
                fontWeight: !isRegister ? 700 : 500,
                boxShadow: !isRegister ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
                fontSize: '0.9rem'
              }}
            >
              <LogIn size={16} />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: isRegister ? '#ffffff' : 'transparent',
                color: isRegister ? '#1e293b' : '#64748b',
                fontWeight: isRegister ? 700 : 500,
                boxShadow: isRegister ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
                fontSize: '0.9rem'
              }}
            >
              <UserPlus size={16} />
              Register
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
              {isRegister ? 'Create Account' : 'Administrator Sign In'}
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
              {isRegister
                ? 'Register a new administrator or faculty account in the CMS'
                : 'Enter your credentials to manage records and access dashboard'}
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              border: '1px solid var(--danger-border)',
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: '0.86rem',
              marginBottom: 16
            }}>
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {!isRegister ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label required">Username</label>
                <div className="search-wrapper">
                  <User size={18} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    style={{ paddingLeft: 40 }}
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label required">Password</label>
                <div className="search-wrapper">
                  <Lock size={18} className="search-icon" />
                  <input
                    type="password"
                    className="search-input"
                    style={{ paddingLeft: 40 }}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                <ArrowRight size={18} />
              </button>

              <div style={{
                marginTop: 20,
                padding: '12px 14px',
                backgroundColor: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    Demo Credentials:
                  </span>
                  <button
                    type="button"
                    onClick={handleDemoFill}
                    className="btn btn-outline-primary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.74rem' }}
                  >
                    Auto Fill
                  </button>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  User: <strong style={{ color: '#0f172a' }}>admin</strong> &nbsp;|&nbsp; Pass: <strong style={{ color: '#0f172a' }}>admin123</strong>
                </div>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label required">Full Name</label>
                  <div className="search-wrapper">
                    <User size={16} className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      style={{ paddingLeft: 36 }}
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Dr. Jane Doe"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label required">Role</label>
                  <div className="search-wrapper">
                    <Shield size={16} className="search-icon" />
                    <select
                      className="search-input"
                      style={{ paddingLeft: 36, appearance: 'auto' }}
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                    >
                      <option value="Admin">Administrator</option>
                      <option value="Faculty">Faculty Member</option>
                      <option value="Staff">Academic Staff</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">Email Address</label>
                <div className="search-wrapper">
                  <Mail size={16} className="search-icon" />
                  <input
                    type="email"
                    className="search-input"
                    style={{ paddingLeft: 36 }}
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="jane.doe@apexcollege.edu"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label required">Username</label>
                  <div className="search-wrapper">
                    <User size={16} className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      style={{ paddingLeft: 36 }}
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="e.g. janedoe"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label required">Password</label>
                  <div className="search-wrapper">
                    <Lock size={16} className="search-icon" />
                    <input
                      type="password"
                      className="search-input"
                      style={{ paddingLeft: 36 }}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: 10 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register & Enter CMS'}
                <UserPlus size={18} />
              </button>

              <p style={{ marginTop: 14, textAlign: 'center', fontSize: '0.82rem', color: '#64748b' }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}

          {/* Quick Backend Server Configuration Widget */}
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Settings size={14} />
              {showConfig ? 'Hide Backend Settings' : 'Configure Backend Server URL (Render)'}
            </button>

            {showConfig && (
              <form onSubmit={handleSaveServerUrl} style={{
                marginTop: 10,
                padding: '12px',
                backgroundColor: '#f1f5f9',
                borderRadius: 8,
                textAlign: 'left'
              }}>
                <label style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Backend API URL (Render):
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    value={customServerUrl}
                    onChange={(e) => setCustomServerUrl(e.target.value)}
                    placeholder="https://cms-backend-xxxx.onrender.com/api"
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8rem'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    Save URL
                  </button>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: 4 }}>
                  Tip: Paste your Render URL here so Vercel connects immediately without needing to re-build.
                </span>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
