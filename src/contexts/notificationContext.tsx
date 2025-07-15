import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Match the backend fields
export interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  timestamp: string; // ISO timestamp (e.g., "2025-07-15T13:00:00Z")
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const API_BASE = "http://localhost:8000"; // Adjust as needed

  // 🔁 Fetch notifications on mount
  useEffect(() => {
    axios
      .get<Notification[]>(`${API_BASE}/notifications/`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  // ➕ Add a new notification to backend
  const addNotification = async (message: string) => {
    try {
      const res = await axios.post<Notification>(`${API_BASE}/notifications/`, {
        message,
        is_read: false,
      });
      setNotifications((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Error adding notification:", err);
    }
  };

  // ✅ Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const res = await axios.put<Notification[]>(`${API_BASE}/notifications/mark-all-read`);
      const updatedIds = new Set(res.data.map((n) => n.id));
      setNotifications((prev) =>
        prev.map((n) =>
          updatedIds.has(n.id) ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};
