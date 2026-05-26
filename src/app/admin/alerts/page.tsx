'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Bell,
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
import { generateVendors, generateDevices, generateAlerts } from '@/lib/mock-data';

export default function AlertsPage() {
  const vendors = generateVendors();
  const devices = generateDevices(100, vendors);
  const alerts = generateAlerts(devices);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // 筛选告警
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.deviceName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // 统计数据
  const faultAlerts = alerts.filter((a) => a.type === 'fault').length;
  const warningAlerts = alerts.filter((a) => a.type === 'warning').length;
  const unacknowledged = alerts.filter((a) => !a.acknowledged).length;

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
        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
          <CheckCircle className="mr-2 h-4 w-4" />
          全部确认
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">故障告警</div>
                <div className="text-2xl font-bold text-[#EF4444]">
                  {faultAlerts}
                </div>
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
                <div className="text-2xl font-bold text-[#F97316]">
                  {warningAlerts}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-[#F97316]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">未确认告警</div>
                <div className="text-2xl font-bold text-[#F97316]">
                  {unacknowledged}
                </div>
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
                  placeholder="搜索设备名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-[#1E3A5F] bg-[#0A1628] pl-10 text-white placeholder:text-[#64748B]"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 border-[#1E3A5F] bg-[#0A1628] text-white">
                  <Filter className="mr-2 h-4 w-4 text-[#64748B]" />
                  <SelectValue placeholder="筛选类型" />
                </SelectTrigger>
                <SelectContent className="border-[#1E3A5F] bg-[#0A1628] text-white">
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="fault">故障</SelectItem>
                  <SelectItem value="warning">警告</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.slice(0, 20).map((alert) => (
          <Card
            key={alert.id}
            className="border-[#1E3A5F] bg-[#1E3A5F]/30 hover:bg-[#1E3A5F]/40 transition-colors"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 rounded-full p-2 ${
                      alert.type === 'fault'
                        ? 'bg-[#EF4444]/20'
                        : 'bg-[#F97316]/20'
                    }`}
                  >
                    <Bell
                      className={`h-4 w-4 ${
                        alert.type === 'fault'
                          ? 'text-[#EF4444]'
                          : 'text-[#F97316]'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        {alert.deviceName}
                      </span>
                      <Badge
                        variant="outline"
                        className={`border-0 ${
                          alert.type === 'fault'
                            ? 'bg-[#EF4444]/20 text-[#EF4444]'
                            : 'bg-[#F97316]/20 text-[#F97316]'
                        }`}
                      >
                        {alert.type === 'fault' ? '故障' : '警告'}
                      </Badge>
                      {alert.acknowledged && (
                        <Badge className="bg-[#22C55E]/20 text-[#22C55E] border-0">
                          已确认
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-[#94A3B8]">
                      {alert.message}
                    </div>
                    <div className="mt-2 text-xs text-[#64748B]">
                      {alert.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      className="bg-[#2563EB] hover:bg-[#2563EB]/90"
                    >
                      确认
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#1E3A5F] text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
                  >
                    详情
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
