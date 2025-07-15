import { useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { useNotifications } from "@/contexts/notificationContext";
import { Button } from "@/components/ui/button"; // 🧼 Import your shared Button component

const NotificationBell = () => {
  const { notifications, markAllAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Fix this line to use is_read (matches your Notification interface)
  const hasUnread = notifications.some((n) => !n.is_read);
  const Icon = showDropdown || isHovered ? BellRing : Bell;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        variant="ghost"
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative flex items-center justify-center h-10 w-10 p-0"
      >
        <Icon className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.filter((n) => !n.is_read).length}
          </span>
        )}
      </Button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-md z-10">
          <div className="flex justify-between items-center px-3 py-2 border-b">
            <span className="font-semibold text-sm">Notifications</span>
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-500 hover:underline"
            >
              Mark all as read
            </button>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-3 text-sm text-gray-500">No notifications</li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={`px-3 py-2 text-sm ${
                    n.is_read ? "text-gray-500" : "font-semibold"
                  }`}
                >
                  {n.message}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
  
};
export default NotificationBell;

