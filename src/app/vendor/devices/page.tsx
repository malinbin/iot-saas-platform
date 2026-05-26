'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Plus,
  Cpu,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Device {
  id: string;
  name: string;
  sn: string;
  type: string;
  status: 'online' | 'offline' | 'fault';
  location: string;
  customer: string;
  lastUpdate: string;
  alerts: number;
}

const mockDevices: Device[] = [
  {
    id: '1',
    name: 'CNC加工中心-01',
    sn: 'SN202401001',
    type: 'CNC加工中心',
    status: 'online',
    location: '华东机械-A车间',
    customer: '华东机械制造厂',
    lastUpdate: '2024-01-15 14:30:00',
    alerts: 0,
  },
  {
    id: '2',
    name: '激光切割机-03',
    sn: 'SN202401015',
    type: '激光切割机',
    status: 'online',
    location: '华东机械-B车间',
    customer: '华东机械制造厂',
    lastUpdate: '2024-01-15 14:28:00',
    alerts: 1,
  },
  {
    id: '3',
    name: '注塑机-02',
    sn: 'SN202401008',
    type: '注塑机',
    status: 'offline',
    location: '南方精密-1号车间',
    customer: '南方精密加工',
    lastUpdate: '2024-01-15 12:00:00',
    alerts: 0,
  },
  {
    id: '4',
    name: '冲压机-01',
    sn: 'SN202401012',
    type: '冲压机',
    status: 'fault',
    location: '北方重工-主车间',
    customer: '北方重工集团',
    lastUpdate: '2024-01-15 14:15:00',
    alerts: 2,
  },
];

const statusColors = {
  online: 'bg-[#DCFCE7] text-[#16A34A]',
  offline: 'bg-[#FEE2E2] text-[#DC2626]',
  fault: 'bg-[#FEF3C7] text-[#D97706]',
};

const statusLabels = {
  online: '在线',
  offline: '离线',
  fault: '故障',
};

export default function VendorDevicesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: '',
    sn: '',
    location: '',
    customer: '',
    description: '',
  });

  const filteredDevices = devices.filter(d => {
    const matchSearch = d.name.includes(search) || d.sn.includes(search);
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    fault: devices.filter(d => d.status === 'fault').length,
  };

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.type || !newDevice.sn) {
      toast({
        title: '请填写完整信息',
        description: '设备名称、类型和序列号为必填项',
        variant: 'error',
      });
      return;
    }

    const device: Device = {
      id: String(devices.length + 1),
      name: newDevice.name,
      sn: newDevice.sn,
      type: newDevice.type,
      status: 'offline',
      location: newDevice.location || '未设置',
      customer: newDevice.customer || '未分配',
      lastUpdate: new Date().toLocaleString(),
      alerts: 0,
    };

    setDevices([...devices, device]);
    setAddDialogOpen(false);
    setNewDevice({
      name: '',
      type: '',
      sn: '',
      location: '',
      customer: '',
      description: '',
    });
    toast({
      title: '设备添加成功',
      description: `设备 ${device.name} 已添加到系统`,
    });
  };

  const handleDTUConfig = (deviceId: string) => {
    router.push(`/vendor/dtu?device=${deviceId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1E293B]">设备管理</h1>
          <p className="text-sm text-[#64748B]">管理旗下所有设备</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-[#E2E8F0]"
            onClick={() => router.push('/vendor/dtu')}
          >
            <Cpu className="mr-2 h-4 w-4" />
            DTU配置
          </Button>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">
                <Plus className="mr-2 h-4 w-4" />
                添加设备
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>添加新设备</DialogTitle>
                <DialogDescription>
                  填写设备信息，添加后可在DTU配置中设置通信参数
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">设备名称 *</Label>
                  <Input
                    id="name"
                    placeholder="如：CNC加工中心-01"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">设备类型 *</Label>
                  <Select
                    value={newDevice.type}
                    onValueChange={(v) => setNewDevice({ ...newDevice, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择设备类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CNC加工中心">CNC加工中心</SelectItem>
                      <SelectItem value="激光切割机">激光切割机</SelectItem>
                      <SelectItem value="注塑机">注塑机</SelectItem>
                      <SelectItem value="冲压机">冲压机</SelectItem>
                      <SelectItem value="焊接机器人">焊接机器人</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sn">设备序列号 *</Label>
                  <Input
                    id="sn"
                    placeholder="如：SN202401001"
                    value={newDevice.sn}
                    onChange={(e) => setNewDevice({ ...newDevice, sn: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">安装位置</Label>
                  <Input
                    id="location"
                    placeholder="如：华东机械-A车间"
                    value={newDevice.location}
                    onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customer">所属客户</Label>
                  <Input
                    id="customer"
                    placeholder="如：华东机械制造厂"
                    value={newDevice.customer}
                    onChange={(e) => setNewDevice({ ...newDevice, customer: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">备注说明</Label>
                  <Textarea
                    id="description"
                    placeholder="设备备注信息"
                    value={newDevice.description}
                    onChange={(e) => setNewDevice({ ...newDevice, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  取消
                </Button>
                <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]" onClick={handleAddDevice}>
                  添加设备
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">总设备数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1E293B]">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">在线设备</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">{stats.online}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">离线设备</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#DC2626]">{stats.offline}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">故障设备</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F97316]">{stats.fault}</div>
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
                placeholder="搜索设备名称或序列号..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="online">在线</SelectItem>
                <SelectItem value="offline">离线</SelectItem>
                <SelectItem value="fault">故障</SelectItem>
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
                <TableHead>设备信息</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>位置</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>告警</TableHead>
                <TableHead>最后更新</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DBEAFE]">
                        <Box className="h-5 w-5 text-[#2563EB]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#1E293B]">{device.name}</div>
                        <div className="text-sm text-[#64748B]">{device.sn} · {device.type}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[device.status]}>
                      {statusLabels[device.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#64748B]">{device.location}</TableCell>
                  <TableCell className="text-[#64748B]">{device.customer}</TableCell>
                  <TableCell>
                    {device.alerts > 0 ? (
                      <Badge className="bg-[#FEE2E2] text-[#DC2626]">
                        {device.alerts} 条告警
                      </Badge>
                    ) : (
                      <span className="text-[#94A3B8]">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-[#64748B]">{device.lastUpdate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/vendor/monitor?device=${device.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          查看监控
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDTUConfig(device.id)}>
                          <Cpu className="mr-2 h-4 w-4" />
                          DTU配置
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          设备设置
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#DC2626]">
                          <Power className="mr-2 h-4 w-4" />
                          删除设备
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
