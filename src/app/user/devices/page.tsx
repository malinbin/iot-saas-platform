'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Box,
  Thermometer,
  Gauge,
  Zap,
  Power,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AreaChartComponent } from '@/components/charts';
import { generateVendors, generateDevices, generateTrendData } from '@/lib/mock-data';

export default function UserDevicesPage() {
  const vendors = generateVendors();
  const devices = generateDevices(12, [vendors[0]]);
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const trendData = generateTrendData();

  // 模拟实时数据 - 使用 useState 避免渲染期间的 Math.random
  const [realtimeData, setRealtimeData] = useState({
    temperature: 47.5,
    humidity: 65.0,
    power: 480,
    efficiency: 94.0,
  });

  // 模拟数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData({
        temperature: 45.2 + Math.random() * 5,
        humidity: 62.5 + Math.random() * 10,
        power: 456 + Math.random() * 50,
        efficiency: 92.3 + Math.random() * 5,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">设备监控</h1>
        <p className="text-sm text-[#64748B]">查看购买设备的实时运行状态</p>
      </div>

      {/* Device Selection */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Device List */}
        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#0F172A]">我的设备</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {devices.map((device) => (
                <div
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                    selectedDevice.id === device.id
                      ? 'border-[#0EA5E9] bg-[#F0F9FF]'
                      : 'border-[#E0F2FE] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-[#0F172A]">
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
                  <div className="mt-2 text-xs text-[#64748B]">
                    {device.model}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Detail */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#E0F2FE] bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-[#0F172A]">
                    {selectedDevice.name}
                  </CardTitle>
                  <div className="mt-1 text-sm text-[#64748B]">
                    {selectedDevice.model} · {selectedDevice.location}
                  </div>
                </div>
                <Badge
                  className={`text-sm ${
                    selectedDevice.status === 'online'
                      ? 'bg-[#22C55E]/10 text-[#22C55E]'
                      : 'bg-[#EF4444]/10 text-[#EF4444]'
                  }`}
                >
                  {selectedDevice.status === 'online' ? '运行中' : '故障'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Large Metrics */}
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-xl bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] p-6">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-[#0EA5E9]" />
                    <div className="text-sm font-medium text-[#64748B]">
                      温度
                    </div>
                  </div>
                  <div className="mt-3 text-4xl font-bold text-[#0F172A]">
                    {realtimeData.temperature.toFixed(1)}°C
                  </div>
                  <div className="mt-2 text-sm text-[#22C55E]">正常范围</div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] p-6">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[#22C55E]" />
                    <div className="text-sm font-medium text-[#64748B]">
                      效率
                    </div>
                  </div>
                  <div className="mt-3 text-4xl font-bold text-[#22C55E]">
                    {realtimeData.efficiency.toFixed(1)}%
                  </div>
                  <Progress
                    value={realtimeData.efficiency}
                    className="mt-3 h-2"
                  />
                </div>

                <div className="rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] p-6">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#F59E0B]" />
                    <div className="text-sm font-medium text-[#64748B]">
                      功率
                    </div>
                  </div>
                  <div className="mt-3 text-4xl font-bold text-[#0F172A]">
                    {realtimeData.power.toFixed(0)}W
                  </div>
                  <div className="mt-2 text-sm text-[#64748B]">额定 500W</div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] p-6">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-[#0EA5E9]" />
                    <div className="text-sm font-medium text-[#64748B]">
                      湿度
                    </div>
                  </div>
                  <div className="mt-3 text-4xl font-bold text-[#0F172A]">
                    {realtimeData.humidity.toFixed(1)}%
                  </div>
                  <div className="mt-2 text-sm text-[#22C55E]">正常范围</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="trend" className="w-full">
            <TabsList className="bg-[#F0F9FF]">
              <TabsTrigger value="trend">数据趋势</TabsTrigger>
              <TabsTrigger value="info">设备信息</TabsTrigger>
            </TabsList>
            <TabsContent value="trend" className="mt-4">
              <Card className="border-[#E0F2FE] bg-white shadow-sm">
                <CardContent className="pt-6">
                  <AreaChartComponent
                    data={trendData}
                    dataKey="online"
                    xAxisKey="date"
                    color="#0EA5E9"
                    height={250}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="info" className="mt-4">
              <Card className="border-[#E0F2FE] bg-white shadow-sm">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-[#F8FAFC] p-4">
                      <div className="text-sm text-[#64748B]">设备编号</div>
                      <div className="mt-1 text-lg font-semibold text-[#0F172A]">
                        {selectedDevice.id}
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#F8FAFC] p-4">
                      <div className="text-sm text-[#64748B]">设备型号</div>
                      <div className="mt-1 text-lg font-semibold text-[#0F172A]">
                        {selectedDevice.model}
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#F8FAFC] p-4">
                      <div className="text-sm text-[#64748B]">安装位置</div>
                      <div className="mt-1 text-lg font-semibold text-[#0F172A]">
                        {selectedDevice.location}
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#F8FAFC] p-4">
                      <div className="text-sm text-[#64748B]">厂家</div>
                      <div className="mt-1 text-lg font-semibold text-[#0F172A]">
                        {selectedDevice.vendorName}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
