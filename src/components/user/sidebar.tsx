'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Box,
  AlertTriangle,
  FileText,
  Settings,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: '生产概览', href: '/user' },
  { icon: Box, label: '设备监控', href: '/user/devices' },
  { icon: AlertTriangle, label: '故障报警', href: '/user/alerts' },
  { icon: FileText, label: '生产报表', href: '/user/reports' },
  { icon: Settings, label: '个人设置', href: '/user/settings' },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[#E0F2FE] bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-[#E0F2FE] px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8]">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-[#0F172A]">生产监控</div>
          <div className="text-xs text-[#64748B]">终端用户平台</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-[#0EA5E9] text-white'
                  : 'text-[#64748B] hover:bg-[#F0F9FF] hover:text-[#0EA5E9]'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#E0F2FE] p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white font-medium">
            U
          </div>
          <div>
            <div className="text-sm font-medium text-[#0F172A]">用户</div>
            <div className="text-xs text-[#64748B]">user@example.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
