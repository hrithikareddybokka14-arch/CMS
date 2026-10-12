import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  danger = true
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          backgroundColor: danger ? 'var(--danger-bg)' : 'var(--warning-bg)',
          color: danger ? 'var(--danger)' : 'var(--warning)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {danger ? <Trash2 size={22} /> : <AlertTriangle size={22} />}
        </div>
        <div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 4 }}>
            {message}
          </p>
        </div>
      </div>

      <div style={{
        marginTop: 24,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12
      }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button 
          type="button" 
          className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} 
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
