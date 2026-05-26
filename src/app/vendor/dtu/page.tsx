'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cpu, 
  Wifi, 
  Server, 
  Save, 
  TestTube,
  CheckCircle,
  XCircle,
  RefreshCw,
  Copy,
  Code,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DTUConfig {
  id: string;
  deviceId: string;
  deviceName: string;
  protocol: 'mqtt' | 'http' | 'tcp';
  status: 'online' | 'offline' | 'error';
  server: string;
  port: string;
  topic?: string;
  interval: number;
  lastData: string;
  createdAt: string;
}

const mockDTUConfigs: DTUConfig[] = [
  {
    id: '1',
    deviceId: '1',
    deviceName: 'CNC加工中心-01',
    protocol: 'mqtt',
    status: 'online',
    server: 'mqtt.iot.example.com',
    port: '1883',
    topic: 'device/SN202401001/data',
    interval: 30,
    lastData: '2024-01-15 14:30:00',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    deviceId: '2',
    deviceName: '激光切割机-03',
    protocol: 'http',
    status: 'online',
    server: 'https://api.iot.example.com',
    port: '443',
    interval: 60,
    lastData: '2024-01-15 14:28:00',
    createdAt: '2024-01-08',
  },
  {
    id: '3',
    deviceId: '3',
    deviceName: '注塑机-02',
    protocol: 'mqtt',
    status: 'offline',
    server: 'mqtt.iot.example.com',
    port: '1883',
    topic: 'device/SN202401008/data',
    interval: 30,
    lastData: '2024-01-15 12:00:00',
    createdAt: '2024-01-05',
  },
];

const statusColors = {
  online: 'bg-[#DCFCE7] text-[#16A34A]',
  offline: 'bg-[#FEE2E2] text-[#DC2626]',
  error: 'bg-[#FEF3C7] text-[#D97706]',
};

const protocolLabels = {
  mqtt: 'MQTT',
  http: 'HTTP/HTTPS',
  tcp: 'TCP/WebSocket',
};

