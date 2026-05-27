'use client';

import { useState, useEffect } from 'react';
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
  Cog,
  Wrench,
  Thermometer,
  Gauge,
  Zap,
  LayoutTemplate,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  code: string;
  category: string;
  icon?: string;
  description?: string;
  can_create: boolean;
}

interface TemplateField {
  field_key: string;
  field_name: string;
  field_type: string;
  unit?: string;
  default_value?: string;
}

interface Device {
  id: string;
  name: string;
  sn: string;
  type: string;
  template_id?: string;
  template_name?: string;
  status: 'online' | 'offline' | 'fault';
  location: string;
  customer: string;
  lastUpdate: string;
  alerts: number;
  dtu_id?: string;
  dtu_name?: string;
  dtu_device_id?: string;  // DTU的device_id字段
}

interface DTUDevice {
  id: string;
  device_id: string;
  name: string;
  online: boolean;
  signal_strength?: number;
}

const mockDevices: Device[] = [
  {
    id: '1',
    name: '注塑机-01',
    sn: 'SN202401001',
    type: '注塑机',
    template_id: 'tpl_1',
    template_name: '注塑机',
    status: 'online',
    location: '华东机械-A车间',
    customer: '华东机械制造厂',
    lastUpdate: '2024-01-15 14:30:00',
    alerts: 0,
  },
  {
    id: '2',
    name: '数控车床-03',
    sn: 'SN202401015',
    type: '数控车床',
    template_id: 'tpl_2',
    template_name: '数控车床',
    status: 'online',
    location: '华东机械-B车间',
    customer: '华东机械制造厂',
    lastUpdate: '2024-01-15 14:28:00',
    alerts: 1,
  },
  {
    id: '3',
    name: '温湿度传感器-02',
    sn: 'SN202401008',
    type: '温湿度传感器',
    template_id: 'tpl_3',
    template_name: '温湿度传感器',
    status: 'offline',
    location: '南方精密-1号车间',
    customer: '南方精密加工',
    lastUpdate: '2024-01-15 12:00:00',
    alerts: 0,
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
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateFields, setTemplateFields] = useState<TemplateField[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  
  const [newDevice, setNewDevice] = useState({
    name: '',
    sn: '',
    location: '',
    customer: '',
    description: '',
    dtu_id: '',
    dtu_port: '',
  });
  
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [dtuList, setDtuList] = useState<DTUDevice[]>([]);

  // 加载可用模板和DTU列表
  useEffect(() => {
    loadTemplates();
    loadDevices();
    loadDTUList();
  }, []);

  const loadDTUList = async () => {
    try {
      const res = await fetch('/api/dtu/data');
      if (res.ok) {
        const data = await res.json();
        setDtuList(data.data || []);
      }
    } catch (error) {
      console.error('加载DTU列表失败:', error);
    }
  };

  const loadDevices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vendor/devices');
      if (res.ok) {
        const data = await res.json();
        setDevices(data.data || []);
      }
    } catch (error) {
      console.error('加载设备失败:', error);
      toast({ title: '加载失败', description: '无法加载设备列表', variant: 'error' });
    }
    setLoading(false);
  };

  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch('/api/vendor/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('加载模板失败:', error);
      // 使用模拟数据
      setTemplates([
        { id: 'tpl_1', name: '注塑机', code: 'injection_molding', category: '生产设备', icon: 'Cog', can_create: true },
        { id: 'tpl_2', name: '数控车床', code: 'cnc_lathe', category: '生产设备', icon: 'Wrench', can_create: true },
        { id: 'tpl_3', name: '温湿度传感器', code: 'temp_humidity_sensor', category: '检测设备', icon: 'Thermometer', can_create: true },
      ]);
    }
    setLoadingTemplates(false);
  };

  // 选择模板后加载字段
  const handleSelectTemplate = async (template: Template) => {
    setSelectedTemplate(template);
    
    try {
      const res = await fetch(`/api/admin/templates/${template.id}/fields`);
      if (res.ok) {
        const data = await res.json();
        setTemplateFields(data.fields || []);
        
        // 设置默认值
        const defaults: Record<string, string> = {};
        (data.fields || []).forEach((f: TemplateField) => {
          if (f.default_value) {
            defaults[f.field_key] = f.default_value;
          }
        });
        setFieldValues(defaults);
      }
    } catch (error) {
      console.error('加载字段失败:', error);
      // 使用模拟数据
      const mockFields: TemplateField[] = template.code === 'injection_molding' ? [
        { field_key: 'temperature', field_name: '温度', field_type: 'number', unit: '℃' },
        { field_key: 'pressure', field_name: '压力', field_type: 'number', unit: 'MPa' },
        { field_key: 'speed', field_name: '转速', field_type: 'number', unit: 'rpm' },
        { field_key: 'power', field_name: '功率', field_type: 'number', unit: 'kW' },
      ] : template.code === 'cnc_lathe' ? [
        { field_key: 'speed', field_name: '转速', field_type: 'number', unit: 'rpm' },
        { field_key: 'power', field_name: '功率', field_type: 'number', unit: 'kW' },
        { field_key: 'efficiency', field_name: '效率', field_type: 'number', unit: '%' },
      ] : [
        { field_key: 'temperature', field_name: '温度', field_type: 'number', unit: '℃' },
        { field_key: 'humidity', field_name: '湿度', field_type: 'number', unit: '%' },
      ];
      setTemplateFields(mockFields);
    }
    
    // 自动填充设备名称前缀
    if (!newDevice.name) {
      setNewDevice(prev => ({ ...prev, name: `${template.name}-` }));
    }
  };

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

  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.sn || !selectedTemplate) {
      toast({
        title: '请填写完整信息',
        description: '设备名称、序列号和模板为必填项',
        variant: 'error',
      });
      return;
    }

    try {
      const res = await fetch('/api/vendor/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDevice,
          type: selectedTemplate.name,
          template_id: selectedTemplate.id,
          dtu_id: newDevice.dtu_id || null,
          dtu_port: newDevice.dtu_port ? parseInt(newDevice.dtu_port) : null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          title: '设备添加成功',
          description: `设备 ${newDevice.name} 已添加到系统`,
        });
        setAddDialogOpen(false);
        resetForm();
        loadDevices(); // 刷新设备列表
      } else {
        toast({
          title: '添加失败',
          description: data.error || '请稍后重试',
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('添加设备失败:', error);
      toast({
        title: '添加失败',
        description: '网络错误，请稍后重试',
        variant: 'error',
      });
    }
  };

  const resetForm = () => {
    setNewDevice({
      name: '',
      sn: '',
      location: '',
      customer: '',
      description: '',
      dtu_id: '',
      dtu_port: '',
    });
    setSelectedTemplate(null);
    setTemplateFields([]);
    setFieldValues({});
  };

  const handleDTUConfig = (deviceId: string) => {
    router.push(`/vendor/dtu?device=${deviceId}`);
  };

  const getTemplateIcon = (icon?: string) => {
    switch (icon) {
      case 'Cog': return <Cog className="h-5 w-5" />;
      case 'Wrench': return <Wrench className="h-5 w-5" />;
      case 'Thermometer': return <Thermometer className="h-5 w-5" />;
      case 'Gauge': return <Gauge className="h-5 w-5" />;
      case 'Zap': return <Zap className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-slate-500">设备总数</div>
                <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-slate-500">在线设备</div>
                <div className="text-2xl font-bold text-slate-900">{stats.online}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <Power className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-slate-500">离线设备</div>
                <div className="text-2xl font-bold text-slate-900">{stats.offline}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-slate-500">故障设备</div>
                <div className="text-2xl font-bold text-slate-900">{stats.fault}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索设备名称或序列号..."
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="online">在线</SelectItem>
            <SelectItem value="offline">离线</SelectItem>
            <SelectItem value="fault">故障</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={addDialogOpen} onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              添加设备
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5 text-blue-600" />
                添加设备
              </DialogTitle>
              <DialogDescription>
                选择设备模板，然后填写设备信息
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Step 1: 选择模板 */}
              <div>
                <Label className="text-base font-medium mb-3 block">
                  1. 选择设备模板 <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${selectedTemplate?.id === template.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-slate-300'}
                      `}
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className={`p-2 rounded-lg ${
                          selectedTemplate?.id === template.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {getTemplateIcon(template.icon)}
                        </div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-slate-500">{template.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {templates.length === 0 && !loadingTemplates && (
                  <div className="text-center py-8 text-slate-500 border rounded-lg">
                    暂无可用模板，请联系管理员授权
                  </div>
                )}
              </div>

              {/* Step 2: 填写基本信息 */}
              {selectedTemplate && (
                <div className="space-y-4 animate-in fade-in-0 duration-200">
                  <Label className="text-base font-medium">2. 设备基本信息</Label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>设备名称 *</Label>
                      <Input
                        value={newDevice.name}
                        onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                        placeholder={`${selectedTemplate.name}-01`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>设备序列号 *</Label>
                      <Input
                        value={newDevice.sn}
                        onChange={(e) => setNewDevice({ ...newDevice, sn: e.target.value })}
                        placeholder="SN202401001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>关联DTU</Label>
                      <Select 
                        value={newDevice.dtu_id} 
                        onValueChange={(v) => setNewDevice({ ...newDevice, dtu_id: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择DTU设备" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">不关联</SelectItem>
                          {dtuList.map((dtu) => (
                            <SelectItem key={dtu.id} value={dtu.id}>
                              {dtu.name || dtu.device_id} 
                              {dtu.online ? ' (在线)' : ' (离线)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>DTU端口</Label>
                      <Input
                        type="number"
                        value={newDevice.dtu_port}
                        onChange={(e) => setNewDevice({ ...newDevice, dtu_port: e.target.value })}
                        placeholder="如：1 (串口端口号)"
                        disabled={!newDevice.dtu_id}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>安装位置</Label>
                      <Input
                        value={newDevice.location}
                        onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                        placeholder="如：华东机械-A车间"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>所属客户</Label>
                      <Input
                        value={newDevice.customer}
                        onChange={(e) => setNewDevice({ ...newDevice, customer: e.target.value })}
                        placeholder="如：华东机械制造厂"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>备注说明</Label>
                    <Textarea
                      value={newDevice.description}
                      onChange={(e) => setNewDevice({ ...newDevice, description: e.target.value })}
                      placeholder="设备安装说明、特殊配置等..."
                    />
                  </div>
                </div>
              )}

              {/* Step 3: 参数初始值（可选） */}
              {selectedTemplate && templateFields.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">3. 参数初始值（可选）</Label>
                  <div className="text-sm text-slate-500 mb-2">
                    设置设备的初始参数值，后续可通过DTU上报实时数据
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {templateFields.map((field) => (
                      <div key={field.field_key} className="space-y-2">
                        <Label className="flex items-center gap-1">
                          {field.field_name}
                          {field.unit && <span className="text-slate-400 text-xs">({field.unit})</span>}
                        </Label>
                        <Input
                          type={field.field_type === 'number' ? 'number' : 'text'}
                          value={fieldValues[field.field_key] || ''}
                          onChange={(e) => setFieldValues({
                            ...fieldValues,
                            [field.field_key]: e.target.value
                          })}
                          placeholder={`输入${field.field_name}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={handleAddDevice}
                disabled={!selectedTemplate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                确认添加
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 设备列表 */}
      <Card className="bg-white border border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>设备信息</TableHead>
                <TableHead>模板</TableHead>
                <TableHead>关联DTU</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>最后更新</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                        <Box className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-xs text-slate-500">{device.sn}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {device.template_name ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        {device.template_name}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {device.dtu_device_id ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          {device.dtu_name || device.dtu_device_id}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-slate-400">未关联</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[device.status]}>
                      {statusLabels[device.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{device.customer}</div>
                    <div className="text-xs text-slate-500">{device.location}</div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {device.lastUpdate}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDTUConfig(device.id)}>
                          <Cpu className="h-4 w-4 mr-2" />
                          DTU配置
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          设备设置
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
