'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Building2,
  Users,
  ArrowRight,
  Activity,
  Zap,
  Box,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Cpu,
  Gauge,
  Settings,
  BarChart3,
  Bell,
  Wifi,
  Sparkles,
  Rocket,
  Database,
  Globe,
} from 'lucide-react';

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
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
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

        // 连接附近的粒子
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 120)})`;
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
      className="absolute inset-0 pointer-events-none opacity-40"
    />
  );
}

// 流动渐变组件
function FlowingGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-400/20 via-cyan-300/10 to-transparent rounded-full blur-3xl animate-[spin_20s_linear_infinite]" />
      <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-blue-500/15 via-sky-400/10 to-transparent rounded-full blur-3xl animate-[spin_25s_linear_infinite_reverse]" />
    </div>
  );
}

// 科技感网格背景
function TechGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #3b82f6 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

// 浮动光点
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/2 w-56 h-56 bg-sky-400/10 rounded-full blur-3xl animate-pulse delay-500" />
    </div>
  );
}

// 滚动动画hook
function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const scrollY = useScrollAnimation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const projects = [
    {
      title: '注塑机监控系统',
      description: '实时监控注塑机温度、压力、速度等关键参数，支持远程启停和参数调整',
      tags: ['温度监控', '压力检测', '远程控制'],
      icon: Gauge,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: '智能仓储管理',
      description: 'WMS系统集成IoT设备，实现库存自动盘点、货位智能分配、出入库追踪',
      tags: ['库存管理', '自动盘点', '智能分配'],
      icon: Box,
      color: 'from-cyan-500 to-teal-500',
    },
    {
      title: '能源管理平台',
      description: '电、水、气能耗实时监测，异常预警，节能分析和优化建议',
      tags: ['能耗监测', '节能分析', '异常预警'],
      icon: Zap,
      color: 'from-teal-500 to-blue-500',
    },
    {
      title: '设备预测维护',
      description: '基于设备运行数据，预测设备故障风险，提前安排维护，减少停机损失',
      tags: ['故障预测', '维护计划', '减少停机'],
      icon: Settings,
      color: 'from-blue-600 to-indigo-500',
    },
    {
      title: '生产线数据采集',
      description: '多品牌PLC、传感器数据统一采集，支持Modbus、OPC UA等多种协议',
      tags: ['数据采集', '多协议支持', 'PLC接入'],
      icon: Cpu,
      color: 'from-sky-500 to-blue-500',
    },
    {
      title: '质量追溯系统',
      description: '产品全生命周期追溯，从原料到成品全程数据记录，支持快速溯源',
      tags: ['全流程追溯', '质量管控', '快速溯源'],
      icon: BarChart3,
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  const stats = [
    { value: '500+', label: '接入设备', icon: Cpu },
    { value: '50+', label: '服务厂家', icon: Building2 },
    { value: '1000+', label: '终端用户', icon: Users },
    { value: '99.9%', label: '系统稳定性', icon: Activity },
  ];

  const features = [
    {
      icon: Shield,
      title: '三端权限隔离',
      desc: '超级管理端、厂家端、用户端独立权限体系，数据安全隔离',
      color: 'blue',
    },
    {
      icon: Activity,
      title: '实时数据监控',
      desc: '设备状态实时更新，毫秒级响应，支持大屏展示',
      color: 'cyan',
    },
    {
      icon: Wifi,
      title: 'DTU数据上报',
      desc: '支持MQTT/HTTP协议，设备数据自动上报和解析',
      color: 'teal',
    },
    {
      icon: Bell,
      title: '智能告警系统',
      desc: '多级告警规则，短信/邮件通知，自动升级机制',
      color: 'sky',
    },
    {
      icon: Settings,
      title: '设备模板DIY',
      desc: '可视化配置设备类型，自定义监控参数和界面布局',
      color: 'indigo',
    },
    {
      icon: BarChart3,
      title: '数据分析报表',
      desc: '丰富的图表组件，生产数据统计、趋势分析、对比报表',
      color: 'blue',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* 全局科技感背景 */}
      <ParticleField />
      <TechGrid />

      {/* 鼠标跟随光晕 */}
      <div
        className="fixed w-96 h-96 pointer-events-none z-0 transition-all duration-300 ease-out"
        style={{
          left: mousePos.x - 192,
          top: mousePos.y - 192,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-blue-100/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-2">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                智联物联网
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { href: '#about', label: '关于我们' },
                { href: '#projects', label: '项目案例' },
                { href: '#features', label: '功能特点' },
                { href: '#contact', label: '联系我们' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-slate-600 hover:text-blue-600 transition-colors group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Login Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="relative px-5 py-2 text-slate-600 hover:text-blue-600 font-medium transition-colors group"
              >
                登录
                <span className="absolute inset-0 border border-blue-200 rounded-lg group-hover:border-blue-400 transition-colors" />
              </Link>
              <Link
                href="/login"
                className="relative group overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:from-blue-600 group-hover:to-cyan-600 transition-all" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                <span className="relative px-5 py-2 text-white font-medium flex items-center gap-2">
                  免费试用
                  <Sparkles className="w-4 h-4" />
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-blue-100 bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              <Link href="#about" className="block py-2 text-slate-600">关于我们</Link>
              <Link href="#projects" className="block py-2 text-slate-600">项目案例</Link>
              <Link href="#features" className="block py-2 text-slate-600">功能特点</Link>
              <Link href="#contact" className="block py-2 text-slate-600">联系我们</Link>
              <div className="pt-3 border-t border-blue-100 space-y-2">
                <Link href="/login" className="block w-full text-center py-2 border border-blue-200 rounded-lg text-slate-600">登录</Link>
                <Link href="/login" className="block w-full text-center py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg">免费试用</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <FloatingOrbs />
        <FlowingGradient />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-2 text-sm text-blue-600 mb-8 group hover:border-blue-400 transition-colors cursor-default">
              <Activity className="h-4 w-4 animate-pulse" />
              <span>工业物联网 SaaS 平台</span>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-slate-900">智联万物</span>
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                  赋能工业
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-slate-600 max-w-2xl mx-auto">
              专业的工业物联网管理平台，为设备厂家和终端用户提供
              <span className="text-blue-600 font-medium">一站式设备监控</span>、
              <span className="text-cyan-600 font-medium">远程运维</span>、
              <span className="text-blue-600 font-medium">数据分析</span>解决方案
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/login"
                className="group relative overflow-hidden rounded-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <span className="relative inline-flex items-center gap-2 px-8 py-4 text-white font-semibold">
                  立即体验
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="#projects"
                className="group relative rounded-xl border-2 border-blue-200 hover:border-blue-400 px-8 py-4 font-semibold text-slate-700 hover:text-blue-600 transition-all"
              >
                <span className="flex items-center gap-2">
                  查看案例
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white/80 backdrop-blur-sm p-6 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <stat.icon className="h-8 w-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-blue-300 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-24 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-600">
                <Rocket className="h-4 w-4" />
                关于我们
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                专业工业物联网
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  解决方案
                </span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                我们专注于工业物联网领域，为制造业企业提供设备数字化、智能化解决方案。
                通过自主研发的IoT平台，实现设备互联互通、数据采集分析、远程运维监控，
                助力企业降本增效、转型升级。
              </p>
              <div className="space-y-4">
                {[
                  '自主研发IoT平台，支持多协议设备接入',
                  '三端独立管理，权限数据安全隔离',
                  '可视化设备配置，快速适配各类设备',
                  '7×24小时技术支持，专业团队保障',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-1.5 group-hover:scale-110 transition-transform">
                      <ChevronRight className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
              <div className="relative grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: '安全可靠', desc: '数据加密传输存储', color: 'blue' },
                  { icon: Activity, title: '实时监控', desc: '毫秒级数据响应', color: 'cyan' },
                  { icon: Settings, title: '灵活配置', desc: '可视化模板设计', color: 'teal' },
                  { icon: BarChart3, title: '数据分析', desc: '多维度数据洞察', color: 'sky' },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className={`inline-flex rounded-xl bg-gradient-to-r from-${item.color}-500 to-${item.color}-400 p-2.5 text-white mb-3 group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-sm text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-600 mb-4">
              <Database className="h-4 w-4" />
              项目案例
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              行业解决方案
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              已为多家制造企业提供数字化解决方案，助力企业智能化升级
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <div
                key={project.title}
                className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className={`aspect-[4/3] bg-gradient-to-br ${project.color} p-8 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                  <project.icon className="relative h-20 w-20 text-white/90 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>
                <div className="relative p-6">
                  <h3 className="font-semibold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-slate-600 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs text-blue-600 group-hover:bg-blue-100 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-600 mb-4">
              <Globe className="h-4 w-4" />
              平台功能
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              核心功能特性
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              三端独立管理系统，满足不同角色需求
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className={`inline-flex rounded-xl bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-400 p-2.5 text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-slate-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* System Cards */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-10">
              三端管理系统
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: '超级总管理后台',
                  desc: '平台最高权限，全局数据监控、厂家审核、系统设置',
                  href: '/admin',
                  icon: Shield,
                  gradient: 'from-slate-700 to-slate-900',
                },
                {
                  title: '厂家管理后台',
                  desc: '设备厂家管理端，设备管理、远程运维、客户管理',
                  href: '/vendor',
                  icon: Building2,
                  gradient: 'from-blue-500 to-blue-700',
                },
                {
                  title: '终端用户后台',
                  desc: '终端客户使用端，生产数据、设备状态、报警信息',
                  href: '/user',
                  icon: Users,
                  gradient: 'from-cyan-500 to-teal-500',
                },
              ].map((system) => (
                <Link
                  key={system.href}
                  href={system.href}
                  className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-8 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className={`inline-flex rounded-xl bg-gradient-to-r ${system.gradient} p-3 text-white mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                      <system.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                      {system.title}
                    </h3>
                    <p className="mt-2 text-slate-600">{system.desc}</p>
                    <div className="mt-6 inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      进入系统
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-600">
                <Phone className="h-4 w-4" />
                联系我们
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                获取专业咨询
              </h2>
              <p className="text-lg text-slate-600">
                如果您对我们的产品感兴趣，欢迎联系我们获取更多信息
              </p>
              <div className="space-y-6 mt-8">
                {[
                  { icon: Phone, label: '联系电话', value: '400-888-8888' },
                  { icon: Mail, label: '电子邮箱', value: 'contact@zhilian-iot.com' },
                  { icon: MapPin, label: '公司地址', value: '广东省深圳市南山区科技园' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 group">
                    <div className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-3 text-white group-hover:scale-110 transition-transform">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{item.label}</div>
                      <div className="text-slate-600">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-blue-100 bg-white p-8">
                <h3 className="font-semibold text-xl text-slate-900 mb-6">快速留言</h3>
                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">姓名</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="请输入姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">电话</label>
                    <input
                      type="tel"
                      className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="请输入电话"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">留言内容</label>
                    <textarea
                      className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] transition-all"
                      placeholder="请输入留言内容"
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full relative overflow-hidden rounded-xl group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:from-blue-600 group-hover:to-cyan-600 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                    <span className="relative py-4 text-white font-semibold flex items-center justify-center gap-2">
                      提交留言
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-100 py-16 bg-gradient-to-b from-white to-blue-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-2">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                </div>
                <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  智联物联网
                </span>
              </Link>
              <p className="text-sm text-slate-600">
                专业的工业物联网管理平台，为制造业企业提供数字化转型解决方案
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">产品服务</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">设备监控平台</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">远程运维系统</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">数据分析服务</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">设备模板定制</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">解决方案</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">注塑机监控</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">智能仓储</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">能源管理</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">质量追溯</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">关于我们</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">公司介绍</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">技术支持</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">隐私政策</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">服务条款</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-blue-100 text-center text-sm text-slate-500">
            © 2024 智联物联网. All rights reserved.
          </div>
        </div>
      </footer>

      {/* CSS for gradient animation */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
    </div>
  );
}
