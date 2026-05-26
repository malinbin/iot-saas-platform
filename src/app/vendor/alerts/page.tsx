'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, Search, Bell, Clock, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  deviceName: string;
  deviceSn: string;
  type: 'fault' | 'warning' | 'offline';
  message: string;
  level: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'resolved';
  createdAt: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    deviceName: 'CNC加工中心-01',
    deviceSn: 'SN202401001',
    type: 'fault',
    message: '主轴温度过高，超过85°C',
    level: 'high',
    status: 'pending',
    createdAt: '2024-01-15 14:30:00',
  },
  {
    id: '2',
    deviceName: '激光切割机-03',
    deviceSn: 'SN202401015',
    type: 'warning',
    message: '激光功率下降15%，建议检查镜片',
    level: 'medium',
    status: 'processing',
    createdAt: '2024-01-15 13:45:00',
  },
  {
    id: '3',
    deviceName: '注塑机-02',
    deviceSn: 'SN202401008',
    type: 'offline',
    message: '设备离线超过30分钟',
    level: 'low',
    status: 'pending',
    createdAt: '2024-01-15 12:00:00',
  },
  {
    id: '4',
    deviceName: '冲压机-01',
    deviceSn: 'SN202401012',
    type: 'fault',
    message: '液压系统压力异常',
    level: 'high',
    status: 'resolved',
    createdAt: '2024-01-15 10:20:00',
  },
];

const levelColors = {
  high: 'bg-[#FEE2E2] text-[#DC2626]',
  medium: 'bg-[#FEF3C7] text-[#D97706]',
  low: 'bg-[#DBEAFE] text-[#2563EB]',
};

const statusColors = {
  pending: 'bg-[#FEE2E2] text-[#DC2626]',
  processing: 'bg-[#FEF3C7] text-[#D97706]',
  resolved: 'bg-[#DCFCE7] text-[#16A34A]',
};

const typeIcons = {
  fault: '🔴',
  warning: '🟡',
  offline: '⚫',
};

export default function VendorAlertsPage() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [alerts] = useState<Alert[]>(mockAlerts);

  const filteredAlerts = alerts.filter(a => {
    const matchSearch = a.deviceName.includes(search) || a.message.includes(search);
    const matchLevel = levelFilter === 'all' || a.level === levelFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchLevel && matchStatus;
  });

  const stats = {
    total: alerts.length,
    pending: alerts.filter(a => a.status === 'pending').length,
    high: alerts.filter(a => a.level === 'high').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1E293B]">告警中心</h1>
          <p className="text-sm text-[#64748B]">管理旗下设备的告警信息</p>
        </div>
        <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">
          <Bell className="mr-2 h-4 w-4" />
          全部已读
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">总告警数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1E293B]">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">待处理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#DC2626]">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">高优先级</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F97316]">{stats.high}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">已解决</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="border-[#E2E8F0]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                placeholder="搜索设备名称或告警内容..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="告警级别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部级别</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="处理状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="processing">处理中</SelectItem>
                <SelectItem value="resolved">已解决</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-[#E2E8F0]">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>告警信息</TableHead>
                <TableHead>设备</TableHead>
                <TableHead>级别</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{typeIcons[alert.type]}</span>
                      <div>
                        <div className="font-medium text-[#1E293B]">{alert.message}</div>
                        <div className="text-sm text-[#64748B]">
                          {alert.type === 'fault' ? '故障' : alert.type === 'warning' ? '警告' : '离线'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-[#1E293B]">{alert.deviceName}</div>
                      <div className="text-[#64748B]">{alert.deviceSn}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={levelColors[alert.level]}>
                      {alert.level === 'high' ? '高' : alert.level === 'medium' ? '中' : '低'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[alert.status]}>
                      {alert.status === 'pending' ? '待处理' : 
                       alert.status === 'processing' ? '处理中' : '已解决'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-[#64748B]">
                      <Clock className="h-3 w-3" />
                      {alert.createdAt}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {alert.status !== 'resolved' && (
                        <Button variant="ghost" size="sm" className="text-[#22C55E]">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-[#2563EB]">
                        详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
