'use client';

import {
  Bell,
  Search,
  User,
  ChevronDown,
  RefreshCw,
  Fullscreen,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#1E3A5F] bg-[#0A1628]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0A1628]/60">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: Search */}
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <Input
              placeholder="搜索设备、厂家、用户..."
              className="h-10 w-full border-[#1E3A5F] bg-[#1E3A5F]/50 pl-10 text-white placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="icon"
            className="text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
          >
            <Fullscreen className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#EF4444] p-0 text-xs">
                  5
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 border-[#1E3A5F] bg-[#0A1628] text-white"
            >
              <DropdownMenuLabel>通知中心</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#1E3A5F]" />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 focus:bg-[#1E3A5F]">
                <div className="text-sm font-medium">设备故障告警</div>
                <div className="text-xs text-[#64748B]">
                  设备-0012 发生故障，需要立即处理
                </div>
                <div className="text-xs text-[#64748B]">2 分钟前</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 focus:bg-[#1E3A5F]">
                <div className="text-sm font-medium">新厂家入驻申请</div>
                <div className="text-xs text-[#64748B]">
                  智能制造公司提交了入驻申请
                </div>
                <div className="text-xs text-[#64748B]">15 分钟前</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 focus:bg-[#1E3A5F]">
                <div className="text-sm font-medium">系统升级完成</div>
                <div className="text-xs text-[#64748B]">
                  v2.5.0 版本已成功部署
                </div>
                <div className="text-xs text-[#64748B]">1 小时前</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
              >
                <Avatar className="h-8 w-8 border-2 border-[#2563EB]">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-[#2563EB] text-white text-sm">
                    SA
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <div className="text-sm font-medium text-white">
                    超级管理员
                  </div>
                  <div className="text-xs text-[#64748B]">
                    admin@iiot.com
                  </div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-[#1E3A5F] bg-[#0A1628] text-white"
            >
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#1E3A5F]" />
              <DropdownMenuItem className="focus:bg-[#1E3A5F]">
                <User className="mr-2 h-4 w-4" />
                个人中心
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-[#1E3A5F]">
                <Settings className="mr-2 h-4 w-4" />
                系统设置
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#1E3A5F]" />
              <DropdownMenuItem className="text-[#EF4444] focus:bg-[#1E3A5F]">
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
