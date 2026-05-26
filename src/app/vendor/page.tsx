'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Box,
  Users,
  TrendingUp,
  TrendingDown,
  Zap,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AreaChartComponent, PieChartComponent } from '@/components/charts';
import Link from 'next/link';

interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  faultDevices: number;
  warningDevices: number;
  offlineDevices: number;
  totalCustomers: number;
  monthlyNewDevices: number;
}

interface TrendData {
  date: string;
  value: number;
}

interface DeviceDistribution {
  name: string;
  value: number;
  color: string;
}

export default function VendorDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trendData, setTrendData] = useState<Record<string, string | number>[]>([]);
  const [deviceDistribution, setDeviceDistribution] = useState<DeviceDistribution[]>([]);
  const [vendor, setVendor] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/vendor/dashboard/stats');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data.stats);
        setTrendData(result.data.trendData);
        setDeviceDistribution(result.data.deviceDistribution);
        setVendor(result.data.vendor);
      }
    } catch (error) {
      console.error('Fetch dashboard data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // 自动刷新
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-10">
        <p className="text-[#64748B]">暂无数据</p>
        <Button onClick={handleRefresh} className="mt-4">
          刷新
        </Button>
      </div>
    );
  }

  const onlineRate = (stats?.totalDevices ?? 0) > 0 
    ? Math.round(((stats?.onlineDevices ?? 0) / stats.totalDevices) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">数据概览</h1>
          <p className="text-sm text-[#64748B]">
            欢迎回来{vendor?.name ? `，${vendor.name}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-[#E2E8F0]">
            导出报表
          </Button>
          <Button 
            className="bg-[#2563EB] hover:bg-[#2563EB]/90"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            刷新数据
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Devices */}
        <Card className="border-[#E2E8F0] bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">设备总数</div>
                <div className="text-3xl font-bold text-[#1E293B]">
                  {stats.totalDevices ?? 0}
                </div>
                <div className="mt-2 flex items-center text-xs text-[#22C55E]">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +{stats.monthlyNewDevices ?? 0} 台本月新增
                </div>
              </div>
              <div className="rounded-full bg-[#2563EB]/10 p-3">
                <Box className="h-6 w-6 text-[#2563EB]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Online Devices */}
        <Card className="border-[#E2E8F0] bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">在线设备</div>
                <div className="text-3xl font-bold text-[#22C55E]">
                  {stats.onlineDevices}
                </div>
                <div className="mt-2 text-xs text-[#64748B]">
                  在线率 {onlineRate}%
                </div>
              </div>
              <div className="rounded-full bg-[#22C55E]/10 p-3">
                <Activity className="h-6 w-6 text-[#22C55E]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fault Devices */}
        <Card className="border-[#E2E8F0] bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">故障设备</div>
                <div className="text-3xl font-bold text-[#EF4444]">
                  {stats.faultDevices}
                </div>
                <div className="mt-2 flex items-center text-xs text-[#EF4444]">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  需要及时处理
                </div>
              </div>
              <div className="rounded-full bg-[#EF4444]/10 p-3">
                <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card className="border-[#E2E8F0] bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">客户总数</div>
                <div className="text-3xl font-bold text-[#1E293B]">
                  {stats.totalCustomers}
                </div>
                <div className="mt-2 text-xs text-[#64748B]">
                  终端用户数量
                </div>
              </div>
              <div className="rounded-full bg-[#8B5CF6]/10 p-3">
                <Users className="h-6 w-6 text-[#8B5CF6]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Device Trend */}
        <Card className="border-[#E2E8F0] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#1E293B]">设备数据趋势</CardTitle>
          </CardHeader>
          <CardContent>
            {(trendData?.length ?? 0) > 0 ? (
              <AreaChartComponent
                data={trendData}
                dataKey="value"
                color="#2563EB"
                height={250}
              />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-[#64748B]">
                暂无趋势数据
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="border-[#E2E8F0] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#1E293B]">设备状态分布</CardTitle>
          </CardHeader>
          <CardContent>
            {(deviceDistribution?.length ?? 0) > 0 ? (
              <PieChartComponent data={deviceDistribution} height={250} />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-[#64748B]">
                暂无设备数据
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-[#E2E8F0] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#1E293B]">快捷操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Link href="/vendor/devices">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-[#E2E8F0] hover:border-[#2563EB]">
                <Box className="h-5 w-5" />
                <span className="text-xs">设备管理</span>
              </Button>
            </Link>
            <Link href="/vendor/monitor">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-[#E2E8F0] hover:border-[#2563EB]">
                <Activity className="h-5 w-5" />
                <span className="text-xs">远程运维</span>
              </Button>
            </Link>
            <Link href="/vendor/alerts">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-[#E2E8F0] hover:border-[#2563EB]">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-xs">告警中心</span>
              </Button>
            </Link>
            <Link href="/vendor/customers">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-[#E2E8F0] hover:border-[#2563EB]">
                <Users className="h-5 w-5" />
                <span className="text-xs">客户管理</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