export default function VendorDTUPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [configs, setConfigs] = useState<DTUConfig[]>(mockDTUConfigs);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    protocol: 'mqtt',
    server: '',
    port: '',
    topic: '',
    username: '',
    password: '',
    interval: '30',
    dataFormat: 'json',
  });

  useEffect(() => {
    const deviceId = searchParams.get('device');
    if (deviceId) {
      setSelectedDevice(deviceId);
    }
  }, [searchParams]);

  const handleSaveConfig = () => {
    toast({
      title: '配置保存成功',
      description: 'DTU通信配置已更新',
    });
  };

  const handleTestConnection = () => {
    toast({
      title: '连接测试中...',
      description: '正在测试DTU连接',
    });
    setTimeout(() => {
      toast({
        title: '连接测试成功',
        description: 'DTU已成功连接到服务器',
      });
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: '已复制到剪贴板',
    });
  };

  const sampleCode = `// DTU 数据上报示例 (MQTT)
const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://mqtt.iot.example.com:1883', {
  username: 'your_username',
  password: 'your_password',
  clientId: 'device_SN202401001'
});

client.on('connect', () => {
  console.log('DTU已连接到服务器');
  
  // 定时上报数据
  setInterval(() => {
    const data = {
      device_id: 'SN202401001',
      timestamp: new Date().toISOString(),
      data: {
        temperature: 45.2,
        humidity: 62.5,
        power: 456.8,
        efficiency: 92.3,
        status: 'running'
      }
    };
    
    client.publish('device/SN202401001/data', JSON.stringify(data));
    console.log('数据已上报:', data);
  }, 30000); // 每30秒上报一次
});

client.on('error', (err) => {
  console.error('连接错误:', err);
});`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1E293B]">DTU通信配置</h1>
          <p className="text-sm text-[#64748B]">配置设备DTU通信参数，实现数据上报和远程控制</p>
        </div>
        <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]" onClick={handleTestConnection}>
          <TestTube className="mr-2 h-4 w-4" />
          测试连接
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="bg-[#F1F5F9]">
          <TabsTrigger value="list">DTU列表</TabsTrigger>
          <TabsTrigger value="config">新建配置</TabsTrigger>
          <TabsTrigger value="docs">接入文档</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-[#E2E8F0]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#64748B]">总DTU数量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1E293B]">{configs.length}</div>
              </CardContent>
            </Card>
            <Card className="border-[#E2E8F0]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#64748B]">在线DTU</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#22C55E]">
                  {configs.filter(c => c.status === 'online').length}
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#E2E8F0]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#64748B]">异常DTU</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#F97316]">
                  {configs.filter(c => c.status !== 'online').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="border-[#E2E8F0]">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>设备信息</TableHead>
                    <TableHead>协议</TableHead>
                    <TableHead>服务器</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>上报间隔</TableHead>
                    <TableHead>最后数据</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configs.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DBEAFE]">
                            <Cpu className="h-5 w-5 text-[#2563EB]" />
                          </div>
                          <div>
                            <div className="font-medium text-[#1E293B]">{config.deviceName}</div>
                            <div className="text-sm text-[#64748B]">ID: {config.deviceId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-[#2563EB] text-[#2563EB]">
                          {protocolLabels[config.protocol]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-[#1E293B]">{config.server}</div>
                          <div className="text-[#64748B]">端口: {config.port}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[config.status]}>
                          {config.status === 'online' ? '在线' : config.status === 'offline' ? '离线' : '异常'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#64748B]">{config.interval}秒</TableCell>
                      <TableCell className="text-[#64748B]">{config.lastData}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-[#2563EB]">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-[#2563EB]">
                            配置
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          {/* Protocol Selection */}
          <Card className="border-[#E2E8F0]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-[#2563EB]" />
                <CardTitle className="text-lg text-[#1E293B]">选择通信协议</CardTitle>
              </div>
              <CardDescription>根据DTU设备支持的协议选择对应的通信方式</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { value: 'mqtt', label: 'MQTT', desc: '推荐，实时双向通信', icon: Wifi },
                  { value: 'http', label: 'HTTP/HTTPS', desc: '简单易用，单向上报', icon: Server },
                  { value: 'tcp', label: 'TCP/WebSocket', desc: '长连接，自定义协议', icon: Cpu },
                ].map((p) => (
                  <div
                    key={p.value}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      formData.protocol === p.value
                        ? 'border-[#2563EB] bg-[#DBEAFE]'
                        : 'border-[#E2E8F0] hover:border-[#2563EB]'
                    }`}
                    onClick={() => setFormData({ ...formData, protocol: p.value as 'mqtt' | 'http' | 'tcp' })}
                  >
                    <div className="flex items-center gap-3">
                      <p.icon className={`h-6 w-6 ${formData.protocol === p.value ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                      <div>
                        <div className={`font-medium ${formData.protocol === p.value ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>
                          {p.label}
                        </div>
                        <div className="text-xs text-[#64748B]">{p.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Server Config */}
          <Card className="border-[#E2E8F0]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-[#2563EB]" />
                <CardTitle className="text-lg text-[#1E293B]">服务器配置</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>服务器地址</Label>
                  <Input
                    placeholder={formData.protocol === 'http' ? 'https://api.iot.example.com' : 'mqtt.iot.example.com'}
                    value={formData.server}
                    onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>端口</Label>
                  <Input
                    placeholder={formData.protocol === 'mqtt' ? '1883' : formData.protocol === 'http' ? '443' : '8080'}
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  />
                </div>
              </div>

              {formData.protocol === 'mqtt' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>上报主题 (Topic)</Label>
                    <Input
                      placeholder="device/{device_sn}/data"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>数据上报间隔</Label>
                    <Select
                      value={formData.interval}
                      onValueChange={(v) => setFormData({ ...formData, interval: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10秒</SelectItem>
                        <SelectItem value="30">30秒</SelectItem>
                        <SelectItem value="60">1分钟</SelectItem>
                        <SelectItem value="300">5分钟</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>认证用户名</Label>
                  <Input
                    placeholder="DTU连接用户名"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>认证密码</Label>
                  <Input
                    type="password"
                    placeholder="DTU连接密码"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]" onClick={handleSaveConfig}>
                  <Save className="mr-2 h-4 w-4" />
                  保存配置
                </Button>
                <Button variant="outline" onClick={handleTestConnection}>
                  <TestTube className="mr-2 h-4 w-4" />
                  测试连接
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Format */}
          <Card className="border-[#E2E8F0]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-[#2563EB]" />
                <CardTitle className="text-lg text-[#1E293B]">数据格式</CardTitle>
              </div>
              <CardDescription>DTU上报数据的JSON格式规范</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-[#1E293B] p-4">
                <pre className="text-sm text-white overflow-x-auto">
{`{
  "device_id": "SN202401001",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "temperature": 45.2,    // 温度 (°C)
    "humidity": 62.5,       // 湿度 (%)
    "power": 456.8,         // 功率 (kW)
    "efficiency": 92.3,     // 效率 (%)
    "status": "running"     // 状态
  }
}`}
                </pre>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => copyToClipboard(`{
  "device_id": "SN202401001",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "temperature": 45.2,
    "humidity": 62.5,
    "power": 456.8,
    "efficiency": 92.3,
    "status": "running"
  }
}`)}
              >
                <Copy className="mr-2 h-4 w-4" />
                复制格式模板
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <Card className="border-[#E2E8F0]">
            <CardHeader>
              <CardTitle className="text-lg text-[#1E293B]">DTU接入示例代码</CardTitle>
              <CardDescription>参考以下代码实现DTU数据上报</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-[#1E293B] p-4">
                <pre className="text-sm text-white overflow-x-auto whitespace-pre">
                  {sampleCode}
                </pre>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => copyToClipboard(sampleCode)}
              >
                <Copy className="mr-2 h-4 w-4" />
                复制代码
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[#E2E8F0]">
            <CardHeader>
              <CardTitle className="text-lg text-[#1E293B]">API接口说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-[#E2E8F0] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#DCFCE7] text-[#16A34A]">POST</Badge>
                    <code className="text-sm text-[#1E293B]">/api/v1/device/data</code>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard('https://api.iot.example.com/api/v1/device/data')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-[#64748B]">上报设备实时数据</p>
              </div>

              <div className="rounded-lg border border-[#E2E8F0] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#DBEAFE] text-[#2563EB]">GET</Badge>
                    <code className="text-sm text-[#1E293B]">/api/v1/device/{`{device_id}`}/command</code>
                  </div>
                </div>
                <p className="text-sm text-[#64748B]">获取远程控制指令（DTU轮询）</p>
              </div>

              <div className="rounded-lg border border-[#E2E8F0] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#DCFCE7] text-[#16A34A]">POST</Badge>
                    <code className="text-sm text-[#1E293B]">/api/v1/device/{`{device_id}`}/status</code>
                  </div>
                </div>
                <p className="text-sm text-[#64748B]">更新设备在线状态</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
