import React from 'react';
import { Menu, Bell, Search, Calendar, ShieldCheck, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onToggleSidebar, activeTab }) => {
  const { user } = useAuth();

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Executive Dashboard';
      case 'students': return 'Student Directory & Records';
      case 'faculty': return 'Faculty & Staff Roster';
      case 'courses': return 'Curriculum & Departments';
      case 'attendance': return 'Daily Attendance Register';
      case 'marks': return 'Grades & Academic Evaluations';
      case 'student-detail': return 'Student Comprehensive Profile';
      default: return 'College Management System';
    }
  };

  return (
    <header style={{
      height: 70,
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
    }}>
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onToggleSidebar}
          className="btn-icon"
          style={{ display: 'inline-flex', padding: 8 }}
          title="Toggle Navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
            {getPageTitle(activeTab)}
          </h1>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Apex Institute of Technology • Institutional ERP
          </div>
        </div>
      </div>

      {/* Right: Academic term badge, notifications, and Admin Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Term Badge */}
        <div 
          className="badge badge-neutral"
          style={{ 
            padding: '6px 12px', 
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Calendar size={14} style={{ color: 'var(--primary-600)' }} />
          <span>AY 2024–2025</span>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button className="btn-icon" title="Notifications">
            <Bell size={20} />
            <span style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              border: '2px solid #fff'
            }} />
          </button>
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, height: 28, backgroundColor: '#e2e8f0' }} />

        {/* Current Admin Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 2px 4px rgba(30, 64, 175, 0.2)'
          }}>
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f172a' }}>
              {user?.name || 'Administrator'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              {user?.role || 'System Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
