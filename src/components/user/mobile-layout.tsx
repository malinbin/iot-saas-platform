'use client';

import { MobileNav } from './mobile-nav';

export function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 主内容区 */}
      <main className="pb-20 pt-14">
        {children}
      </main>
      
      {/* 底部导航 */}
      <MobileNav />
    </div>
  );
}
