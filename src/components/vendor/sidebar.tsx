'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Box,
  Users,
  Settings,
  AlertTriangle,
  Activity,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const menuItems = [
  { icon: LayoutDashboard, label: '数据概览', href: '/vendor' },
  { icon: Box, label: '设备管理', href: '/vendor/devices' },
  { icon: Activity, label: '远程运维', href: '/vendor/monitor' },
  { icon: Users, label: '客户管理', href: '/vendor/customers' },
  { icon: AlertTriangle, label: '告警中心', href: '/vendor/alerts' },
  { icon: Zap, label: '数据分析', href: '/vendor/analytics' },
  { icon: Settings, label: '系统设置', href: '/vendor/settings' },
];

interface VendorSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function VendorSidebar({ collapsed, onToggle }: VendorSidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r border-[#E2E8F0] bg-white transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#E2E8F0] px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1E293B]">
                  智联科技
                </div>
                <div className="text-xs text-[#64748B]">商家管理平台</div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#2563EB]"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-[#2563EB] text-white'
                        : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#2563EB]'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-5 w-5 flex-shrink-0',
                        isActive ? 'text-white' : 'text-[#64748B]'
                      )}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="bg-[#1E293B]">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom */}
        {!collapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] p-3">
              <div className="text-xs font-medium text-[#64748B]">
                需要帮助？
              </div>
              <div className="mt-1 text-xs text-[#94A3B8]">
                联系平台客服
              </div>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
