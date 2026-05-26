'use client';

import {
  Bell,
  User,
  ChevronDown,
  RefreshCw,
  Settings,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useVendorAuth } from '@/contexts/vendor-auth';

export function VendorHeader() {
  const router = useRouter();
  const { vendor, logout } = useVendorAuth();

  // 获取厂家名称首字母
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/vendor" className="text-[#64748B] hover:text-[#2563EB]">
                  首页
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[#CBD5E1]" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/vendor/devices" className="text-[#1E293B]">
                  设备管理
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#2563EB]"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#2563EB]"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[#EF4444] p-0 text-[10px]">
                  0
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>通知中心</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#64748B]">
                暂无新通知
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-[#F1F5F9]"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-[#2563EB] text-white text-xs">
                    {vendor ? getInitials(vendor.name) : 'XX'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-[#1E293B]">
                    {vendor?.name || '未登录'}
                  </div>
                  <div className="text-xs text-[#64748B]">
                    {vendor?.code || ''}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/vendor/profile')}>
                <User className="mr-2 h-4 w-4" />
                个人中心
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/vendor/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                系统设置
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#EF4444]" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
