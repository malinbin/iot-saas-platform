'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface Alert {
  id: string;
  deviceName: string;
  deviceCode: string;
  level: string;
  type: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function VendorAlertsPage() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [levelFilter, setLevelFilter] = useState('all');

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/vendor/alerts');
      const result = await response.json();
      
      if (result.success) {
        setAlerts(result.data);
      }
    } catch (error) {
      console.error('Fetch alerts error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (levelFilter === 'all') return true;
    return alert.level === levelFilter;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-[#EF4444]';
      case 'warning': return 'bg-[#F59E0B]';
      case 'info': return 'bg-[#3B82F6]';
      default: return 'bg-[#64748B]';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return <Badge className="bg-[#EF4444]">严重</Badge>;
      case 'warning':
        return <Badge className="bg-[#F59E0B]">警告</Badge>;
      case 'info':
        return <Badge className="bg-[#3B82F6]">提示</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const handleMarkHandled = async (alertId: string) => {
    try {
      // TODO: 调用API标记告警已处理
      setAlerts(alerts.map(a => 
        a.id === alertId ? { ...a, status: 'handled' } : a
      ));
    } catch (error) {
      console.error('Mark handled error:', error);
    }
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
          <h1 className="text-2xl font-bold text-[#1E293B]">告警中心</h1>
          <p className="text-sm text-[#64748B]">
            共 {alerts.length} 条告警
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="告警级别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="critical">严重</SelectItem>
              <SelectItem value="warning">警告</SelectItem>
              <SelectItem value="info">提示</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAlerts} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
        </div>
      </div>

      {/* Alert Table */}
      <Card className="border-[#E2E8F0] bg-white">
        <CardHeader>
          <CardTitle className="text-lg text-[#1E293B]">告警列表</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-10 text-[#64748B]">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无告警数据</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>设备</TableHead>
                  <TableHead>告警级别</TableHead>
                  <TableHead>告警类型</TableHead>
                  <TableHead>告警信息</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{alert.deviceName}</div>
                        <div className="text-xs text-[#64748B]">{alert.deviceCode}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getLevelBadge(alert.level)}</TableCell>
                    <TableCell>{alert.type}</TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>
                      <Badge variant={alert.status === 'active' ? 'destructive' : 'outline'}>
                        {alert.status === 'active' ? '未处理' : '已处理'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#64748B]">
                      {new Date(alert.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {alert.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkHandled(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          处理
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
