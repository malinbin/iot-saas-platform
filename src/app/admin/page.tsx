'use client';

import { useEffect, useState } from 'react';
import {
  Building2,
  Box,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  DollarSign,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChartComponent, PieChartComponent } from '@/components/charts';

interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  faultDevices: number;
  totalVendors: number;
  pendingVendors: number;
  totalUsers: number;
  totalRevenue: number;
}

interface TrendData {
  date: string;
  value: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [deviceTrend, setDeviceTrend] = useState<Record<string, string | number>[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<Record<string, string | number>[]>([]);
  const [deviceDistribution, setDeviceDistribution] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data.stats);
        setDeviceTrend(result.data.deviceTrend);
        setRevenueTrend(result.data.revenueTrend);
        setDeviceDistribution(result.data.deviceDistribution);
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
        <RefreshCw className="h-8 w-8 animate-spin text-[#22C55E]" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-10">
        <p className="text-[#94A3B8]">暂无数据</p>
        <Button onClick={handleRefresh} className="mt-4">
          刷新
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">平台数据大盘</h1>
          <p className="text-sm text-[#94A3B8]">
            实时监控平台运营数据
          </p>
        </div>
        <Button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-[#1E3A5F] hover:bg-[#1E3A5F]/80 text-white"
        >
          {refreshing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          刷新数据
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Devices */}
        <Card className="bg-[#1E3A5F] border-[#2D4A6F]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">设备总数</div>
                <div className="text-3xl font-bold text-white">
                  {stats.totalDevices}
                </div>
                <div className="mt-2 flex items-center text-xs text-[#22C55E]">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  在线 {stats.onlineDevices} 台
                </div>
              </div>
              <div className="rounded-full bg-[#2563EB]/20 p-3">
                <Box className="h-6 w-6 text-[#2563EB]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Vendors */}
        <Card className="bg-[#1E3A5F] border-[#2D4A6F]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">厂家数量</div>
                <div className="text-3xl font-bold text-white">
                  {stats.totalVendors}
                </div>
                {stats.pendingVendors > 0 && (
                  <div className="mt-2 text-xs text-[#F97316]">
                    {stats.pendingVendors} 家待审核
                  </div>
                )}
              </div>
              <div className="rounded-full bg-[#22C55E]/20 p-3">
                <Building2 className="h-6 w-6 text-[#22C55E]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className="bg-[#1E3A5F] border-[#2D4A6F]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">用户总数</div>
                <div className="text-3xl font-bold text-white">
                  {stats.totalUsers}
                </div>
              </div>
              <div className="rounded-full bg-[#8B5CF6]/20 p-3">
                <Users className="h-6 w-6 text-[#8B5CF6]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="bg-[#1E3A5F] border-[#2D4A6F]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">累计收益</div>
                <div className="text-3xl font-bold text-white">
                  ¥{stats.totalRevenue.toLocaleString()}
                </div>
              </div>
              <div className="rounded-full bg-[#F97316]/20 p-3">
                <DollarSign className="h-6 w-6 text-[#F97316]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Online Rate */}
        <Card className="bg-[#1E3A5F] border-[#2D4A6F]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">设备在线率</div>
                <div className="text-2xl font-bold text-[#22C55E]">
                  {stats.totalDevices > 0 
                    ? Math.round((stats.onlineDevices / stats.totalDevices) * 100) 
                    : 0}%
                </div>
              </div>
              <Activity className="h-8 w-8 text-[#22C55E]" />
            </div>
          </CardContent>
        </Card>

        {/* Fault Devices */}
        <Card className="bg-[#1E3A5F] border-[#2D4A6F]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">故障设备</div>
                <div className="text-2xl font-bold text-[#EF4444]">
                  {stats.faultDevices}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-[#EF4444]" />
            </div>
          </CardContent>
        </Card>

        {/* Offline Devices */}
        <Card className="bg-[#1E3A5F] border-[#2D4A6F]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">离线设备</div>
                <div className="text-2xl font-bold text-[#94A3B8]">
                  {stats.offlineDevices}
                </div>
              </div>
              <Box className="h-8 w-8 text-[#94A3B8]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Device Trend */}
        <Card className="bg-[#1E3A5F] border-[#2D4A6F]">
          <CardHeader>
            <CardTitle className="text-lg text-white">设备增长趋势</CardTitle>
          </CardHeader>
          <CardContent>
            {deviceTrend.length > 0 ? (
              <AreaChartComponent
                data={deviceTrend}
                dataKey="value"
                color="#22C55E"
                height={250}
              />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-[#94A3B8]">
                暂无趋势数据
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="bg-[#1E3A5F] border-[#2D4A6F]">
          <CardHeader>
            <CardTitle className="text-lg text-white">收益趋势</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueTrend.length > 0 ? (
              <AreaChartComponent
                data={revenueTrend}
                dataKey="value"
                color="#F97316"
                height={250}
              />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-[#94A3B8]">
                暂无收益数据
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Device Distribution */}
      <Card className="bg-[#1E3A5F] border-[#2D4A6F]">
        <CardHeader>
          <CardTitle className="text-lg text-white">设备状态分布</CardTitle>
        </CardHeader>
        <CardContent>
          {deviceDistribution.length > 0 ? (
            <PieChartComponent data={deviceDistribution} height={300} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-[#94A3B8]">
              暂无设备数据
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
