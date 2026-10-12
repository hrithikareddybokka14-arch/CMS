import React from 'react';

export const SummaryCard = ({ title, value, icon: Icon, badge, subtitle, color = 'blue' }) => {
  const colorMap = {
    blue: {
      bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      iconBg: '#2563eb',
      iconColor: '#ffffff',
      border: '#bfdbfe'
    },
    emerald: {
      bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      iconBg: '#10b981',
      iconColor: '#ffffff',
      border: '#a7f3d0'
    },
    indigo: {
      bg: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
      iconBg: '#4f46e5',
      iconColor: '#ffffff',
      border: '#c7d2fe'
    },
    amber: {
      bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      iconBg: '#f59e0b',
      iconColor: '#ffffff',
      border: '#fde68a'
    },
    purple: {
      bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
      iconBg: '#9333ea',
      iconColor: '#ffffff',
      border: '#e9d5ff'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div 
      className="card"
      style={{
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: 4, letterSpacing: '-0.02em' }}>
            {value}
          </div>
        </div>

        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: scheme.iconBg,
          color: scheme.iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)'
        }}>
          {Icon && <Icon size={24} />}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {subtitle}
        </span>
        {badge && (
          <span className="badge badge-primary" style={{ fontSize: '0.74rem' }}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
