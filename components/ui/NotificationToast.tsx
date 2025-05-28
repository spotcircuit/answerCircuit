'use client';

import React from 'react';
import { Notification } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle, 
  faExclamationTriangle, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '@/context/NotificationContext';

interface NotificationToastProps {
  notification: Notification;
}

export default function NotificationToast({ notification }: NotificationToastProps) {
  const { removeNotification } = useNotifications();

  const getIconAndColor = () => {
    switch (notification.type) {
      case 'success':
        return { 
          icon: faCheckCircle, 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'error':
        return { 
          icon: faExclamationCircle, 
          bgColor: 'bg-red-100', 
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      case 'warning':
        return { 
          icon: faExclamationTriangle, 
          bgColor: 'bg-yellow-100', 
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        };
      case 'info':
      default:
        return { 
          icon: faInfoCircle, 
          bgColor: 'bg-blue-100', 
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
    }
  };

  const { icon, bgColor, textColor, borderColor } = getIconAndColor();

  return (
    <div 
      className={`${bgColor} ${textColor} ${borderColor} border p-4 rounded-md shadow-md flex items-start`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        <FontAwesomeIcon icon={icon} className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p>{notification.message}</p>
      </div>
      <button 
        onClick={() => removeNotification(notification.id)}
        className="ml-3 flex-shrink-0 focus:outline-none"
        aria-label="Close notification"
      >
        <FontAwesomeIcon icon={faTimes} className="h-4 w-4 opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
}
