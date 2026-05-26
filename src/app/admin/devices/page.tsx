'use client';

import { useEffect, useState } from 'react';
import { Box, RefreshCw, Search } from 'lucide-react';
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

interface Device {
  id: string;
  name: string;
  deviceCode: string;
  status: string;
  location: string;
  createdAt: string;
  template?: {
    name: string;
  };
  vendor?: {
    name: string;
  };
}

export default function AdminDevicesPage() {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [search, setSearch] = useState('');

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/admin/devices');
      const result = await response.json();
      
      if (result.success) {
        setDevices(result.data);
      }
    } catch (error) {
      console.error('Fetch devices error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-[#22C55E]">在线</Badge>;
      case 'offline':
        return <Badge className="bg-[#94A3B8]">离线</Badge>;
      case 'fault':
        return <Badge className="bg-[#EF4444]">故障</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(search.toLowerCase()) ||
    device.deviceCode?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-[#22C55E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">设备管理</h1>
          <p className="text-sm text-[#94A3B8]">
            共 {devices.length} 台设备
          </p>
        </div>
        <Button 
          onClick={fetchDevices}
          className="bg-[#1E3A5F] hover:bg-[#1E3A5F]/80 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          刷新
        </Button>
      </div>

      {/* Device Table */}
      <Card className="bg-[#1E3A5F] border-[#2D4A6F]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white">设备列表</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <Input
                placeholder="搜索设备..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-[#0A1628] border-[#2D4A6F] text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDevices.length === 0 ? (
            <div className="text-center py-10 text-[#94A3B8]">
              <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{search ? '未找到匹配的设备' : '暂无设备数据'}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#2D4A6F] hover:bg-[#2D4A6F]/50">
                  <TableHead className="text-[#94A3B8]">设备名称</TableHead>
                  <TableHead className="text-[#94A3B8]">设备编号</TableHead>
                  <TableHead className="text-[#94A3B8]">所属厂家</TableHead>
                  <TableHead className="text-[#94A3B8]">设备模板</TableHead>
                  <TableHead className="text-[#94A3B8]">位置</TableHead>
                  <TableHead className="text-[#94A3B8]">状态</TableHead>
                  <TableHead className="text-[#94A3B8]">创建时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id} className="border-[#2D4A6F] hover:bg-[#2D4A6F]/50">
                    <TableCell className="font-medium text-white">{device.name}</TableCell>
                    <TableCell className="text-[#94A3B8]">{device.deviceCode || '-'}</TableCell>
                    <TableCell className="text-[#94A3B8]">{device.vendor?.name || '-'}</TableCell>
                    <TableCell className="text-[#94A3B8]">{device.template?.name || '-'}</TableCell>
                    <TableCell className="text-[#94A3B8]">{device.location || '-'}</TableCell>
                    <TableCell>{getStatusBadge(device.status)}</TableCell>
                    <TableCell className="text-sm text-[#94A3B8]">
                      {new Date(device.createdAt).toLocaleDateString()}
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
