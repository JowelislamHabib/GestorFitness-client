"use client";

import { Bell, CheckCircle2, Circle, AlertCircle, Info, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, deleteAllNotifications } from "@/lib/api/notifications";
import { useSession } from "@/lib/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function NotificationsDropdown() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Optional: Set up an interval to poll for notifications every minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications(userId);
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      const removedItem = notifications.find((n) => n._id === id);
      if (removedItem && !removedItem.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications(userId);
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative flex size-10 items-center justify-center rounded-xl border border-border/50 bg-card p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted transition-colors">
          <Bell className="size-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-in zoom-in">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96 rounded-2xl p-0 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-bold">Notifications</h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Mark read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteAll}
                className="h-auto px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground px-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                <Bell className="size-6 opacity-50" />
              </div>
              <p className="text-sm">You have no notifications.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`group relative flex flex-col gap-1 p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-red-500/5" : ""
                  }`}
                  onClick={() => {
                    if (!notification.read) handleMarkAsRead(notification._id);
                    if (!notification.link) setIsOpen(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {!notification.read ? (
                        <Circle className="size-2 fill-red-600 text-red-600" />
                      ) : (
                        <Circle className="size-2 text-transparent" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1 pr-6 relative">
                      <p className={`text-sm ${!notification.read ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                      {notification.link && (
                        <Link
                          href={notification.link}
                          onClick={() => setIsOpen(false)}
                          className="inline-block mt-2 text-xs font-bold text-red-600 hover:underline"
                        >
                          View Details
                        </Link>
                      )}
                      <button 
                        onClick={(e) => handleDelete(e, notification._id)}
                        className="absolute -top-1 -right-2 p-1.5 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete notification"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
