import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  BookOpen, 
  CalendarCheck, 
  Award, 
  LogOut, 
  Building2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'courses', label: 'Courses & Depts', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'marks', label: 'Marks & Grades', icon: Award },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 90,
            display: 'block'
          }}
        />
      )}

      <aside 
        className={`cms-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: 270,
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          borderRight: '1px solid #1e293b',
          transition: 'transform 0.25s ease',
          flexShrink: 0,
        }}
      >
        {/* Brand Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.4)'
          }}>
            <Building2 size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              APEX COLLEGE
            </h2>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 500 }}>
              Administrative Portal
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ padding: '20px 14px', flex: 1, overflowY: 'auto' }}>
          <div style={{ 
            fontSize: '0.68rem', 
            fontWeight: 700, 
            letterSpacing: '0.08em', 
            textTransform: 'uppercase', 
            color: '#64748b', 
            marginBottom: 10,
            paddingLeft: 10
          }}>
            Main Menu
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 8,
                    border: 'none',
                    background: isActive ? 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%)' : 'transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#1e293b';
                      e.currentTarget.style.color = '#f1f5f9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#94a3b8';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon size={19} style={{ color: isActive ? '#ffffff' : '#64748b' }} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile & Logout footer */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #1e293b',
          backgroundColor: '#090d16'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12,
            padding: '8px 10px',
            backgroundColor: '#1e293b',
            borderRadius: 8
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#fff'
            }}>
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontSize: '0.82rem', 
                fontWeight: 600, 
                color: '#f8fafc',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={12} />
                <span>Super Admin</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '9px 14px',
              backgroundColor: '#ef444415',
              border: '1px solid #ef444430',
              borderRadius: 8,
              color: '#f87171',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ef444415';
              e.currentTarget.style.color = '#f87171';
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
