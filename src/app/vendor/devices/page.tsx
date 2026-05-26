'use client';

import { useState } from 'react';
import {
  Box,
  Activity,
  AlertTriangle,
  Power,
  Settings,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { generateVendors, generateDevices } from '@/lib/mock-data';

export default function VendorDevicesPage() {
  const vendors = generateVendors();
  const devices = generateDevices(50, [vendors[0]]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [controlDialogOpen, setControlDialogOpen] = useState(false);
  const [monitorDialogOpen, setMonitorDialogOpen] = useState(false);

  // 筛选
  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 统计
  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const faultDevices = devices.filter((d) => d.status === 'fault').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20">
            在线
          </Badge>
        );
      case 'offline':
        return (
          <Badge className="bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]/20">
            离线
          </Badge>
        );
      case 'fault':
        return (
          <Badge className="bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20">
            故障
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20">
            告警
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">设备管理</h1>
          <p className="text-sm text-[#64748B]">
            管理旗下所有设备，支持远程运维
          </p>
        </div>
        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
          <Box className="mr-2 h-4 w-4" />
          添加设备
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-[#E2E8F0] bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">设备总数</div>
                <div className="text-2xl font-bold text-[#1E293B]">
                  {totalDevices}
                </div>
              </div>
              <Box className="h-6 w-6 text-[#2563EB]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E2E8F0] bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">在线设备</div>
                <div className="text-2xl font-bold text-[#22C55E]">
                  {onlineDevices}
                </div>
              </div>
              <Activity className="h-6 w-6 text-[#22C55E]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E2E8F0] bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">故障设备</div>
                <div className="text-2xl font-bold text-[#EF4444]">
                  {faultDevices}
                </div>
              </div>
              <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="border-[#E2E8F0] bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                placeholder="搜索设备名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4 text-[#94A3B8]" />
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="online">在线</SelectItem>
                <SelectItem value="offline">离线</SelectItem>
                <SelectItem value="fault">故障</SelectItem>
                <SelectItem value="warning">告警</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Devices Table */}
      <Card className="border-[#E2E8F0] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#1E293B]">
            设备列表（共 {filteredDevices.length} 台）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[#64748B]">设备名称</TableHead>
                <TableHead className="text-[#64748B]">型号</TableHead>
                <TableHead className="text-[#64748B]">位置</TableHead>
                <TableHead className="text-[#64748B]">状态</TableHead>
                <TableHead className="text-[#64748B]">温度</TableHead>
                <TableHead className="text-[#64748B]">效率</TableHead>
                <TableHead className="text-[#64748B]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.slice(0, 15).map((device) => (
                <TableRow key={device.id} className="hover:bg-[#F8FAFC]">
                  <TableCell className="font-medium text-[#1E293B]">
                    {device.name}
                  </TableCell>
                  <TableCell className="text-[#64748B]">{device.model}</TableCell>
                  <TableCell className="text-[#64748B]">
                    {device.location}
                  </TableCell>
                  <TableCell>{getStatusBadge(device.status)}</TableCell>
                  <TableCell className="text-[#64748B]">
                    {device.metrics.temperature}°C
                  </TableCell>
                  <TableCell className="text-[#64748B]">
                    {device.metrics.efficiency}%
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-[#2563EB] hover:bg-[#2563EB]/10"
                        onClick={() => {
                          setSelectedDevice(device.id);
                          setMonitorDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-[#22C55E] hover:bg-[#22C55E]/10"
                        onClick={() => {
                          setSelectedDevice(device.id);
                          setControlDialogOpen(true);
                        }}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            设备设置
                          </DropdownMenuItem>
                          <DropdownMenuItem>查看详情</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monitor Dialog */}
      <Dialog open={monitorDialogOpen} onOpenChange={setMonitorDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>实时数据监控</DialogTitle>
            <DialogDescription className="text-[#64748B]">
              设备 {selectedDevice} 的实时运行数据
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-[#E2E8F0] bg-[#F8FAFC]">
              <CardContent className="pt-6">
                <div className="text-sm text-[#64748B]">温度</div>
                <div className="text-2xl font-bold text-[#1E293B]">45.2°C</div>
              </CardContent>
            </Card>
            <Card className="border-[#E2E8F0] bg-[#F8FAFC]">
              <CardContent className="pt-6">
                <div className="text-sm text-[#64748B]">湿度</div>
                <div className="text-2xl font-bold text-[#1E293B]">62.5%</div>
              </CardContent>
            </Card>
            <Card className="border-[#E2E8F0] bg-[#F8FAFC]">
              <CardContent className="pt-6">
                <div className="text-sm text-[#64748B]">功率</div>
                <div className="text-2xl font-bold text-[#1E293B]">456W</div>
              </CardContent>
            </Card>
            <Card className="border-[#E2E8F0] bg-[#F8FAFC]">
              <CardContent className="pt-6">
                <div className="text-sm text-[#64748B]">运行效率</div>
                <div className="text-2xl font-bold text-[#22C55E]">92.3%</div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMonitorDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Control Dialog */}
      <Dialog open={controlDialogOpen} onOpenChange={setControlDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>远程控制</DialogTitle>
            <DialogDescription className="text-[#64748B]">
              确认要远程启停设备 {selectedDevice} 吗？
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-4">
            <Button className="flex-1 bg-[#22C55E] hover:bg-[#22C55E]/90">
              <Power className="mr-2 h-4 w-4" />
              启动设备
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
            >
              <Power className="mr-2 h-4 w-4" />
              停止设备
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setControlDialogOpen(false)}
            >
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
