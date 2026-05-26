'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChartComponent } from '@/components/charts/pie-chart';
import { BarChartComponent } from '@/components/charts/bar-chart';
import { 
  Activity, 
  Building2,
  Box,
  ArrowUp,
  ArrowDown,
  Users,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

interface AnalyticsData {
  totalVendors: number;
  activeVendors: number;
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  faultDevices: number;
  totalUsers: number;
  activeAlerts: number;
  deviceOnlineRate: number;
  vendorActiveRate: number;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (error) {
      console.error('获取分析数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#94A3B8]">加载中...</div>
      </div>
    );
  }

  const deviceStatusData = [
    { name: '在线', value: data?.onlineDevices || 0, color: '#22C55E' },
    { name: '离线', value: data?.offlineDevices || 0, color: '#F97316' },
    { name: '故障', value: data?.faultDevices || 0, color: '#EF4444' },
  ];

  const vendorStatusData = [
    { name: '活跃厂家', value: data?.activeVendors || 0, color: '#2563EB' },
    { name: '非活跃厂家', value: (data?.totalVendors || 0) - (data?.activeVendors || 0), color: '#64748B' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">数据分析</h1>
        <p className="text-sm text-[#94A3B8]">平台整体运营数据分析</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">活跃厂家</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-[#2563EB]">{data?.activeVendors || 0}</div>
              <Building2 className="h-8 w-8 text-[#2563EB]/50" />
            </div>
            <div className="mt-1 text-xs text-[#64748B]">共 {data?.totalVendors || 0} 家厂家</div>
          </CardContent>
        </Card>

        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">设备总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{data?.totalDevices || 0}</div>
              <Box className="h-8 w-8 text-[#2563EB]/50" />
            </div>
            <div className="mt-1 text-xs text-[#64748B]">在线 {data?.onlineDevices || 0} 台</div>
          </CardContent>
        </Card>

        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">注册用户</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{data?.totalUsers || 0}</div>
              <Users className="h-8 w-8 text-[#2563EB]/50" />
            </div>
            <div className="mt-1 text-xs text-[#64748B]">终端用户数</div>
          </CardContent>
        </Card>

        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">活跃告警</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-[#F97316]">{data?.activeAlerts || 0}</div>
              <AlertTriangle className="h-8 w-8 text-[#F97316]/50" />
            </div>
            <div className="mt-1 text-xs text-[#64748B]">待处理告警</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 设备状态分布 */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Box className="h-5 w-5 text-[#2563EB]" />
              <CardTitle className="text-lg text-white">设备状态分布</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={deviceStatusData} height={250} />
          </CardContent>
        </Card>

        {/* 厂家状态 */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#2563EB]" />
              <CardTitle className="text-lg text-white">厂家状态</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={vendorStatusData} height={250} />
          </CardContent>
        </Card>

        {/* 运营指标 */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F] lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#2563EB]" />
              <CardTitle className="text-lg text-white">核心运营指标</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94A3B8]">设备在线率</span>
                  <span className="font-medium text-white">{(data?.deviceOnlineRate || 0).toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-[#0A1628]">
                  <div 
                    className="h-3 rounded-full bg-[#22C55E]" 
                    style={{ width: `${data?.deviceOnlineRate || 0}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94A3B8]">厂家活跃率</span>
                  <span className="font-medium text-white">{(data?.vendorActiveRate || 0).toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-[#0A1628]">
                  <div 
                    className="h-3 rounded-full bg-[#2563EB]" 
                    style={{ width: `${data?.vendorActiveRate || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
