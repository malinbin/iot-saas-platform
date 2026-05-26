import { MobileLayout } from '@/components/user/mobile-layout';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileLayout>{children}</MobileLayout>;
}
