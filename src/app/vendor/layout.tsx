'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { VendorAuthProvider, useVendorAuth } from '@/contexts/vendor-auth';
import { VendorSidebar } from '@/components/vendor/sidebar';
import { VendorHeader } from '@/components/vendor/header';

function VendorLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, isLoggedIn } = useVendorAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 登录页面不需要认证检查
  const isLoginPage = pathname === '/vendor/login';

  useEffect(() => {
    // 非登录页面且未登录时，跳转到登录页
    if (!isLoginPage && !loading && !isLoggedIn) {
      router.push('/vendor/login');
    }
  }, [isLoginPage, loading, isLoggedIn, router]);

  // 登录页面直接显示内容
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="text-[#64748B]">加载中...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <VendorSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className={sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}>
        <VendorHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <VendorAuthProvider>
      <VendorLayoutContent>{children}</VendorLayoutContent>
    </VendorAuthProvider>
  );
}
