'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  Settings,
  RefreshCw,
  Thermometer,
  Gauge,
  Zap,
  RotateCw,
  Droplets,
  Timer,
  Boxes,
} from 'lucide-react';
import { AreaChartComponent } from '@/components/charts/area-chart';

interface TemplateField {
  field_key: string;
  field_name: string;
  field_type: string;
  unit?: string;
  icon?: string;
  color?: string;
  chart_type?: string;
  show_in_dashboard?: boolean;
  alert_min?: number;
  alert_max?: number;
}

interface DeviceData {
  [key: string]: number | string;
}

export default function DeviceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const deviceId = params.id as string;
  
  const [device, setDevice] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [realtimeData, setRealtimeData] = useState<DeviceData>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDeviceDetail();
    
    // 设置定时刷新
    const interval = setInterval(() => {
      loadRealtimeData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [deviceId]);

  const loadDeviceDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/devices/${deviceId}`);
      if (res.ok) {
        const data = await res.json();
        setDevice(data.device);
        setTemplate(data.template);
        setFields(data.fields || []);
        setRealtimeData(data.realtime_data || {});
      }
    } catch (error) {
      console.error('加载设备详情失败:', error);
      // 使用模拟数据
      setDevice({
        id: deviceId,
        name: '注塑机-01',
        serial_number: 'SN202401001',
        status: 'online',
        location: '华东机械-A车间',
      });
      setTemplate({
        id: 'tpl_1',
        name: '注塑机',
        code: 'injection_molding',
      });
      setFields([
        { field_key: 'temperature', field_name: '温度', field_type: 'number', unit: '℃', icon: 'Thermometer', color: '#ef4444', chart_type: 'line', show_in_dashboard: true, alert_max: 80 },
        { field_key: 'pressure', field_name: '压力', field_type: 'number', unit: 'MPa', icon: 'Activity', color: '#ec4899', chart_type: 'line', show_in_dashboard: true, alert_max: 15 },
        { field_key: 'speed', field_name: '转速', field_type: 'number', unit: 'rpm', icon: 'RotateCw', color: '#8b5cf6', chart_type: 'line', show_in_dashboard: true },
        { field_key: 'power', field_name: '功率', field_type: 'number', unit: 'kW', icon: 'Zap', color: '#f59e0b', chart_type: 'bar', show_in_dashboard: true },
        { field_key: 'efficiency', field_name: '效率', field_type: 'number', unit: '%', icon: 'Gauge', color: '#22c55e', chart_type: 'gauge', show_in_dashboard: true },
        { field_key: 'output', field_name: '产量', field_type: 'number', unit: '件/h', icon: 'Boxes', color: '#06b6d4', chart_type: 'bar', show_in_dashboard: true },
        { field_key: 'runtime', field_name: '运行时长', field_type: 'number', unit: 'h', icon: 'Timer', color: '#84cc16', chart_type: 'none', show_in_dashboard: false },
      ]);
      setRealtimeData({
        temperature: 45.2 + Math.random() * 5,
        pressure: 5.8 + Math.random() * 0.5,
        speed: 3200 + Math.random() * 200,
        power: 45.6 + Math.random() * 10,
        efficiency: 92.3 + Math.random() * 5,
        output: 120 + Math.random() * 20,
        runtime: 1256,
      });
    }
    setLoading(false);
  };

  const loadRealtimeData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/user/devices/${deviceId}/realtime`);
      if (res.ok) {
        const data = await res.json();
        setRealtimeData(data);
      }
    } catch (error) {
      // 模拟数据变化
      setRealtimeData(prev => ({
        ...prev,
        temperature: 45.2 + Math.random() * 5,
        pressure: 5.8 + Math.random() * 0.5,
        speed: 3200 + Math.random() * 200,
        power: 45.6 + Math.random() * 10,
        efficiency: 92.3 + Math.random() * 5,
        output: 120 + Math.random() * 20,
      }));
    }
    setTimeout(() => setRefreshing(false), 500);
  };

  const getFieldIcon = (iconName?: string) => {
    const icons: Record<string, React.ReactNode> = {
      Thermometer: <Thermometer className="h-5 w-5" />,
      Droplets: <Droplets className="h-5 w-5" />,
      Zap: <Zap className="h-5 w-5" />,
      Gauge: <Gauge className="h-5 w-5" />,
      RotateCw: <RotateCw className="h-5 w-5" />,
      Activity: <Activity className="h-5 w-5" />,
      Boxes: <Boxes className="h-5 w-5" />,
      Timer: <Timer className="h-5 w-5" />,
    };
    return icons[iconName || ''] || <Activity className="h-5 w-5" />;
  };

  const checkAlert = (field: TemplateField, value: number): 'normal' | 'warning' | 'alert' => {
    if (field.alert_max !== undefined && value > field.alert_max) return 'alert';
    if (field.alert_min !== undefined && value < field.alert_min) return 'alert';
    return 'normal';
  };

  const generateTrendData = (fieldKey: string) => {
    const baseValue = typeof realtimeData[fieldKey] === 'number' ? realtimeData[fieldKey] as number : 50;
    return Array.from({ length: 24 }, (_, i) => ({
      date: `${i}:00`,
      value: baseValue + Math.sin(i / 3) * (baseValue * 0.1) + Math.random() * (baseValue * 0.05),
    }));
  };

  const statusColors: Record<string, string> = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    fault: 'bg-red-500',
    maintenance: 'bg-yellow-500',
  };

  const statusLabels: Record<string, string> = {
    online: '运行中',
    offline: '离线',
    fault: '故障',
    maintenance: '维护中',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="font-medium">{device?.name}</div>
              <div className="text-xs text-slate-500">{template?.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadRealtimeData}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* 设备状态卡片 */}
      <div className="p-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusColors[device?.status || 'offline']}`} />
                <span className="font-medium">{statusLabels[device?.status || 'offline']}</span>
              </div>
              <div className="text-xs text-slate-500">
                SN: {device?.serial_number}
              </div>
            </div>
            <div className="text-sm text-slate-500">
              位置：{device?.location || '未设置'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 标签页 */}
      <Tabs defaultValue="dashboard" className="px-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100">
          <TabsTrigger value="dashboard">仪表盘</TabsTrigger>
          <TabsTrigger value="data">数据详情</TabsTrigger>
          <TabsTrigger value="alerts">告警</TabsTrigger>
        </TabsList>

        {/* 仪表盘 */}
        <TabsContent value="dashboard" className="space-y-4 mt-4">
          {/* 主要数据卡片 */}
          <div className="grid grid-cols-2 gap-3">
            {fields
              .filter(f => f.show_in_dashboard)
              .slice(0, 4)
              .map((field) => {
                const value = realtimeData[field.field_key];
                const numValue = typeof value === 'number' ? value : 0;
                const alertStatus = checkAlert(field, numValue);
                
                return (
                  <Card 
                    key={field.field_key} 
                    className={`bg-white ${alertStatus === 'alert' ? 'border-red-300' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="p-1.5 rounded-lg"
                          style={{ backgroundColor: `${field.color}20` }}
                        >
                          <span style={{ color: field.color }}>
                            {getFieldIcon(field.icon)}
                          </span>
                        </div>
                        <span className="text-sm text-slate-500">{field.field_name}</span>
                        {alertStatus === 'alert' && (
                          <AlertTriangle className="h-4 w-4 text-red-500 ml-auto" />
                        )}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: alertStatus === 'alert' ? '#ef4444' : field.color }}
                        >
                          {numValue.toFixed(1)}
                        </span>
                        <span className="text-sm text-slate-400">{field.unit}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {/* 次要数据 */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {fields
                  .filter(f => f.show_in_dashboard)
                  .slice(4)
                  .map((field) => {
                    const value = realtimeData[field.field_key];
                    const numValue = typeof value === 'number' ? value : 0;
                    
                    return (
                      <div key={field.field_key} className="text-center">
                        <div className="text-xs text-slate-400 mb-1">{field.field_name}</div>
                        <div className="font-medium" style={{ color: field.color }}>
                          {numValue.toFixed(1)}
                        </div>
                        <div className="text-xs text-slate-400">{field.unit}</div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* 趋势图表 */}
          {fields.filter(f => f.chart_type === 'line').length > 0 && (
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="text-sm font-medium mb-3">数据趋势</div>
                <div className="space-y-4">
                  {fields
                    .filter(f => f.chart_type === 'line')
                    .slice(0, 2)
                    .map((field) => (
                      <div key={field.field_key}>
                        <div className="text-xs text-slate-500 mb-1">{field.field_name}</div>
                        <div className="h-24">
                          <AreaChartComponent
                            data={generateTrendData(field.field_key)}
                            dataKey="value"
                            color={field.color || '#3b82f6'}
                            height={80}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 数据详情 */}
        <TabsContent value="data" className="space-y-3 mt-4">
          {fields.map((field) => {
            const value = realtimeData[field.field_key];
            const numValue = typeof value === 'number' ? value : 0;
            const alertStatus = checkAlert(field, numValue);
            
            return (
              <Card 
                key={field.field_key} 
                className={`bg-white ${alertStatus === 'alert' ? 'border-red-300' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${field.color}20` }}
                      >
                        <span style={{ color: field.color }}>
                          {getFieldIcon(field.icon)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{field.field_name}</div>
                        <div className="text-xs text-slate-400">
                          {field.field_key} | {field.field_type}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div 
                        className="text-xl font-bold"
                        style={{ color: alertStatus === 'alert' ? '#ef4444' : field.color }}
                      >
                        {numValue.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-400">{field.unit}</div>
                    </div>
                  </div>
                  
                  {/* 告警阈值提示 */}
                  {(field.alert_min !== undefined || field.alert_max !== undefined) && (
                    <div className="mt-3 pt-3 border-t text-xs text-slate-400">
                      告警范围：
                      {field.alert_min !== undefined && <span>下限 {field.alert_min}{field.unit}</span>}
                      {field.alert_min !== undefined && field.alert_max !== undefined && <span> ~ </span>}
                      {field.alert_max !== undefined && <span>上限 {field.alert_max}{field.unit}</span>}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* 告警 */}
        <TabsContent value="alerts" className="mt-4">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="text-center py-8 text-slate-500">
                <Activity className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <div>暂无告警</div>
                <div className="text-xs mt-1">设备运行正常</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
