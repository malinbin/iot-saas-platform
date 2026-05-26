import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A1628]">
      <AdminSidebar />
      <div className="ml-[280px]">
        <AdminHeader />
        <main className="min-h-[calc(100vh-64px)] bg-[#0A1628] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
