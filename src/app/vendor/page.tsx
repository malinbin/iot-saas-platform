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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AreaChartComponent, PieChartComponent } from '@/components/charts';
import {
  generateVendors,
  generateDevices,
  generateAlerts,
  generateTrendData,
  formatPercent,
} from '@/lib/mock-data';

export default function VendorDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  // 模拟当前商家数据
  const vendors = generateVendors();
  const currentVendor = vendors[0];
  const devices = generateDevices(156, [currentVendor]);
  const alerts = generateAlerts(devices);
  const trendData = generateTrendData();

  // 统计
  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const faultDevices = devices.filter((d) => d.status === 'fault').length;
  const warningDevices = devices.filter((d) => d.status === 'warning').length;

  // 自动刷新
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // 设备分布数据
  const deviceDistribution = [
    { name: '在线', value: onlineDevices, color: '#22C55E' },
    { name: '离线', value: devices.filter((d) => d.status === 'offline').length, color: '#94A3B8' },
    { name: '故障', value: faultDevices, color: '#EF4444' },
    { name: '告警', value: warningDevices, color: '#F59E0B' },
  ];

  return (
    <div key={refreshKey} className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">数据概览</h1>
          <p className="text-sm text-[#64748B]">
            欢迎回来，{currentVendor.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-[#E2E8F0]">
            导出报表
          </Button>
          <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
            刷新数据
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Devices */}
        <Card className="border-[#E2E8F0] bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">设备总数</div>
                <div className="text-3xl font-bold text-[#1E293B]">
                  {totalDevices}
                </div>
                <div className="mt-2 flex items-center text-xs text-[#22C55E]">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +8 台本月新增
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
                  {onlineDevices}
                </div>
                <div className="mt-2">
                  <Progress
                    value={(onlineDevices / totalDevices) * 100}
                    className="h-2 bg-[#E2E8F0]"
                  />
                  <div className="mt-1 text-xs text-[#64748B]">
                    在线率 {formatPercent(onlineDevices, totalDevices)}
                  </div>
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
                  {faultDevices}
                </div>
                <div className="mt-2 flex items-center text-xs text-[#EF4444]">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  需要立即处理
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
                <div className="text-sm text-[#64748B]">客户数量</div>
                <div className="text-3xl font-bold text-[#1E293B]">42</div>
                <div className="mt-2 flex items-center text-xs text-[#22C55E]">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +5 本月新增
                </div>
              </div>
              <div className="rounded-full bg-[#3B82F6]/10 p-3">
                <Users className="h-6 w-6 text-[#3B82F6]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Device Trend */}
        <Card className="border-[#E2E8F0] bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-[#1E293B]">
                设备趋势
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[#2563EB]">
                查看详情
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AreaChartComponent
              data={trendData}
              dataKey="online"
              xAxisKey="date"
              color="#2563EB"
              height={250}
            />
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="border-[#E2E8F0] bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-[#1E293B]">
                设备状态分布
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[#2563EB]">
                查看详情
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PieChartComponent
              data={deviceDistribution}
              height={250}
              innerRadius={60}
              outerRadius={90}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="border-[#E2E8F0] bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-[#1E293B]">最新告警</CardTitle>
            <Button variant="link" className="text-[#2563EB]">
              查看全部
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {alerts.slice(0, 6).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4"
              >
                <div
                  className={`mt-0.5 rounded-full p-1.5 ${
                    alert.type === 'fault'
                      ? 'bg-[#EF4444]/10'
                      : 'bg-[#F59E0B]/10'
                  }`}
                >
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      alert.type === 'fault' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#1E293B]">
                    {alert.deviceName}
                  </div>
                  <div className="text-xs text-[#64748B]">{alert.message}</div>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        alert.type === 'fault'
                          ? 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]'
                          : 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]'
                      }`}
                    >
                      {alert.type === 'fault' ? '故障' : '警告'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
