'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Box,
  TrendingUp,
  Clock,
  Zap,
  Thermometer,
  Gauge,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AreaChartComponent, BarChartComponent } from '@/components/charts';
import {
  generateVendors,
  generateDevices,
  generateTrendData,
  generateRevenueTrend,
} from '@/lib/mock-data';

export default function UserDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  // 模拟用户购买的设备
  const vendors = generateVendors();
  const devices = generateDevices(12, [vendors[0]]);
  const trendData = generateTrendData();
  const productionData = generateRevenueTrend();

  // 统计
  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const faultDevices = devices.filter((d) => d.status === 'fault').length;

  // 模拟生产数据
  const productionMetrics = {
    output: 12580,
    efficiency: 94.5,
    runtime: 156.2,
    downtime: 3.8,
  };

  // 自动刷新
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // 生产数据柱状图
  const productionBarData = productionData.slice(-6).map((item) => ({
    month: item.month.split('-')[1] + '月',
    output: item.devices * 100,
  }));

  return (
    <div key={refreshKey} className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] p-6 text-white">
        <h1 className="text-2xl font-bold">生产概览</h1>
        <p className="mt-1 text-white/80">
          实时监控生产设备运行状态，掌握生产数据
        </p>
      </div>

      {/* Core Metrics - Large Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Output */}
        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-[#64748B]">
                  今日产量
                </div>
                <div className="mt-2 text-5xl font-bold text-[#0F172A]">
                  {productionMetrics.output.toLocaleString()}
                </div>
                <div className="mt-2 flex items-center text-sm text-[#22C55E]">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  较昨日 +12.5%
                </div>
              </div>
              <div className="rounded-2xl bg-[#F0F9FF] p-6">
                <Zap className="h-12 w-12 text-[#0EA5E9]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Efficiency */}
        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-[#64748B]">
                  生产效率
                </div>
                <div className="mt-2 text-5xl font-bold text-[#22C55E]">
                  {productionMetrics.efficiency}%
                </div>
                <div className="mt-2">
                  <Progress
                    value={productionMetrics.efficiency}
                    className="h-3 bg-[#E0F2FE]"
                  />
                </div>
              </div>
              <div className="rounded-2xl bg-[#F0FDF4] p-6">
                <Activity className="h-12 w-12 text-[#22C55E]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Status */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">设备总数</div>
                <div className="mt-1 text-3xl font-bold text-[#0F172A]">
                  {totalDevices}
                </div>
              </div>
              <Box className="h-8 w-8 text-[#0EA5E9]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">在线设备</div>
                <div className="mt-1 text-3xl font-bold text-[#22C55E]">
                  {onlineDevices}
                </div>
              </div>
              <Activity className="h-8 w-8 text-[#22C55E]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">故障设备</div>
                <div className="mt-1 text-3xl font-bold text-[#EF4444]">
                  {faultDevices}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-[#EF4444]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#0F172A]">
              产量趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChartComponent
              data={trendData}
              dataKey="online"
              xAxisKey="date"
              color="#0EA5E9"
              height={250}
            />
          </CardContent>
        </Card>

        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#0F172A]">
              月度产量
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartComponent
              data={productionBarData}
              xAxisKey="month"
              bars={[{ dataKey: 'output', name: '产量', color: '#0EA5E9' }]}
              height={250}
            />
          </CardContent>
        </Card>
      </div>

      {/* Device List */}
      <Card className="border-[#E0F2FE] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#0F172A]">我的设备</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.slice(0, 6).map((device) => (
              <div
                key={device.id}
                className="rounded-xl border border-[#E0F2FE] bg-[#F8FAFC] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-[#0F172A]">
                    {device.name}
                  </div>
                  <Badge
                    className={`text-xs ${
                      device.status === 'online'
                        ? 'bg-[#22C55E]/10 text-[#22C55E]'
                        : device.status === 'fault'
                          ? 'bg-[#EF4444]/10 text-[#EF4444]'
                          : 'bg-[#94A3B8]/10 text-[#94A3B8]'
                    }`}
                  >
                    {device.status === 'online'
                      ? '在线'
                      : device.status === 'fault'
                        ? '故障'
                        : '离线'}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-[#64748B]" />
                    <span className="text-sm text-[#64748B]">
                      {device.metrics.temperature}°C
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-[#64748B]" />
                    <span className="text-sm text-[#64748B]">
                      {device.metrics.efficiency}%
                    </span>
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
