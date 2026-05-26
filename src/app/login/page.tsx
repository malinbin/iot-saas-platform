'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  Building2, 
  Users,
  Activity,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type LoginType = 'admin' | 'vendor' | 'user';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loginType, setLoginType] = useState<LoginType>('vendor');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginTypes = [
    {
      type: 'admin' as const,
      title: '总管理后台',
      desc: '平台管理员登录',
      icon: Shield,
      color: 'bg-slate-900',
    },
    {
      type: 'vendor' as const,
      title: '厂家后台',
      desc: '设备厂家登录',
      icon: Building2,
      color: 'bg-blue-600',
    },
    {
      type: 'user' as const,
      title: '用户端',
      desc: '终端用户登录',
      icon: Users,
      color: 'bg-cyan-500',
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginType === 'admin') {
        // 总管理后台登录
        const response = await fetch('/api/admin/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: code, password }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('adminInfo', JSON.stringify(data.admin));
          localStorage.setItem('adminLoggedIn', 'true');
          toast({
            title: '登录成功',
            description: `欢迎回来，${data.admin.name}`,
          });
          window.location.href = '/admin';
        } else {
          setError(data.error || '登录失败');
          toast({
            title: '登录失败',
            description: data.error || '用户名或密码错误',
          });
        }
      } else if (loginType === 'vendor') {
        // 厂家后台登录
        const response = await fetch('/api/vendor/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, password }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('vendorInfo', JSON.stringify(data.vendor));
          localStorage.setItem('vendorLoggedIn', 'true');
          toast({
            title: '登录成功',
            description: `欢迎回来，${data.vendor.name}`,
          });
          window.location.href = '/vendor';
        } else {
          setError(data.error || '登录失败');
          toast({
            title: '登录失败',
            description: data.error || '厂家编码或密码错误',
          });
        }
      } else if (loginType === 'user') {
        // 用户端登录
        const response = await fetch('/api/user/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: code, password }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('userInfo', JSON.stringify(data.user));
          localStorage.setItem('userLoggedIn', 'true');
          toast({
            title: '登录成功',
            description: `欢迎回来，${data.user.name}`,
          });
          window.location.href = '/user';
        } else {
          setError(data.error || '登录失败');
          toast({
            title: '登录失败',
            description: data.error || '手机号或密码错误',
          });
        }
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      toast({
        title: '网络错误',
        description: '请检查网络连接后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  const getInputPlaceholder = () => {
    switch (loginType) {
      case 'admin':
        return '请输入管理员用户名';
      case 'vendor':
        return '请输入厂家编码';
      case 'user':
        return '请输入手机号';
    }
  };

  const getInputLabel = () => {
    switch (loginType) {
      case 'admin':
        return '用户名';
      case 'vendor':
        return '厂家编码';
      case 'user':
        return '手机号';
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="rounded-lg bg-white/20 p-2">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">智联物联网</span>
          </Link>
        </div>
        
        <div className="text-white">
          <h1 className="text-4xl font-bold">工业物联网管理平台</h1>
          <p className="mt-4 text-lg text-white/80">
            为设备厂家和终端用户提供一站式设备监控、远程运维、数据分析解决方案
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-white/10">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-white/70">接入设备</div>
            </div>
            <div className="p-4 rounded-lg bg-white/10">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-white/70">服务厂家</div>
            </div>
            <div className="p-4 rounded-lg bg-white/10">
              <div className="text-2xl font-bold">1000+</div>
              <div className="text-sm text-white/70">终端用户</div>
            </div>
            <div className="p-4 rounded-lg bg-white/10">
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-white/70">系统稳定性</div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-white/60">
          © 2024 智联物联网. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="rounded-lg bg-primary p-2">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">智联物联网</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">欢迎登录</h2>
          <p className="text-muted-foreground text-center mb-8">选择登录类型并输入账号信息</p>

          {/* Login Type Selection */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {loginTypes.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => {
                  setLoginType(item.type);
                  setError('');
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  loginType === item.type
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-md ${item.color} flex items-center justify-center mx-auto mb-2`}>
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm font-medium">{item.title}</div>
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {getInputLabel()}
              </label>
              <input
                type={loginType === 'user' ? 'tel' : 'text'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-md border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={getInputPlaceholder()}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border bg-background px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              {loginType === 'admin' && '管理员账号由系统初始化设置'}
              {loginType === 'vendor' && '厂家账号由总管理后台创建，如需帮助请联系平台客服'}
              {loginType === 'user' && '用户账号由厂家创建，如需帮助请联系所属厂家'}
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
