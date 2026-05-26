'use client';

import { useEffect, useState } from 'react';
import { MobileHeader } from '@/components/user/mobile-header';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Box, 
  AlertTriangle,
  ChevronRight,
  Zap,
  Thermometer,
  Gauge
} from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface DeviceStats {
  total: number;
  online: number;
  fault: number;
  offline: number;
}

interface ProductionData {
  date: string;
  output: number;
  efficiency: number;
}

export default function UserDashboard() {
  const [stats, setStats] = useState<DeviceStats>({ total: 0, online: 0, fault: 0, offline: 0 });
  const [productionData, setProductionData] = useState<ProductionData[]>([]);
  const [realtimeData, setRealtimeData] = useState({
    output: 0,
    efficiency: 0,
    runtime: 0,
    temperature: 0,
    power: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchRealtimeData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 获取设备统计
      const statsRes = await fetch('/api/user/devices/stats');
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      // 获取生产数据
      const productionRes = await fetch('/api/user/production/trend');
      if (productionRes.ok) {
        const data = await productionRes.json();
        setProductionData(data);
      }

      setLoading(false);
    } catch (error) {
      console.error('获取数据失败:', error);
      setLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const res = await fetch('/api/user/production/realtime');
      if (res.ok) {
        const data = await res.json();
        setRealtimeData(data);
      }
    } catch (error) {
      console.error('获取实时数据失败:', error);
    }
  };

  const formatRuntime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MobileHeader title="生产概览" />
      
      <div className="px-4 py-4 space-y-4">
        {/* 实时数据卡片 */}
        <div className="bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <span className="font-medium">实时生产数据</span>
            </div>
            <span className="text-xs opacity-80">5秒前更新</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-80">当前产量</p>
              <p className="text-2xl font-bold mt-1">{realtimeData.output.toFixed(1)}</p>
              <p className="text-xs opacity-60 mt-0.5">件/小时</p>
            </div>
            <div>
              <p className="text-sm opacity-80">运行效率</p>
              <p className="text-2xl font-bold mt-1">{realtimeData.efficiency.toFixed(1)}%</p>
              <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-white rounded-full h-1.5" 
                  style={{ width: `${realtimeData.efficiency}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <Thermometer className="h-4 w-4 mx-auto mb-1 opacity-80" />
              <p className="text-lg font-semibold">{realtimeData.temperature.toFixed(1)}°</p>
              <p className="text-xs opacity-60">温度</p>
            </div>
            <div className="text-center">
              <Zap className="h-4 w-4 mx-auto mb-1 opacity-80" />
              <p className="text-lg font-semibold">{realtimeData.power.toFixed(0)}W</p>
              <p className="text-xs opacity-60">功率</p>
            </div>
            <div className="text-center">
              <Gauge className="h-4 w-4 mx-auto mb-1 opacity-80" />
              <p className="text-lg font-semibold">{formatRuntime(realtimeData.runtime)}</p>
              <p className="text-xs opacity-60">运行时长</p>
            </div>
          </div>
        </div>

        {/* 设备状态 */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">设备状态</h2>
            <Link 
              href="/user/devices" 
              className="text-sm text-[#0EA5E9] flex items-center gap-1"
            >
              查看全部 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-[#0EA5E9]">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">总设备</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">{stats.online}</p>
              <p className="text-xs text-gray-500 mt-1">在线</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <p className="text-2xl font-bold text-orange-500">{stats.fault}</p>
              <p className="text-xs text-gray-500 mt-1">故障</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-400">{stats.offline}</p>
              <p className="text-xs text-gray-500 mt-1">离线</p>
            </div>
          </div>
        </div>

        {/* 产量趋势 */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">产量趋势</h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
                <span className="text-gray-500">产量</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-500">效率</span>
              </div>
            </div>
          </div>
          
          <div className="h-40">
            {productionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productionData}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  />
                  <YAxis hide />
                  <Area 
                    type="monotone" 
                    dataKey="output" 
                    stroke="#0EA5E9" 
                    fill="#0EA5E9" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#22C55E" 
                    fill="#22C55E" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                暂无数据
              </div>
            )}
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="/user/devices"
            className="bg-white rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Box className="h-5 w-5 text-[#0EA5E9]" />
            </div>
            <div>
              <p className="font-medium text-gray-900">设备监控</p>
              <p className="text-xs text-gray-500">查看设备详情</p>
            </div>
          </Link>
          
          <Link 
            href="/user/alerts"
            className="bg-white rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">故障报警</p>
              <p className="text-xs text-gray-500">{stats.fault} 条待处理</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
