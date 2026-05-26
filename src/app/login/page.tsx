'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Phone, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [remainingDays, setRemainingDays] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || '登录失败');
      }

      // 保存 token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // 显示剩余天数提示
      if (data.user.remaining_days && data.user.remaining_days <= 30) {
        setRemainingDays(data.user.remaining_days);
      }
      
      // 根据角色跳转
      setTimeout(() => {
        switch (data.user.role) {
          case 'admin':
            router.push('/admin');
            break;
          case 'vendor':
            router.push('/vendor');
            break;
          default:
            router.push('/user');
        }
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0EA5E9]/5 to-white flex flex-col">
      {/* 顶部装饰 */}
      <div className="h-32 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full" />
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full" />
          <div className="absolute bottom-5 left-1/2 w-24 h-24 bg-white rounded-full" />
        </div>
      </div>

      {/* 登录卡片 */}
      <div className="flex-1 px-6 -mt-16">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* 标题 */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">欢迎回来</h1>
            <p className="text-sm text-gray-500 mt-1">登录您的账号继续使用</p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 手机号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                手机号
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="请输入手机号"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 到期提示 */}
            {remainingDays !== null && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-600 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>账号将在 {remainingDays} 天后过期，请联系管理员续期</span>
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  登录中...
                </>
              ) : (
                '登 录'
              )}
            </button>
          </form>

          {/* 说明文字 */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>账号由管理员统一创建，不支持自主注册</p>
            <p className="mt-2">如有问题，请联系系统管理员</p>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>工业物联网 SaaS 平台</p>
        </div>
      </div>
    </div>
  );
}
