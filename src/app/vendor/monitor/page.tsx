'use client';

import { useEffect, useState } from 'react';
import { Activity, RefreshCw, Thermometer, Gauge, Zap, Timer, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AreaChartComponent } from '@/components/charts';

interface Device {
  id: string;
  name: string;
  device_code: string;
  status: string;
  location: string;
  template?: {
    id: string;
    name: string;
  };
}

interface TemplateField {
  id: string;
  field_key: string;
  field_name: string;
  unit: string;
  color: string;
  chart_type: string;
  min_value: number | null;
  max_value: number | null;
}

export default function VendorMonitorPage() {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [deviceData, setDeviceData] = useState<any>(null);
  const [templateFields, setTemplateFields] = useState<TemplateField[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/vendor/monitor');
      const result = await response.json();
      
      if (result.success) {
        setDevices(result.data);
        if (result.data.length > 0 && !selectedDevice) {
          setSelectedDevice(result.data[0].id);
        }
      }
    } catch (error) {
      console.error('Fetch devices error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeviceData = async () => {
    if (!selectedDevice) return;
    
    try {
      setRefreshing(true);
      const response = await fetch(`/api/vendor/monitor?deviceId=${selectedDevice}`);
      const result = await response.json();
      
      if (result.success) {
        setDeviceData(result.data);
        setTemplateFields(result.data.device?.template?.fields || []);
      }
    } catch (error) {
      console.error('Fetch device data error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      fetchDeviceData();
      const interval = setInterval(fetchDeviceData, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedDevice]);

  const getFieldValue = (fieldKey: string) => {
    return deviceData?.latestData?.[fieldKey] ?? '-';
  };

  const isFieldAlert = (field: TemplateField) => {
    const value = deviceData?.latestData?.[field.field_key];
    if (value === undefined || value === null) return false;
    
    if (field.min_value !== null && value < field.min_value) return true;
    if (field.max_value !== null && value > field.max_value) return true;
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">远程运维</h1>
          <p className="text-sm text-slate-500">
            实时监控设备运行状态
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="选择设备" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={fetchDeviceData}
            disabled={refreshing}
          >
            {refreshing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            刷新
          </Button>
        </div>
      </div>

      {devices.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-slate-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>暂无设备，请先添加设备</p>
          </CardContent>
        </Card>
      ) : !deviceData ? (
        <Card>
          <CardContent className="py-10 text-center text-slate-500">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin" />
            <p>加载设备数据...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Device Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{deviceData.device?.name}</CardTitle>
                <Badge variant={deviceData.device?.status === 'online' ? 'default' : 'secondary'}>
                  {deviceData.device?.status === 'online' ? '在线' : '离线'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">设备编号：</span>
                  <span className="font-medium">{deviceData.device?.device_code || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500">位置：</span>
                  <span className="font-medium">{deviceData.device?.location || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500">模板：</span>
                  <span className="font-medium">{deviceData.device?.template?.name || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500">更新时间：</span>
                  <span className="font-medium">
                    {deviceData.recordedAt 
                      ? new Date(deviceData.recordedAt).toLocaleString()
                      : '-'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Realtime Data Grid */}
          {templateFields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templateFields.map((field) => {
                const value = getFieldValue(field.field_key);
                const isAlert = isFieldAlert(field);
                
                return (
                  <Card key={field.id} className={isAlert ? 'border-red-500' : ''}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-500">{field.field_name}</span>
                        {isAlert && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-2xl font-bold" style={{ color: field.color || '#2563EB' }}>
                        {value}
                        {field.unit && <span className="text-sm ml-1">{field.unit}</span>}
                      </div>
                      {field.min_value !== null && field.max_value !== null && (
                        <div className="text-xs text-slate-400 mt-2">
                          正常范围: {field.min_value} ~ {field.max_value} {field.unit}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-slate-500">
                <p>该设备未配置监控参数模板</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
