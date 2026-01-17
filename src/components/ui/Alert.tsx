'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

interface AlertProps {
  type?:  'success' | 'error' | 'warning' | 'info';
  title?: string;
  message:  string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  timeout?: number; // Thêm timeout (ms)
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  action,
  className = '',
  timeout
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto dismiss sau timeout
  useEffect(() => {
    if (timeout && timeout > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [timeout, onDismiss]);

  if (!isVisible) return null;

  const configs = {
    success: {
      icon: faCheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-800',
      textColor: 'text-green-700',
      actionColor: 'text-green-700 hover:text-green-800 hover:bg-green-100'
    },
    error:  {
      icon: faExclamationCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
      actionColor: 'text-red-700 hover:text-red-800 hover:bg-red-100'
    },
    warning: {
      icon: faExclamationTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800',
      textColor:  'text-yellow-700',
      actionColor: 'text-yellow-700 hover:text-yellow-800 hover:bg-yellow-100'
    },
    info: {
      icon: faInfoCircle,
      bgColor: 'bg-blue-50',
      borderColor:  'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700',
      actionColor: 'text-blue-700 hover:text-blue-800 hover:bg-blue-100'
    }
  };

  const config = configs[type];

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className={`
        ${config.bgColor} ${config. borderColor}
        border rounded-xl p-4
        ${className}
      `}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <FontAwesomeIcon icon={config.icon} className={`${config.iconColor} text-lg`} />
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-semibold ${config.titleColor} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${config.textColor}`}>
            {message}
          </p>
          
          {action && (
            <div className="mt-3">
              <button
                onClick={action.onClick}
                className={`
                  text-sm font-medium px-3 py-1.5 rounded-lg
                  transition-colors duration-200
                  ${config.actionColor}
                `}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        
        {dismissible && (
          <div className="ml-3 flex-shrink-0">
            <button
              onClick={handleDismiss}
              className={`
                p-1.5 rounded-lg transition-colors duration-200
                ${config.textColor} hover:bg-white/50
              `}
            >
              <FontAwesomeIcon icon={faTimes} className="text-sm" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;