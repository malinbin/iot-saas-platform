'use client';

import { useEffect, useState } from 'react';
import { MobileHeader } from '@/components/user/mobile-header';
import { 
  User,
  Phone,
  Mail,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  Shield,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatar_url?: string;
  role: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // 从 localStorage 获取用户信息
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // 如果没有登录信息，显示默认信息
      setUser({
        name: '演示用户',
        phone: '13800138000',
        email: 'demo@example.com',
        role: 'user',
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = [
    {
      icon: Settings,
      label: '账号设置',
      href: '/user/settings',
    },
    {
      icon: Shield,
      label: '隐私与安全',
      href: '/user/settings/privacy',
    },
    {
      icon: HelpCircle,
      label: '帮助与反馈',
      href: '/user/help',
    },
    {
      icon: Info,
      label: '关于我们',
      href: '/user/about',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MobileHeader title="个人中心" />
      
      <div className="px-4 py-4 space-y-4">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Phone className="h-4 w-4" />
                <span>{user?.phone}</span>
              </div>
              {user?.email && (
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
            
            <Link href="/user/profile/edit">
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </Link>
          </div>
        </div>

        {/* 菜单列表 */}
        <div className="bg-white rounded-2xl overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <item.icon className="h-5 w-5 text-gray-400" />
              <span className="flex-1 text-gray-900">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </Link>
          ))}
        </div>

        {/* 版本信息 */}
        <div className="text-center text-xs text-gray-400 py-4">
          <p>版本 1.0.0</p>
          <p className="mt-1">© 2024 工业物联网平台</p>
        </div>

        {/* 退出登录 */}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-white text-red-500 rounded-2xl font-medium flex items-center justify-center gap-2"
        >
          <LogOut className="h-5 w-5" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  );
}
