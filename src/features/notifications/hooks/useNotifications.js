import { useCallback, useEffect, useState } from "react";

import notificationService from "../services/notification.service";

const POLL_INTERVAL_MS = 30000;
const RECENT_LIMIT = 8;

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [recent, count] = await Promise.all([
        notificationService.getRecent(RECENT_LIMIT),
        notificationService.getUnreadCount(),
      ]);

      setNotifications(recent.items);
      setUnreadCount(count);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    const interval = setInterval(load, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [load]);

  const markAsRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );

      setUnreadCount((previous) => Math.max(0, previous - 1));
    } catch {
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch {
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: load,
  };
}