'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Box,
  Activity,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { generateVendors, generateDevices } from '@/lib/mock-data';

export default function DevicesPage() {
  const vendors = generateVendors();
  const devices = generateDevices(100, vendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 筛选设备
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 统计数据
  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const offlineDevices = devices.filter((d) => d.status === 'offline').length;
  const faultDevices = devices.filter((d) => d.status === 'fault').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <Badge className="bg-[#22C55E]/20 text-[#22C55E] border-0">
            在线
          </Badge>
        );
      case 'offline':
        return (
          <Badge className="bg-[#64748B]/20 text-[#64748B] border-0">
            离线
          </Badge>
        );
      case 'fault':
        return (
          <Badge className="bg-[#EF4444]/20 text-[#EF4444] border-0">
            故障
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-[#F97316]/20 text-[#F97316] border-0">
            告警
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">设备管理</h1>
          <p className="text-sm text-[#64748B]">
            查看和管理所有接入平台的设备
          </p>
        </div>
        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
          <Download className="mr-2 h-4 w-4" />
          导出设备
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">总设备数</div>
                <div className="text-2xl font-bold text-white">
                  {totalDevices}
                </div>
              </div>
              <Box className="h-8 w-8 text-[#2563EB]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">在线设备</div>
                <div className="text-2xl font-bold text-[#22C55E]">
                  {onlineDevices}
                </div>
              </div>
              <Activity className="h-8 w-8 text-[#22C55E]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">离线设备</div>
                <div className="text-2xl font-bold text-[#64748B]">
                  {offlineDevices}
                </div>
              </div>
              <Activity className="h-8 w-8 text-[#64748B]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">故障设备</div>
                <div className="text-2xl font-bold text-[#EF4444]">
                  {faultDevices}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-[#EF4444]" />
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
                  placeholder="搜索设备名称或厂家..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-[#1E3A5F] bg-[#0A1628] pl-10 text-white placeholder:text-[#64748B]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-[#1E3A5F] bg-[#0A1628] text-white">
                  <Filter className="mr-2 h-4 w-4 text-[#64748B]" />
                  <SelectValue placeholder="筛选状态" />
                </SelectTrigger>
                <SelectContent className="border-[#1E3A5F] bg-[#0A1628] text-white">
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="online">在线</SelectItem>
                  <SelectItem value="offline">离线</SelectItem>
                  <SelectItem value="fault">故障</SelectItem>
                  <SelectItem value="warning">告警</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-[#1E3A5F] text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
              >
                批量操作
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Devices Table */}
      <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
        <CardHeader>
          <CardTitle className="text-white">
            设备列表（共 {filteredDevices.length} 台）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#1E3A5F] hover:bg-[#0A1628]">
                <TableHead className="text-[#64748B]">设备名称</TableHead>
                <TableHead className="text-[#64748B]">型号</TableHead>
                <TableHead className="text-[#64748B]">厂家</TableHead>
                <TableHead className="text-[#64748B]">位置</TableHead>
                <TableHead className="text-[#64748B]">状态</TableHead>
                <TableHead className="text-[#64748B]">最后在线</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.slice(0, 20).map((device) => (
                <TableRow
                  key={device.id}
                  className="border-[#1E3A5F] hover:bg-[#0A1628]"
                >
                  <TableCell className="font-medium text-white">
                    {device.name}
                  </TableCell>
                  <TableCell className="text-[#94A3B8]">{device.model}</TableCell>
                  <TableCell className="text-[#94A3B8]">
                    {device.vendorName}
                  </TableCell>
                  <TableCell className="text-[#94A3B8]">
                    {device.location}
                  </TableCell>
                  <TableCell>{getStatusBadge(device.status)}</TableCell>
                  <TableCell className="text-[#94A3B8]">
                    {device.lastOnline.toLocaleDateString()}
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
