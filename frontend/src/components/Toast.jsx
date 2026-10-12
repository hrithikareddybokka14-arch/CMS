import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={20} className="text-emerald-500" style={{ color: 'var(--success)' }} />}
            {toast.type === 'error' && <AlertCircle size={20} className="text-red-500" style={{ color: 'var(--danger)' }} />}
            {toast.type === 'info' && <Info size={20} className="text-blue-500" style={{ color: 'var(--primary-600)' }} />}
            
            <div style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500, color: 'var(--navy-900)' }}>
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="btn-icon"
              style={{ padding: 4 }}
              title="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return { addToast: (msg) => console.log(msg) };
  }
  return context;
};
