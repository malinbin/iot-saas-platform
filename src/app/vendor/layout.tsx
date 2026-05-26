'use client';

import { useState } from 'react';
import { VendorSidebar } from '@/components/vendor/sidebar';
import { VendorHeader } from '@/components/vendor/header';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <VendorSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        <VendorHeader />
        <main className="min-h-[calc(100vh-56px)] p-6">{children}</main>
      </div>
    </div>
  );
}
