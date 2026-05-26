'use client';

import { useEffect, useState } from 'react';
import { MobileHeader } from '@/components/user/mobile-header';
import { 
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/user/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('获取通知列表失败:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/user/notifications/${id}/read`, { method: 'POST' });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/user/notifications/read-all', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('标记全部已读失败:', error);
    }
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'alert':
        return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' };
      case 'system':
        return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' };
      default:
        return { icon: Bell, color: 'text-gray-500', bg: 'bg-gray-50' };
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MobileHeader 
        title="通知中心" 
        showBack 
        rightAction={
          unreadCount > 0 ? (
            <button 
              onClick={markAllAsRead}
              className="text-sm text-[#0EA5E9] font-medium"
            >
              全部已读
            </button>
          ) : null
        }
      />
      
      <div className="px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0EA5E9]" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">暂无通知</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const typeConfig = getTypeConfig(notification.type);
            const TypeIcon = typeConfig.icon;
            
            return (
              <div
                key={notification.id}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
                className={cn(
                  'bg-white rounded-2xl p-4 transition-all',
                  !notification.is_read && 'bg-blue-50/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg', typeConfig.bg)}>
                    <TypeIcon className={cn('h-5 w-5', typeConfig.color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!notification.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
                      )}
                      <h3 className={cn(
                        'font-semibold text-gray-900 truncate',
                        notification.is_read && 'font-normal text-gray-600'
                      )}>
                        {notification.title}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-500 line-clamp-2">{notification.message}</p>
                    
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(notification.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
