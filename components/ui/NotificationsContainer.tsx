'use client';

import React from 'react';
import { useNotifications } from '@/context/NotificationContext';
import NotificationToast from './NotificationToast';

export default function NotificationsContainer() {
  const { notifications } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 max-w-md">
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
