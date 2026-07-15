import React, { useState } from 'react';
import { Bell, Check, Trash2, Mail, Info, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
}

export default function NotificationsView({ notifications, onMarkAsRead, onMarkAllAsRead, onDeleteNotification }: NotificationsViewProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return n.unread;
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'wallet':
        return <CreditCard className="w-5 h-5 text-indigo-600 shrink-0" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-slate-600 shrink-0" />;
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div id="notifications-view" className="flex flex-col animate-fade-in w-72">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col space-y-2 p-2">
        <div className="flex items-center justify-between px-2 pt-1 border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold text-slate-900 tracking-tight">Notifications</h2>
          <button
            onClick={onMarkAllAsRead}
            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Mark all read
          </button>
        </div>

        <div className="space-y-1 max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-4 text-center text-[10px] text-slate-400">No new notifications</div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => notif.unread && onMarkAsRead(notif.id)}
                className={`p-2 rounded flex items-start gap-2 transition-all cursor-pointer ${
                  notif.unread
                    ? 'bg-slate-50 hover:bg-slate-100'
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-[11px] truncate ${notif.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-tight truncate">
                    {notif.description}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNotification(notif.id);
                  }}
                  className="p-0.5 rounded text-slate-300 hover:text-rose-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
