import Link from 'next/link';
import {
  Shield,
  Building2,
  Users,
  ArrowRight,
  Activity,
  Zap,
  Box,
} from 'lucide-react';

export default function HomePage() {
  const systems = [
    {
      title: '超级总管理后台',
      description:
        '平台最高权限管理端，负责全局数据监控、厂家审核、用户管理等核心功能',
      icon: Shield,
      href: '/admin',
      color: 'from-[#0A1628] to-[#1E3A5F]',
      features: ['数据大盘', '厂家审核', '用户管理', '系统设置'],
      gradient: 'group-hover:from-[#0A1628] group-hover:to-[#2563EB]',
    },
    {
      title: '商家/设备厂家后台',
      description:
        '设备厂家管理端，管理旗下设备、客户数据，支持远程运维和实时监控',
      icon: Building2,
      href: '/vendor',
      color: 'from-[#2563EB] to-[#3B82F6]',
      features: ['设备管理', '远程运维', '客户管理', '数据分析'],
      gradient: 'group-hover:from-[#2563EB] group-hover:to-[#60A5FA]',
    },
    {
      title: '终端用户后台',
      description:
        '终端客户使用端，简洁展示生产数据、设备状态，以数据可视化为主',
      icon: Users,
      href: '/user',
      color: 'from-[#0EA5E9] to-[#38BDF8]',
      features: ['生产概览', '设备监控', '故障报警', '生产报表'],
      gradient: 'group-hover:from-[#0EA5E9] group-hover:to-[#7DD3FC]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#334155] bg-[#1E293B]/50 px-4 py-2 text-sm text-[#94A3B8]">
              <Activity className="h-4 w-4 text-[#22C55E]" />
              工业物联网 SaaS 平台
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              三端独立管理平台
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#94A3B8] max-w-2xl mx-auto">
              超级管理端、商家端、用户端三套独立系统，权限隔离、数据独立，
              <br />
              为不同角色提供定制化的管理体验
            </p>
          </div>

          {/* System Cards */}
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {systems.map((system) => (
              <Link
                key={system.href}
                href={system.href}
                className="group relative rounded-2xl border border-[#334155] bg-[#1E293B]/50 p-8 transition-all duration-300 hover:border-[#475569] hover:bg-[#1E293B]"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${system.color} opacity-10 transition-opacity group-hover:opacity-20`}
                />

                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div
                    className={`inline-flex rounded-xl bg-gradient-to-br ${system.color} p-3 text-white shadow-lg`}
                  >
                    <system.icon className="h-6 w-6" />
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 text-xl font-semibold text-white group-hover:text-[#F1F5F9]">
                    {system.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
                    {system.description}
                  </p>

                  {/* Features */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {system.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-[#334155] bg-[#0F172A] px-3 py-1 text-xs text-[#94A3B8]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Arrow */}
                  <div className="mt-6 flex items-center text-sm font-medium text-[#3B82F6] group-hover:text-[#60A5FA]">
                    进入系统
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">核心特性</h2>
          <p className="mt-2 text-[#94A3B8]">统一的工业物联网管理平台</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Shield,
              title: '权限隔离',
              desc: '三端独立权限体系',
            },
            {
              icon: Activity,
              title: '实时监控',
              desc: '设备状态实时更新',
            },
            {
              icon: Zap,
              title: '远程运维',
              desc: '支持远程设备控制',
            },
            {
              icon: Box,
              title: '数据可视化',
              desc: '丰富的图表展示',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[#334155] bg-[#1E293B]/30 p-6"
            >
              <item.icon className="h-8 w-8 text-[#3B82F6]" />
              <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-[#94A3B8]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#334155] py-8">
        <div className="text-center text-sm text-[#64748B]">
          工业物联网 SaaS 平台 · 三端独立管理系统
        </div>
      </div>
    </div>
  );
}
