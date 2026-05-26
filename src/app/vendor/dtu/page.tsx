'use client';

import { useEffect, useState } from 'react';
import { Cpu, Plus, RefreshCw, Save, Power } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface DtuConfig {
  id: string;
  deviceName: string;
  deviceCode: string;
  protocol: string;
  server: string;
  port: number;
  interval: number;
  isActive: boolean;
  lastOnline: string | null;
}

export default function VendorDtuPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dtuConfigs, setDtuConfigs] = useState<DtuConfig[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    deviceName: '',
    deviceCode: '',
    protocol: 'mqtt',
    server: '',
    port: '1883',
    interval: '30',
  });

  const fetchDtuConfigs = async () => {
    try {
      const response = await fetch('/api/vendor/dtu');
      const result = await response.json();
      
      if (result.success) {
        setDtuConfigs(result.data);
      }
    } catch (error) {
      console.error('Fetch DTU configs error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDtuConfigs();
  }, []);

  const handleSave = async () => {
    if (!formData.deviceName || !formData.server) {
      toast({
        title: '请填写完整信息',
        variant: 'error',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/vendor/dtu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          port: parseInt(formData.port),
          interval: parseInt(formData.interval),
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'DTU配置已保存',
        });
        setDialogOpen(false);
        fetchDtuConfigs();
        setFormData({
          deviceName: '',
          deviceCode: '',
          protocol: 'mqtt',
          server: '',
          port: '1883',
          interval: '30',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: '保存失败',
        description: String(error),
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const getProtocolBadge = (protocol: string) => {
    switch (protocol) {
      case 'mqtt':
        return <Badge className="bg-[#22C55E]">MQTT</Badge>;
      case 'http':
        return <Badge className="bg-[#3B82F6]">HTTP</Badge>;
      case 'tcp':
        return <Badge className="bg-[#8B5CF6]">TCP</Badge>;
      default:
        return <Badge variant="outline">{protocol}</Badge>;
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
          <h1 className="text-2xl font-bold text-[#1E293B]">DTU配置</h1>
          <p className="text-sm text-[#64748B]">
            配置设备数据上报通信参数
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchDtuConfigs} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                <Plus className="h-4 w-4 mr-2" />
                添加配置
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加DTU配置</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>设备名称</Label>
                  <Input
                    value={formData.deviceName}
                    onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                    placeholder="输入设备名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label>设备编号</Label>
                  <Input
                    value={formData.deviceCode}
                    onChange={(e) => setFormData({ ...formData, deviceCode: e.target.value })}
                    placeholder="输入设备编号"
                  />
                </div>
                <div className="space-y-2">
                  <Label>通信协议</Label>
                  <Select value={formData.protocol} onValueChange={(v) => setFormData({ ...formData, protocol: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mqtt">MQTT</SelectItem>
                      <SelectItem value="http">HTTP</SelectItem>
                      <SelectItem value="tcp">TCP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>服务器地址</Label>
                    <Input
                      value={formData.server}
                      onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                      placeholder="mqtt.example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>端口</Label>
                    <Input
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                      placeholder="1883"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>上报间隔（秒）</Label>
                  <Input
                    value={formData.interval}
                    onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                    placeholder="30"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  保存
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* DTU Table */}
      <Card className="border-[#E2E8F0] bg-white">
        <CardHeader>
          <CardTitle className="text-lg text-[#1E293B]">DTU配置列表</CardTitle>
        </CardHeader>
        <CardContent>
          {dtuConfigs.length === 0 ? (
            <div className="text-center py-10 text-[#64748B]">
              <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无DTU配置</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>设备</TableHead>
                  <TableHead>协议</TableHead>
                  <TableHead>服务器</TableHead>
                  <TableHead>端口</TableHead>
                  <TableHead>上报间隔</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>最后在线</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dtuConfigs.map((dtu) => (
                  <TableRow key={dtu.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{dtu.deviceName}</div>
                        <div className="text-xs text-[#64748B]">{dtu.deviceCode}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getProtocolBadge(dtu.protocol)}</TableCell>
                    <TableCell>{dtu.server}</TableCell>
                    <TableCell>{dtu.port}</TableCell>
                    <TableCell>{dtu.interval}秒</TableCell>
                    <TableCell>
                      <Badge className={dtu.isActive ? 'bg-[#22C55E]' : 'bg-[#64748B]'}>
                        {dtu.isActive ? '在线' : '离线'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#64748B]">
                      {dtu.lastOnline ? new Date(dtu.lastOnline).toLocaleString() : '-'}
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
