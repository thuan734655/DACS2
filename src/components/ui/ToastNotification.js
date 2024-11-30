import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

const ToastNotification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? Check : AlertCircle;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0`}>
      <Icon className="w-5 h-5 mr-2" />
      <span className="mr-2">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        className="ml-4 hover:text-gray-200 focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ToastNotification;
