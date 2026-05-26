"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Building2,
    Users,
    Settings,
    AlertTriangle,
    FileText,
    BarChart3,
    Cog,
    ChevronRight,
    LayoutTemplate,
} from "lucide-react";

import { cn } from "@/lib/utils";

const menuItems = [{
    icon: LayoutDashboard,
    label: "数据大盘",
    href: "/admin"
}, {
    icon: Building2,
    label: "厂家管理",
    href: "/admin/vendors"
}, {
    icon: Users,
    label: "用户管理",
    href: "/admin/users"
}, {
    icon: LayoutTemplate,
    label: "设备模板",
    href: "/admin/templates"
}, {
    icon: Cog,
    label: "设备管理",
    href: "/admin/devices"
}, {
    icon: AlertTriangle,
    label: "告警中心",
    href: "/admin/alerts"
}, {
    icon: BarChart3,
    label: "数据分析",
    href: "/admin/analytics"
}, {
    icon: FileText,
    label: "操作日志",
    href: "/admin/logs"
}, {
    icon: Settings,
    label: "系统设置",
    href: "/admin/settings"
}];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside
            className="fixed left-0 top-0 z-40 h-screen w-[280px] bg-[#0A1628] border-r border-[#1E3A5F]">
            {}
            <div className="flex h-16 items-center gap-3 border-b border-[#1E3A5F] px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#2563EB]">
                    <svg
                        className="h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div>
                    <div className="text-sm font-semibold text-white">工业物联网</div>
                    <div className="text-xs text-[#64748B]">超级管理平台</div>
                </div>
            </div>
            {}
            <nav className="flex flex-col gap-1 p-4">
                <div
                    className="mb-4 text-xs font-medium uppercase tracking-wider text-[#64748B]">主导航
                            </div>
                {menuItems.map(item => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                                isActive ? "bg-[#1E3A5F] text-white" : "text-[#94A3B8] hover:bg-[#1E3A5F]/50 hover:text-white"
                            )}
                            style={{
                                borderRadius: "28px"
                            }}>
                            <item.icon
                                className={cn(
                                    "h-5 w-5 transition-colors",
                                    isActive ? "text-[#2563EB]" : "text-[#64748B] group-hover:text-[#2563EB]"
                                )} />
                            <span>{item.label}</span>
                            {isActive && <ChevronRight className="ml-auto h-4 w-4 text-[#2563EB]" />}
                        </Link>
                    );
                })}
            </nav>
            {}
            <div
                className="absolute bottom-0 left-0 right-0 border-t border-[#1E3A5F] p-4">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
                    <div className="text-xs text-[#94A3B8]">系统运行正常</div>
                </div>
                <div className="mt-2 text-xs text-[#64748B]">数据更新于 {new Date().toLocaleTimeString()}
                </div>
            </div>
        </aside>
    );
}