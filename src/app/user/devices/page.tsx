'use client';

import { useEffect, useState } from 'react';
import { MobileHeader } from '@/components/user/mobile-header';
import { 
  Box, 
  Wifi, 
  WifiOff, 
  AlertTriangle,
  ChevronRight,
  Thermometer,
  Gauge,
  Zap,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Device {
  id: string;
  name: string;
  serial_number: string;
  status: string;
  device_type: string;
  location: string;
  last_heartbeat_at: string;
}

export default function UserDevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'online' | 'fault'>('all');

  useEffect(() => {
    fetchDevices();
  }, [filter]);

  const fetchDevices = async () => {
    try {
      const res = await fetch(`/api/user/devices?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setDevices(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('获取设备列表失败:', error);
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return { icon: Wifi, color: 'text-green-500', bg: 'bg-green-50', label: '在线' };
      case 'offline':
        return { icon: WifiOff, color: 'text-gray-400', bg: 'bg-gray-50', label: '离线' };
      case 'fault':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', label: '故障' };
      default:
        return { icon: Box, color: 'text-gray-400', bg: 'bg-gray-50', label: '未知' };
    }
  };

  const formatLastSeen = (dateStr: string) => {
    if (!dateStr) return '未知';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
    return `${Math.floor(diff / 86400)} 天前`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MobileHeader title="设备监控" />
      
      <div className="px-4 py-4 space-y-4">
        {/* 筛选标签 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'online', 'fault'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                filter === status
                  ? 'bg-[#0EA5E9] text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              )}
            >
              {status === 'all' ? '全部' : status === 'online' ? '在线' : '故障'}
            </button>
          ))}
        </div>

        {/* 设备列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0EA5E9]" />
          </div>
        ) : devices.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <Box className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">暂无设备数据</p>
          </div>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => {
              const statusConfig = getStatusConfig(device.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <Link
                  key={device.id}
                  href={`/user/devices/${device.id}`}
                  className="block bg-white rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{device.name}</h3>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs',
                          statusConfig.bg,
                          statusConfig.color
                        )}>
                          {statusConfig.label}
                        </span>
                      </div>
                      
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <StatusIcon className="h-4 w-4" />
                          <span>SN: {device.serial_number}</span>
                        </div>
                        
                        {device.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Box className="h-4 w-4" />
                            <span>{device.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>最后在线: {formatLastSeen(device.last_heartbeat_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-gray-300" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
