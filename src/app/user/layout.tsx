import { UserSidebar } from '@/components/user/sidebar';
import { UserHeader } from '@/components/user/header';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      <UserSidebar />
      <div className="ml-64">
        <UserHeader />
        <main className="min-h-[calc(100vh-56px)] p-6">{children}</main>
      </div>
    </div>
  );
}
