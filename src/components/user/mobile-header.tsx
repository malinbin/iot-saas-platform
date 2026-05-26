'use client';

import Link from 'next/link';
import { Bell, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function MobileHeader({ title, showBack, rightAction }: MobileHeaderProps) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 获取未读通知数量
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/user/notifications/unread-count');
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('获取未读通知失败:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-gray-200 bg-white safe-area-pt">
      <div className="flex h-full items-center justify-between px-4">
        {/* 左侧 */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button 
              onClick={() => router.back()}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <Link href="/user/notifications" className="relative p-2 -ml-2 text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* 中间标题 */}
        <h1 className="text-base font-semibold text-gray-900">
          {title || '生产监控'}
        </h1>

        {/* 右侧 */}
        <div className="flex items-center gap-2">
          {rightAction || <div className="w-9" />}
        </div>
      </div>
    </header>
  );
}
