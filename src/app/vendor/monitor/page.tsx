'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Power,
  RefreshCw,
  Settings,
  Thermometer,
  Gauge,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AreaChartComponent } from '@/components/charts';
import { generateVendors, generateDevices, generateTrendData } from '@/lib/mock-data';

export default function MonitorPage() {
  const vendors = generateVendors();
  const devices = generateDevices(20, [vendors[0]]);
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const trendData = generateTrendData();

  // 模拟实时数据 - 使用 useState 避免渲染期间的 Math.random
  const [realtimeData, setRealtimeData] = useState({
    temperature: 47.5,
    humidity: 65.0,
    power: 480,
    efficiency: 94.0,
    speed: 3300,
    pressure: 5.4,
  });

  // 模拟数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData({
        temperature: 45.2 + Math.random() * 5,
        humidity: 62.5 + Math.random() * 10,
        power: 456 + Math.random() * 50,
        efficiency: 92.3 + Math.random() * 5,
        speed: 3200 + Math.random() * 200,
        pressure: 5.2 + Math.random() * 0.5,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">远程运维</h1>
          <p className="text-sm text-[#64748B]">
            实时监控设备运行状态，支持远程控制
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            刷新数据
          </Button>
        </div>
      </div>

      {/* Device Selection */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Device List */}
        <Card className="border-[#E2E8F0] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#1E293B]">设备列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {devices.slice(0, 10).map((device) => (
                <div
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    selectedDevice.id === device.id
                      ? 'border-[#2563EB] bg-[#2563EB]/5'
                      : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-[#1E293B]">
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
                  <div className="mt-1 text-xs text-[#64748B]">
                    {device.model}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Monitor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Device Info */}
          <Card className="border-[#E2E8F0] bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-[#1E293B]">
                    {selectedDevice.name}
                  </CardTitle>
                  <div className="text-sm text-[#64748B]">
                    {selectedDevice.model} · {selectedDevice.location}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-[#22C55E] hover:bg-[#22C55E]/90"
                  >
                    <Power className="mr-2 h-4 w-4" />
                    启动
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
                  >
                    <Power className="mr-2 h-4 w-4" />
                    停止
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-[#EF4444]" />
                    <div className="text-sm text-[#64748B]">温度</div>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#1E293B]">
                    {realtimeData.temperature.toFixed(1)}°C
                  </div>
                  <div className="mt-1 text-xs text-[#22C55E]">正常范围</div>
                </div>

                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#3B82F6]" />
                    <div className="text-sm text-[#64748B]">湿度</div>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#1E293B]">
                    {realtimeData.humidity.toFixed(1)}%
                  </div>
                  <div className="mt-1 text-xs text-[#22C55E]">正常范围</div>
                </div>

                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#F59E0B]" />
                    <div className="text-sm text-[#64748B]">功率</div>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#1E293B]">
                    {realtimeData.power.toFixed(0)}W
                  </div>
                  <div className="mt-1 text-xs text-[#64748B]">额定 500W</div>
                </div>

                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-[#2563EB]" />
                    <div className="text-sm text-[#64748B]">转速</div>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#1E293B]">
                    {realtimeData.speed.toFixed(0)}
                  </div>
                  <div className="mt-1 text-xs text-[#64748B]">RPM</div>
                </div>

                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#22C55E]" />
                    <div className="text-sm text-[#64748B]">效率</div>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#22C55E]">
                    {realtimeData.efficiency.toFixed(1)}%
                  </div>
                  <Progress
                    value={realtimeData.efficiency}
                    className="mt-2 h-2"
                  />
                </div>

                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-[#8B5CF6]" />
                    <div className="text-sm text-[#64748B]">压力</div>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#1E293B]">
                    {realtimeData.pressure.toFixed(1)} MPa
                  </div>
                  <div className="mt-1 text-xs text-[#22C55E]">正常</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="trend" className="w-full">
            <TabsList className="bg-[#F8FAFC]">
              <TabsTrigger value="trend">数据趋势</TabsTrigger>
              <TabsTrigger value="control">远程控制</TabsTrigger>
              <TabsTrigger value="log">运行日志</TabsTrigger>
            </TabsList>
            <TabsContent value="trend" className="mt-4">
              <Card className="border-[#E2E8F0] bg-white shadow-sm">
                <CardContent className="pt-6">
                  <AreaChartComponent
                    data={trendData}
                    dataKey="online"
                    xAxisKey="date"
                    color="#2563EB"
                    height={250}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="control" className="mt-4">
              <Card className="border-[#E2E8F0] bg-white shadow-sm">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 bg-[#22C55E] hover:bg-[#22C55E]/90">
                      <div className="flex flex-col items-center gap-2">
                        <Power className="h-6 w-6" />
                        <span>启动设备</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Power className="h-6 w-6" />
                        <span>停止设备</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-20">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="h-6 w-6" />
                        <span>重启设备</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-20">
                      <div className="flex flex-col items-center gap-2">
                        <Settings className="h-6 w-6" />
                        <span>设备设置</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="log" className="mt-4">
              <Card className="border-[#E2E8F0] bg-white shadow-sm">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {[
                      { time: '10:32:15', type: 'info', msg: '设备启动成功' },
                      { time: '10:30:00', type: 'warn', msg: '温度过高预警' },
                      { time: '10:15:30', type: 'info', msg: '参数调整完成' },
                      { time: '09:45:20', type: 'error', msg: '通信中断' },
                      { time: '09:30:00', type: 'info', msg: '设备上线' },
                    ].map((log, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3"
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${
                            log.type === 'error'
                              ? 'bg-[#EF4444]'
                              : log.type === 'warn'
                                ? 'bg-[#F59E0B]'
                                : 'bg-[#22C55E]'
                          }`}
                        />
                        <div className="text-sm text-[#64748B]">{log.time}</div>
                        <div className="text-sm text-[#1E293B]">{log.msg}</div>
                      </div>
                    ))}
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
