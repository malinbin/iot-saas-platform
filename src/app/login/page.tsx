'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Phone, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    name: '',
    code: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        // 登录
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
        
        // 根据角色跳转
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
      } else {
        // 注册
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || '注册失败');
        }

        // 注册成功后切换到登录
        setMode('login');
        setError('注册成功，请登录');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
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
            <h1 className="text-xl font-bold text-gray-900">
              {mode === 'login' ? '欢迎回来' : '注册账号'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'login' ? '登录您的账号继续使用' : '创建新账号开始使用'}
            </p>
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

            {/* 注册时的姓名 */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  姓名
                </label>
                <input
                  type="text"
                  placeholder="请输入姓名"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>
            )}

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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className={`text-sm ${error.includes('成功') ? 'text-green-600' : 'text-red-500'} text-center`}>
                {error}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0EA5E9] text-white rounded-xl font-medium hover:bg-[#0EA5E9]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>处理中...</span>
                </>
              ) : (
                <span>{mode === 'login' ? '登 录' : '注 册'}</span>
              )}
            </button>
          </form>

          {/* 切换登录/注册 */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <>
                还没有账号？{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-[#0EA5E9] font-medium"
                >
                  立即注册
                </button>
              </>
            ) : (
              <>
                已有账号？{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-[#0EA5E9] font-medium"
                >
                  立即登录
                </button>
              </>
            )}
          </div>
        </div>

        {/* 其他登录方式 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 mb-4">其他登录方式</p>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.206 3.002 5.516l-.592 2.486a.333.333 0 00.479.362l2.901-1.684c.878.24 1.818.368 2.901.368 4.8 0 8.691-3.288 8.691-7.342 0-4.054-3.891-7.048-8.691-7.048z" />
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 底部 */}
      <div className="py-6 text-center">
        <p className="text-xs text-gray-400">
          登录即表示同意
          <a href="#" className="text-gray-600 underline mx-1">用户协议</a>
          和
          <a href="#" className="text-gray-600 underline mx-1">隐私政策</a>
        </p>
      </div>
    </div>
  );
}
