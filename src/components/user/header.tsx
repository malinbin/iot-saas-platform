'use client';

import { Bell, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserHeader() {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-[#E0F2FE] bg-white/80 backdrop-blur">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left */}
        <div className="text-sm text-[#64748B]">
          数据更新于 {new Date().toLocaleTimeString()}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#64748B] hover:bg-[#F0F9FF] hover:text-[#0EA5E9]"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-[#64748B] hover:bg-[#F0F9FF] hover:text-[#0EA5E9]"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[#64748B] hover:bg-[#F0F9FF] hover:text-[#0EA5E9]"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[#EF4444] p-0 text-[10px]">
                  2
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium">设备告警</div>
                  <div className="text-xs text-[#64748B]">
                    设备温度过高
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
