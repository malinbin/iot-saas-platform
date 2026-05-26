'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Bell,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  device_id: string;
  device_name: string;
  device_serial?: string;
  vendor_id?: string;
  vendor_name?: string;
  alert_type: string;
  alert_level: string;
  title: string;
  message: string;
  status: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
  created_at: string;
}

export default function AlertsPage() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 加载告警数据
  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/alerts?limit=100');
      const data = await response.json();
      if (data.success) {
        setAlerts(data.data || []);
      } else {
        toast({
          title: '加载失败',
          description: data.error || '无法加载告警数据',
          variant: 'error' as const,
        });
      }
    } catch (error) {
      console.error('加载告警失败:', error);
      toast({
        title: '加载失败',
        description: '网络错误，请稍后重试',
        variant: 'error' as const,
      });
    } finally {
      setLoading(false);
    }
  };

  // 确认告警
  const handleAcknowledge = async (alertId: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/alerts/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'acknowledged' }),
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: '确认成功',
          description: '告警已确认',
        });
        loadAlerts();
      } else {
        toast({
          title: '确认失败',
          description: data.error || '操作失败',
          variant: 'error' as const,
        });
      }
    } catch (error) {
      toast({
        title: '确认失败',
        description: '网络错误',
        variant: 'error' as const,
      });
    } finally {
      setActionLoading(false);
      setShowConfirmDialog(false);
    }
  };

  // 全部确认
  const handleAcknowledgeAll = async () => {
    const unacknowledged = alerts.filter(a => a.status === 'active');
    if (unacknowledged.length === 0) {
      toast({
        title: '提示',
        description: '没有需要确认的告警',
      });
      return;
    }

    try {
      setActionLoading(true);
      // 批量确认
      await Promise.all(
        unacknowledged.map(alert =>
          fetch(`/api/admin/alerts/${alert.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'acknowledged' }),
          })
        )
      );
      toast({
        title: '确认成功',
        description: `已确认 ${unacknowledged.length} 条告警`,
      });
      loadAlerts();
    } catch (error) {
      toast({
        title: '确认失败',
        description: '部分告警确认失败',
        variant: 'error' as const,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 筛选告警
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.device_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      alert.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || alert.alert_type === typeFilter;
    const matchesLevel = levelFilter === 'all' || alert.alert_level === levelFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    return matchesSearch && matchesType && matchesLevel && matchesStatus;
  });

  // 统计数据
  const criticalAlerts = alerts.filter((a) => a.alert_level === 'critical').length;
  const warningAlerts = alerts.filter((a) => a.alert_level === 'warning').length;
  const unacknowledged = alerts.filter((a) => a.status === 'active').length;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return { bg: 'bg-[#EF4444]/20', text: 'text-[#EF4444]', label: '严重' };
      case 'warning':
        return { bg: 'bg-[#F97316]/20', text: 'text-[#F97316]', label: '警告' };
      case 'info':
        return { bg: 'bg-[#3B82F6]/20', text: 'text-[#3B82F6]', label: '信息' };
      default:
        return { bg: 'bg-[#64748B]/20', text: 'text-[#64748B]', label: '未知' };
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      temperature: '温度',
      pressure: '压力',
      offline: '离线',
      fault: '故障',
      vibration: '振动',
      humidity: '湿度',
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">告警中心</h1>
          <p className="text-sm text-[#64748B]">
            实时监控设备告警，快速响应处理
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#1E3A5F] text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
            onClick={loadAlerts}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            刷新
          </Button>
          <Button
            className="bg-[#2563EB] hover:bg-[#2563EB]/90"
            onClick={handleAcknowledgeAll}
            disabled={actionLoading || unacknowledged === 0}
          >
            {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            全部确认 ({unacknowledged})
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">总告警数</div>
                <div className="text-2xl font-bold text-white">{alerts.length}</div>
              </div>
              <Bell className="h-8 w-8 text-[#3B82F6]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">严重告警</div>
                <div className="text-2xl font-bold text-[#EF4444]">{criticalAlerts}</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-[#EF4444]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">警告告警</div>
                <div className="text-2xl font-bold text-[#F97316]">{warningAlerts}</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-[#F97316]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">未确认</div>
                <div className="text-2xl font-bold text-[#F97316]">{unacknowledged}</div>
              </div>
              <Clock className="h-8 w-8 text-[#F97316]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <Input
                  placeholder="搜索设备名称或消息..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-[#1E3A5F] bg-[#0A1628] pl-10 text-white placeholder:text-[#64748B]"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32 border-[#1E3A5F] bg-[#0A1628] text-white">
                  <SelectValue placeholder="告警类型" />
                </SelectTrigger>
                <SelectContent className="border-[#1E3A5F] bg-[#0A1628] text-white">
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="temperature">温度</SelectItem>
                  <SelectItem value="pressure">压力</SelectItem>
                  <SelectItem value="offline">离线</SelectItem>
                  <SelectItem value="fault">故障</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32 border-[#1E3A5F] bg-[#0A1628] text-white">
                  <SelectValue placeholder="告警级别" />
                </SelectTrigger>
                <SelectContent className="border-[#1E3A5F] bg-[#0A1628] text-white">
                  <SelectItem value="all">全部级别</SelectItem>
                  <SelectItem value="critical">严重</SelectItem>
                  <SelectItem value="warning">警告</SelectItem>
                  <SelectItem value="info">信息</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 border-[#1E3A5F] bg-[#0A1628] text-white">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent className="border-[#1E3A5F] bg-[#0A1628] text-white">
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">未确认</SelectItem>
                  <SelectItem value="acknowledged">已确认</SelectItem>
                  <SelectItem value="resolved">已解决</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      {loading ? (
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#64748B]" />
            <p className="mt-4 text-[#64748B]">加载中...</p>
          </CardContent>
        </Card>
      ) : filteredAlerts.length === 0 ? (
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 mx-auto text-[#64748B]" />
            <p className="mt-4 text-[#94A3B8]">
              {alerts.length === 0 ? '暂无告警数据' : '没有符合筛选条件的告警'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const levelStyle = getLevelColor(alert.alert_level);
            return (
              <Card
                key={alert.id}
                className="border-[#1E3A5F] bg-[#1E3A5F]/30 hover:bg-[#1E3A5F]/40 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 rounded-full p-2 ${levelStyle.bg}`}>
                        <Bell className={`h-4 w-4 ${levelStyle.text}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white">
                            {alert.device_name || '未知设备'}
                          </span>
                          <Badge variant="outline" className={`border-0 ${levelStyle.bg} ${levelStyle.text}`}>
                            {levelStyle.label}
                          </Badge>
                          <Badge variant="outline" className="border-[#1E3A5F] text-[#94A3B8]">
                            {getTypeLabel(alert.alert_type)}
                          </Badge>
                          {alert.status === 'acknowledged' && (
                            <Badge className="bg-[#22C55E]/20 text-[#22C55E] border-0">
                              已确认
                            </Badge>
                          )}
                          {alert.status === 'resolved' && (
                            <Badge className="bg-[#3B82F6]/20 text-[#3B82F6] border-0">
                              已解决
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-white">
                          {alert.title}
                        </div>
                        <div className="mt-1 text-sm text-[#94A3B8]">
                          {alert.message}
                        </div>
                        <div className="mt-2 text-xs text-[#64748B]">
                          {new Date(alert.created_at).toLocaleString()}
                          {alert.vendor_name && ` · ${alert.vendor_name}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {alert.status === 'active' && (
                        <Button
                          size="sm"
                          className="bg-[#2563EB] hover:bg-[#2563EB]/90"
                          onClick={() => {
                            setSelectedAlert(alert);
                            setShowConfirmDialog(true);
                          }}
                        >
                          确认
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#1E3A5F] text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
                        onClick={() => {
                          setSelectedAlert(alert);
                          setShowDetailDialog(true);
                        }}
                      >
                        详情
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 确认对话框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="border-[#1E3A5F] bg-[#0A1628] text-white">
          <DialogHeader>
            <DialogTitle>确认告警</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              确认后将标记此告警为已处理状态
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="py-4 space-y-2">
              <p className="text-sm"><span className="text-[#94A3B8]">设备：</span>{selectedAlert.device_name}</p>
              <p className="text-sm"><span className="text-[#94A3B8]">告警：</span>{selectedAlert.title}</p>
              <p className="text-sm"><span className="text-[#94A3B8]">消息：</span>{selectedAlert.message}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="border-[#1E3A5F] text-[#94A3B8]">
              取消
            </Button>
            <Button onClick={() => handleAcknowledge(selectedAlert?.id || '')} disabled={actionLoading} className="bg-[#2563EB] hover:bg-[#2563EB]/90">
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 详情对话框 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="border-[#1E3A5F] bg-[#0A1628] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>告警详情</DialogTitle>
          </DialogHeader>
          {selectedAlert && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#64748B]">设备名称</p>
                  <p className="text-sm text-white">{selectedAlert.device_name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">设备序列号</p>
                  <p className="text-sm text-white">{selectedAlert.device_serial || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">告警类型</p>
                  <p className="text-sm text-white">{getTypeLabel(selectedAlert.alert_type)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">告警级别</p>
                  <p className="text-sm text-white">{getLevelColor(selectedAlert.alert_level).label}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">状态</p>
                  <p className="text-sm text-white">
                    {selectedAlert.status === 'active' ? '未确认' :
                     selectedAlert.status === 'acknowledged' ? '已确认' : '已解决'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">所属厂家</p>
                  <p className="text-sm text-white">{selectedAlert.vendor_name || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">告警标题</p>
                <p className="text-sm text-white">{selectedAlert.title}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">告警内容</p>
                <p className="text-sm text-white">{selectedAlert.message}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">发生时间</p>
                <p className="text-sm text-white">{new Date(selectedAlert.created_at).toLocaleString()}</p>
              </div>
              {selectedAlert.acknowledged_at && (
                <div>
                  <p className="text-xs text-[#64748B]">确认时间</p>
                  <p className="text-sm text-white">{new Date(selectedAlert.acknowledged_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)} className="border-[#1E3A5F] text-[#94A3B8]">
              关闭
            </Button>
            {selectedAlert?.status === 'active' && (
              <Button
                onClick={() => {
                  setShowDetailDialog(false);
                  setShowConfirmDialog(true);
                }}
                className="bg-[#2563EB] hover:bg-[#2563EB]/90"
              >
                确认告警
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
