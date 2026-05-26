'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Box,
  AlertTriangle,
  FileText,
  User,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: '概览', href: '/user' },
  { icon: Box, label: '设备', href: '/user/devices' },
  { icon: AlertTriangle, label: '告警', href: '/user/alerts' },
  { icon: FileText, label: '报表', href: '/user/reports' },
  { icon: User, label: '我的', href: '/user/profile' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/user' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors',
                isActive ? 'text-[#0EA5E9]' : 'text-gray-400'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'text-[#0EA5E9]')} />
              <span className={cn('text-xs', isActive && 'font-medium')}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
