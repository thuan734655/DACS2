import React, { useState, useEffect } from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";

const ToastNotification = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-500",
          icon: Check,
          shadow: "shadow-emerald-500/20",
        };
      case "error":
        return {
          bg: "bg-red-500",
          icon: AlertCircle,
          shadow: "shadow-red-500/20",
        };
      case "info":
        return {
          bg: "bg-blue-500",
          icon: Info,
          shadow: "shadow-blue-500/20",
        };
      default:
        return {
          bg: "bg-gray-500",
          icon: Info,
          shadow: "shadow-gray-500/20",
        };
    }
  };

  const { bg, icon: Icon, shadow } = getToastStyles();

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 
        flex items-center ${bg} text-white 
        px-4 py-3 rounded-lg shadow-lg ${shadow}
        transform transition-all duration-300 ease-in-out
        ${
          isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }
        hover:scale-102 hover:shadow-xl
      `}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="mr-2 font-medium text-sm">{message}</span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
          }, 300);
        }}
        className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors duration-200 focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ToastNotification;
