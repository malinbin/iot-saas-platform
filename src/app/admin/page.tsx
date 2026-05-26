'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Box,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TrendChart,
  AreaChartComponent,
  PieChartComponent,
  BarChartComponent,
} from '@/components/charts';
import {
  generateVendors,
  generateDevices,
  generateAlerts,
  generateStatistics,
  generateTrendData,
  generateRevenueTrend,
  formatCurrency,
  formatPercent,
} from '@/lib/mock-data';

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  // 生成数据
  const vendors = generateVendors();
  const devices = generateDevices(850, vendors);
  const alerts = generateAlerts(devices);
  const statistics = generateStatistics(devices, vendors);
  const trendData = generateTrendData();
  const revenueTrend = generateRevenueTrend();

  // 自动刷新
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // 设备状态分布数据
  const deviceDistribution = [
    { name: '在线', value: statistics.onlineDevices, color: '#22C55E' },
    { name: '离线', value: statistics.offlineDevices, color: '#64748B' },
    { name: '故障', value: statistics.faultDevices, color: '#EF4444' },
    { name: '告警', value: statistics.warningDevices, color: '#F97316' },
  ];

  // 收益柱状图数据
  const revenueBarData = revenueTrend.slice(-6).map((item) => ({
    month: item.month.split('-')[1] + '月',
    revenue: item.revenue,
  }));

  return (
    <div key={refreshKey} className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">数据大盘</h1>
          <p className="text-sm text-[#64748B]">
            实时监控平台整体运营状况
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-[#1E3A5F] text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
          >
            导出报表
          </Button>
          <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
            数据刷新
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Devices */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">
              总设备数
            </CardTitle>
            <Box className="h-4 w-4 text-[#2563EB]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {statistics.totalDevices.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center text-xs text-[#22C55E]">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.5% 较上月
            </div>
          </CardContent>
        </Card>

        {/* Online Devices */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">
              在线设备
            </CardTitle>
            <Activity className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#22C55E]">
              {statistics.onlineDevices.toLocaleString()}
            </div>
            <div className="mt-2">
              <Progress
                value={(statistics.onlineDevices / statistics.totalDevices) * 100}
                className="h-2 bg-[#0A1628]"
              />
              <div className="mt-1 text-xs text-[#64748B]">
                在线率{' '}
                {formatPercent(statistics.onlineDevices, statistics.totalDevices)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fault Devices */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">
              故障设备
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#EF4444]">
              {statistics.faultDevices.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-[#F97316]">
              +3 台新增故障
            </div>
          </CardContent>
        </Card>

        {/* Total Vendors */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">
              合作厂家
            </CardTitle>
            <Building2 className="h-4 w-4 text-[#2563EB]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {statistics.totalVendors}
            </div>
            <div className="mt-2 text-xs text-[#F97316]">
              {statistics.pendingVendors} 家待审核
            </div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">
              注册用户
            </CardTitle>
            <Users className="h-4 w-4 text-[#2563EB]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {statistics.totalUsers.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-[#22C55E]">
              +86 新用户本月
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">
              总收益
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {formatCurrency(statistics.totalRevenue)}
            </div>
            <div className="mt-2 text-xs text-[#22C55E]">
              +18.2% 较上月
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">
              本月收益
            </CardTitle>
            <Zap className="h-4 w-4 text-[#F97316]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {formatCurrency(statistics.monthlyRevenue)}
            </div>
            <div className="mt-2 text-xs text-[#22C55E]">
              预计达成目标
            </div>
          </CardContent>
        </Card>

        {/* Offline Devices */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">
              离线设备
            </CardTitle>
            <Activity className="h-4 w-4 text-[#64748B]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#64748B]">
              {statistics.offlineDevices.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-[#64748B]">
              占总设备{' '}
              {formatPercent(statistics.offlineDevices, statistics.totalDevices)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Device Trend Chart */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
          <CardHeader>
            <CardTitle className="text-white">设备趋势（最近30天）</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={trendData}
              lines={[
                { dataKey: 'online', name: '在线', color: '#22C55E' },
                { dataKey: 'offline', name: '离线', color: '#64748B' },
                { dataKey: 'fault', name: '故障', color: '#EF4444' },
              ]}
              height={280}
            />
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
          <CardHeader>
            <CardTitle className="text-white">设备状态分布</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartComponent
              data={deviceDistribution}
              height={280}
              innerRadius={70}
              outerRadius={110}
            />
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
        <CardHeader>
          <CardTitle className="text-white">收益趋势（最近6个月）</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChartComponent
            data={revenueBarData}
            xAxisKey="month"
            bars={[{ dataKey: 'revenue', name: '收益', color: '#2563EB' }]}
            height={280}
          />
        </CardContent>
      </Card>

      {/* Alerts and Vendors */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Alerts */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">最新告警</CardTitle>
              <Button
                variant="link"
                className="text-[#2563EB] hover:text-[#2563EB]/80"
              >
                查看全部
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between rounded-lg border border-[#1E3A5F] bg-[#0A1628] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${
                        alert.type === 'fault'
                          ? 'bg-[#EF4444]'
                          : alert.type === 'warning'
                            ? 'bg-[#F97316]'
                            : 'bg-[#2563EB]'
                      }`}
                    />
                    <div>
                      <div className="text-sm font-medium text-white">
                        {alert.deviceName}
                      </div>
                      <div className="text-xs text-[#64748B]">
                        {alert.message}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`border-0 text-xs ${
                      alert.type === 'fault'
                        ? 'bg-[#EF4444]/20 text-[#EF4444]'
                        : alert.type === 'warning'
                          ? 'bg-[#F97316]/20 text-[#F97316]'
                          : 'bg-[#2563EB]/20 text-[#2563EB]'
                    }`}
                  >
                    {alert.type === 'fault' ? '故障' : '告警'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vendors Table */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30 shadow-lg shadow-black/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">厂家列表</CardTitle>
              <Button
                variant="link"
                className="text-[#2563EB] hover:text-[#2563EB]/80"
              >
                管理厂家
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-[#1E3A5F] hover:bg-[#0A1628]">
                  <TableHead className="text-[#64748B]">厂家名称</TableHead>
                  <TableHead className="text-[#64748B]">设备数</TableHead>
                  <TableHead className="text-[#64748B]">在线数</TableHead>
                  <TableHead className="text-[#64748B]">状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.slice(0, 5).map((vendor) => (
                  <TableRow
                    key={vendor.id}
                    className="border-[#1E3A5F] hover:bg-[#0A1628]"
                  >
                    <TableCell className="font-medium text-white">
                      {vendor.name}
                    </TableCell>
                    <TableCell className="text-[#94A3B8]">
                      {vendor.deviceCount}
                    </TableCell>
                    <TableCell className="text-[#22C55E]">
                      {vendor.onlineCount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border-0 ${
                          vendor.status === 'approved'
                            ? 'bg-[#22C55E]/20 text-[#22C55E]'
                            : vendor.status === 'pending'
                              ? 'bg-[#F97316]/20 text-[#F97316]'
                              : 'bg-[#EF4444]/20 text-[#EF4444]'
                        }`}
                      >
                        {vendor.status === 'approved'
                          ? '已审核'
                          : vendor.status === 'pending'
                            ? '待审核'
                            : '已拒绝'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
