'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Building2,
  Users,
  Activity,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type LoginType = 'admin' | 'vendor' | 'user';

// 粒子组件
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.fill();

        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
    />
  );
}

// 流动渐变组件
function FlowingGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/30 via-cyan-300/20 to-blue-500/30 animate-pulse" />
      <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-r from-blue-500/20 to-transparent rounded-full blur-3xl animate-[spin_20s_linear_infinite]" />
      <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-l from-cyan-500/20 to-transparent rounded-full blur-3xl animate-[spin_25s_linear_infinite_reverse]" />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loginType, setLoginType] = useState<LoginType>('vendor');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const loginTypes = [
    {
      type: 'admin' as const,
      title: '总管理后台',
      desc: '平台管理员登录',
      icon: Shield,
      gradient: 'from-slate-700 to-slate-900',
    },
    {
      type: 'vendor' as const,
      title: '厂家后台',
      desc: '设备厂家登录',
      icon: Building2,
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      type: 'user' as const,
      title: '用户端',
      desc: '终端用户登录',
      icon: Users,
      gradient: 'from-cyan-500 to-teal-500',
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginType === 'admin') {
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
    <div className="min-h-screen flex relative overflow-hidden bg-white">
      {/* 背景效果 */}
      <ParticleField />
      <FlowingGradient />

      {/* 鼠标跟随光晕 */}
      <div
        className="fixed w-96 h-96 pointer-events-none z-0 transition-all duration-300 ease-out"
        style={{
          left: mousePos.x - 192,
          top: mousePos.y - 192,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwIDEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-xl blur-lg group-hover:blur-xl transition-all" />
              <div className="relative bg-white/20 backdrop-blur-sm rounded-xl p-2.5 border border-white/30">
                <Activity className="h-7 w-7 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold text-white">智联物联网</span>
          </Link>
        </div>

        <div className="relative z-10 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            工业物联网 SaaS 平台
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            智联万物
            <br />
            <span className="text-cyan-200">赋能工业</span>
          </h1>
          <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-md">
            为设备厂家和终端用户提供一站式设备监控、远程运维、数据分析解决方案
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { value: '500+', label: '接入设备', icon: Cpu },
              { value: '50+', label: '服务厂家', icon: Building2 },
              { value: '1000+', label: '终端用户', icon: Users },
              { value: '99.9%', label: '系统稳定性', icon: Activity },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
              >
                <stat.icon className="h-6 w-6 text-cyan-300 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/60">
          © 2024 智联物联网. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 relative z-10">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-50" />
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-2.5">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                智联物联网
              </span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">欢迎登录</h2>
            <p className="mt-2 text-slate-600">选择登录类型并输入账号信息</p>
          </div>

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
                className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                  loginType === item.type
                    ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                    : 'border-blue-100 hover:border-blue-300 bg-white'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm font-medium text-slate-700">{item.title}</div>
                {loginType === item.type && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {getInputLabel()}
              </label>
              <input
                type={loginType === 'user' ? 'tel' : 'text'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                placeholder={getInputPlaceholder()}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3.5 pr-12 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="请输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden rounded-xl group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:from-blue-600 group-hover:to-cyan-600 transition-all" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              <span className="relative py-4 text-white font-semibold flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    登录中...
                  </>
                ) : (
                  <>
                    登录
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 text-center text-sm text-slate-500">
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
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors group"
            >
              <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
