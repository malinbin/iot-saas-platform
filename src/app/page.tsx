'use client';

import Link from 'next/link';
import { useState } from 'react';
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
} from 'lucide-react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const projects = [
    {
      title: '注塑机监控系统',
      description: '实时监控注塑机温度、压力、速度等关键参数，支持远程启停和参数调整',
      image: '/project-injection.jpg',
      tags: ['温度监控', '压力检测', '远程控制'],
      icon: Gauge,
    },
    {
      title: '智能仓储管理',
      description: 'WMS系统集成IoT设备，实现库存自动盘点、货位智能分配、出入库追踪',
      image: '/project-warehouse.jpg',
      tags: ['库存管理', '自动盘点', '智能分配'],
      icon: Box,
    },
    {
      title: '能源管理平台',
      description: '电、水、气能耗实时监测，异常预警，节能分析和优化建议',
      image: '/project-energy.jpg',
      tags: ['能耗监测', '节能分析', '异常预警'],
      icon: Zap,
    },
    {
      title: '设备预测维护',
      description: '基于设备运行数据，预测设备故障风险，提前安排维护，减少停机损失',
      image: '/project-maintenance.jpg',
      tags: ['故障预测', '维护计划', '减少停机'],
      icon: Settings,
    },
    {
      title: '生产线数据采集',
      description: '多品牌PLC、传感器数据统一采集，支持Modbus、OPC UA等多种协议',
      image: '/project-collection.jpg',
      tags: ['数据采集', '多协议支持', 'PLC接入'],
      icon: Cpu,
    },
    {
      title: '质量追溯系统',
      description: '产品全生命周期追溯，从原料到成品全程数据记录，支持快速溯源',
      image: '/project-quality.jpg',
      tags: ['全流程追溯', '质量管控', '快速溯源'],
      icon: BarChart3,
    },
  ];

  const stats = [
    { value: '500+', label: '接入设备' },
    { value: '50+', label: '服务厂家' },
    { value: '1000+', label: '终端用户' },
    { value: '99.9%', label: '系统稳定性' },
  ];

  const features = [
    {
      icon: Shield,
      title: '三端权限隔离',
      desc: '超级管理端、厂家端、用户端独立权限体系，数据安全隔离',
    },
    {
      icon: Activity,
      title: '实时数据监控',
      desc: '设备状态实时更新，毫秒级响应，支持大屏展示',
    },
    {
      icon: Wifi,
      title: 'DTU数据上报',
      desc: '支持MQTT/HTTP协议，设备数据自动上报和解析',
    },
    {
      icon: Bell,
      title: '智能告警系统',
      desc: '多级告警规则，短信/邮件通知，自动升级机制',
    },
    {
      icon: Settings,
      title: '设备模板DIY',
      desc: '可视化配置设备类型，自定义监控参数和界面布局',
    },
    {
      icon: BarChart3,
      title: '数据分析报表',
      desc: '丰富的图表组件，生产数据统计、趋势分析、对比报表',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-2">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">智联物联网</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                关于我们
              </Link>
              <Link href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">
                项目案例
              </Link>
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                功能特点
              </Link>
              <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                联系我们
              </Link>
            </div>

            {/* Login Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                登录
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                免费试用
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-4 py-4 space-y-3">
              <Link href="#about" className="block py-2 text-muted-foreground">关于我们</Link>
              <Link href="#projects" className="block py-2 text-muted-foreground">项目案例</Link>
              <Link href="#features" className="block py-2 text-muted-foreground">功能特点</Link>
              <Link href="#contact" className="block py-2 text-muted-foreground">联系我们</Link>
              <div className="pt-3 border-t space-y-2">
                <Link href="/login" className="block w-full text-center py-2 border rounded-md">登录</Link>
                <Link href="/login" className="block w-full text-center py-2 bg-primary text-primary-foreground rounded-md">免费试用</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-30" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground mb-6">
              <Activity className="h-4 w-4 text-primary" />
              工业物联网 SaaS 平台
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-foreground">智联万物</span>
              <br />
              <span className="text-primary">赋能工业</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              专业的工业物联网管理平台，为设备厂家和终端用户提供一站式设备监控、
              远程运维、数据分析解决方案
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                立即体验
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg border bg-card px-6 py-3 text-sm font-semibold hover:bg-accent transition-colors"
              >
                查看案例
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-card border">
                <div className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                关于智联物联网
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                我们专注于工业物联网领域，为制造业企业提供设备数字化、智能化解决方案。
                通过自主研发的IoT平台，实现设备互联互通、数据采集分析、远程运维监控，
                助力企业降本增效、转型升级。
              </p>
              <div className="mt-8 space-y-4">
                {[
                  '自主研发IoT平台，支持多协议设备接入',
                  '三端独立管理，权限数据安全隔离',
                  '可视化设备配置，快速适配各类设备',
                  '7×24小时技术支持，专业团队保障',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-primary/10 p-1">
                      <ChevronRight className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl bg-card border p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
              <div className="relative grid grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-background border">
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <div className="font-semibold">安全可靠</div>
                  <div className="text-sm text-muted-foreground">数据加密传输存储</div>
                </div>
                <div className="p-4 rounded-xl bg-background border">
                  <Activity className="h-8 w-8 text-primary mb-2" />
                  <div className="font-semibold">实时监控</div>
                  <div className="text-sm text-muted-foreground">毫秒级数据响应</div>
                </div>
                <div className="p-4 rounded-xl bg-background border">
                  <Settings className="h-8 w-8 text-primary mb-2" />
                  <div className="font-semibold">灵活配置</div>
                  <div className="text-sm text-muted-foreground">可视化模板设计</div>
                </div>
                <div className="p-4 rounded-xl bg-background border">
                  <BarChart3 className="h-8 w-8 text-primary mb-2" />
                  <div className="font-semibold">数据分析</div>
                  <div className="text-sm text-muted-foreground">多维度数据洞察</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">项目案例</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              已为多家制造企业提供数字化解决方案，助力企业智能化升级
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.title}
                className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <project.icon className="h-16 w-16 text-primary/50 group-hover:text-primary transition-colors" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
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
      <section id="features" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">平台功能</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              三端独立管理系统，满足不同角色需求
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* System Cards */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              {
                title: '超级总管理后台',
                desc: '平台最高权限，全局数据监控、厂家审核、系统设置',
                href: '/admin',
                icon: Shield,
                color: 'bg-slate-900',
              },
              {
                title: '厂家管理后台',
                desc: '设备厂家管理端，设备管理、远程运维、客户管理',
                href: '/vendor',
                icon: Building2,
                color: 'bg-blue-600',
              },
              {
                title: '终端用户后台',
                desc: '终端客户使用端，生产数据、设备状态、报警信息',
                href: '/user',
                icon: Users,
                color: 'bg-cyan-500',
              },
            ].map((system) => (
              <Link
                key={system.href}
                href={system.href}
                className="group rounded-xl border bg-card p-6 hover:shadow-lg transition-all"
              >
                <div className={`inline-flex rounded-lg ${system.color} p-2 text-white mb-4`}>
                  <system.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {system.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{system.desc}</p>
                <div className="mt-4 flex items-center text-sm text-primary">
                  进入系统 <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">联系我们</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                如果您对我们的产品感兴趣，欢迎联系我们获取更多信息
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">联系电话</div>
                    <div className="text-muted-foreground">400-888-8888</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">电子邮箱</div>
                    <div className="text-muted-foreground">contact@zhiilian-iot.com</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">公司地址</div>
                    <div className="text-muted-foreground">广东省深圳市南山区科技园</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold text-lg mb-4">快速留言</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">姓名</label>
                  <input
                    type="text"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">电话</label>
                  <input
                    type="tel"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="请输入电话"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">留言内容</label>
                  <textarea
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                    placeholder="请输入留言内容"
                  />
                </div>
                <button
                  type="button"
                  className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  提交留言
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="rounded-lg bg-primary p-2">
                  <Activity className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">智联物联网</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                专业的工业物联网管理平台，为制造业企业提供数字化转型解决方案
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">产品服务</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">设备监控系统</Link></li>
                <li><Link href="#" className="hover:text-foreground">远程运维平台</Link></li>
                <li><Link href="#" className="hover:text-foreground">数据分析服务</Link></li>
                <li><Link href="#" className="hover:text-foreground">定制开发</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">解决方案</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">注塑机监控</Link></li>
                <li><Link href="#" className="hover:text-foreground">智能仓储</Link></li>
                <li><Link href="#" className="hover:text-foreground">能源管理</Link></li>
                <li><Link href="#" className="hover:text-foreground">预测维护</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">关于我们</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">公司介绍</Link></li>
                <li><Link href="#" className="hover:text-foreground">技术博客</Link></li>
                <li><Link href="#" className="hover:text-foreground">联系我们</Link></li>
                <li><Link href="#" className="hover:text-foreground">加入我们</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 智联物联网. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
