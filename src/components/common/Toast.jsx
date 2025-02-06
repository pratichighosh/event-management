// src/components/common/Toast.jsx
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const baseStyles = "fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out z-50";
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white"
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]} animate-slide-in`}>
      <div className="flex items-center gap-2">
        {type === 'success' && <span>✅</span>}
        {type === 'error' && <span>❌</span>}
        {type === 'info' && <span>ℹ️</span>}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;