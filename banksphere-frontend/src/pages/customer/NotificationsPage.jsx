import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  FileCheck2,
  HelpCircle,
  Inbox,
  Clock,
} from 'lucide-react';
import { useBankData } from '../../context/BankDataContext';
import { formatDate } from '../../utils/formatters';

const TYPE_ICONS = {
  credit: {
    icon: ArrowDownLeft,
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  debit: {
    icon: ArrowUpRight,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  transfer: {
    icon: ArrowUpRight,
    bg: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  loan: {
    icon: FileCheck2,
    bg: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  support: {
    icon: HelpCircle,
    bg: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  security: {
    icon: ShieldAlert,
    bg: 'bg-rose-50 text-rose-600 border-rose-200',
  },
};

const NotificationsPage = () => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
  } = useBankData();

  const [filter, setFilter] = useState('all'); // 'all', 'unread'

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Notifications & Alerts</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time updates regarding transaction credits, loans, and account security
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadNotificationCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-blue-600 border border-slate-200 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            filter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Unread</span>
          {unreadNotificationCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {unreadNotificationCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((n) => {
            const config = TYPE_ICONS[n.type] || TYPE_ICONS.security;
            const Icon = config.icon;

            return (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  !n.isRead
                    ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${config.bg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{n.title}</h3>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(n.date, true)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => clearNotification(n.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                    title="Remove notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No notifications</h3>
          <p className="text-xs text-slate-400 mt-1">
            {filter === 'unread'
              ? 'You have caught up with all your unread alerts.'
              : 'You have no notifications at this time.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
