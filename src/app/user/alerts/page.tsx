'use client';

import { useEffect, useState } from 'react';
import { MobileHeader } from '@/components/user/mobile-header';
import { 
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: string;
  level: string;
  title: string;
  message: string;
  status: string;
  device_name: string;
  created_at: string;
}

export default function UserAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`/api/user/alerts?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('获取告警列表失败:', error);
      setLoading(false);
    }
  };

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'critical':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', label: '严重' };
      case 'error':
        return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', label: '错误' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', label: '警告' };
      default:
        return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', label: '提示' };
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MobileHeader title="故障报警" />
      
      <div className="px-4 py-4 space-y-4">
        {/* 筛选标签 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'active', 'resolved'] as const).map((status) => (
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
              {status === 'all' ? '全部' : status === 'active' ? '待处理' : '已处理'}
            </button>
          ))}
        </div>

        {/* 告警列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0EA5E9]" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-300 mb-3" />
            <p className="text-gray-500">暂无告警</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const levelConfig = getLevelConfig(alert.level);
              const LevelIcon = levelConfig.icon;
              
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'bg-white rounded-2xl p-4 border-l-4',
                    levelConfig.border
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('p-2 rounded-lg', levelConfig.bg)}>
                      <LevelIcon className={cn('h-5 w-5', levelConfig.color)} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          levelConfig.bg,
                          levelConfig.color
                        )}>
                          {levelConfig.label}
                        </span>
                        {alert.status === 'active' && (
                          <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-600">
                            待处理
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 truncate">{alert.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{alert.message}</p>
                      
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                        <span>{alert.device_name}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(alert.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
