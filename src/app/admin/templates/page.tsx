'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Settings,
  Users,
  Layout,
  Activity,
  Cog,
  Gauge,
  Thermometer,
  Zap,
  Droplets,
  RotateCw,
  Timer,
  Boxes,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';

interface TemplateField {
  id: string;
  field_key: string;
  field_name: string;
  field_type: 'number' | 'string' | 'boolean' | 'enum';
  unit?: string;
  min_value?: number;
  max_value?: number;
  default_value?: string;
  enum_options?: { label: string; value: string }[];
  icon?: string;
  color?: string;
  show_in_list: boolean;
  show_in_dashboard: boolean;
  show_in_detail: boolean;
  chart_type?: 'line' | 'bar' | 'gauge' | 'none';
  alert_min?: number;
  alert_max?: number;
  warning_min?: number;
  warning_max?: number;
  sort_order: number;
  group_name?: string;
}

interface DeviceTemplate {
  id: string;
  name: string;
  code: string;
  category: string;
  description?: string;
  icon?: string;
  image_url?: string;
  is_active: boolean;
  field_count: number;
  vendor_count: number;
  created_at: string;
}

// 预设字段模板
const presetFields: Record<string, Partial<TemplateField>> = {
  temperature: { field_key: 'temperature', field_name: '温度', field_type: 'number', unit: '℃', icon: 'Thermometer', color: '#ef4444', chart_type: 'line', show_in_dashboard: true },
  humidity: { field_key: 'humidity', field_name: '湿度', field_type: 'number', unit: '%', icon: 'Droplets', color: '#3b82f6', chart_type: 'line', show_in_dashboard: true },
  power: { field_key: 'power', field_name: '功率', field_type: 'number', unit: 'kW', icon: 'Zap', color: '#f59e0b', chart_type: 'bar', show_in_dashboard: true },
  efficiency: { field_key: 'efficiency', field_name: '效率', field_type: 'number', unit: '%', icon: 'Gauge', color: '#22c55e', chart_type: 'gauge', show_in_dashboard: true },
  speed: { field_key: 'speed', field_name: '转速', field_type: 'number', unit: 'rpm', icon: 'RotateCw', color: '#8b5cf6', chart_type: 'line', show_in_dashboard: true },
  pressure: { field_key: 'pressure', field_name: '压力', field_type: 'number', unit: 'MPa', icon: 'Activity', color: '#ec4899', chart_type: 'line', show_in_dashboard: true },
  output: { field_key: 'output', field_name: '产量', field_type: 'number', unit: '件/h', icon: 'Boxes', color: '#06b6d4', chart_type: 'bar', show_in_dashboard: true },
  runtime: { field_key: 'runtime', field_name: '运行时长', field_type: 'number', unit: 'h', icon: 'Timer', color: '#84cc16', chart_type: 'none', show_in_dashboard: false },
};

// 预设模板
const presetTemplates = [
  {
    name: '注塑机',
    code: 'injection_molding',
    category: '生产设备',
    description: '塑料注塑成型设备',
    icon: 'Cog',
    fields: ['temperature', 'pressure', 'speed', 'power', 'efficiency', 'output', 'runtime'],
  },
  {
    name: '数控车床',
    code: 'cnc_lathe',
    category: '生产设备',
    description: 'CNC数控车床加工设备',
    icon: 'Wrench',
    fields: ['speed', 'power', 'efficiency', 'output', 'runtime'],
  },
  {
    name: '温湿度传感器',
    code: 'temp_humidity_sensor',
    category: '检测设备',
    description: '环境温湿度监测传感器',
    icon: 'Thermometer',
    fields: ['temperature', 'humidity'],
  },
  {
    name: '空压机',
    code: 'air_compressor',
    category: '辅助设备',
    description: '压缩空气供应设备',
    icon: 'Zap',
    fields: ['pressure', 'power', 'temperature', 'efficiency', 'runtime'],
  },
];

export default function DeviceTemplatesPage() {
  const [templates, setTemplates] = useState<DeviceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [fieldsDialogOpen, setFieldsDialogOpen] = useState(false);
  
  // 新建模板表单
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '生产设备',
    description: '',
    icon: 'Cog',
  });
  
  // 字段列表
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('加载模板失败:', error);
      // 使用模拟数据
      setTemplates(presetTemplates.map((t, i) => ({
        id: `tpl_${i}`,
        name: t.name,
        code: t.code,
        category: t.category,
        description: t.description,
        icon: t.icon,
        is_active: true,
        field_count: t.fields.length,
        vendor_count: Math.floor(Math.random() * 5),
        created_at: new Date().toISOString(),
      })));
    }
    setLoading(false);
  };

  const handleCreateTemplate = async () => {
    if (!formData.name || !formData.code) {
      toast.error('请填写模板名称和编码');
      return;
    }
    
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dashboard_config: { layout: 'grid' },
          detail_config: { tabs: ['overview', 'data', 'alerts'] },
        }),
      });
      
      if (res.ok) {
        toast.success('模板创建成功');
        setCreateDialogOpen(false);
        setFormData({ name: '', code: '', category: '生产设备', description: '', icon: 'Cog' });
        loadTemplates();
      } else {
        toast.error('创建失败');
      }
    } catch (error) {
      toast.error('创建失败');
    }
  };

  const handleAddField = (presetKey?: string) => {
    const newField: TemplateField = presetKey ? {
      id: `field_${Date.now()}`,
      ...presetFields[presetKey],
      show_in_list: false,
      show_in_dashboard: true,
      show_in_detail: true,
      sort_order: fields.length,
    } as TemplateField : {
      id: `field_${Date.now()}`,
      field_key: '',
      field_name: '',
      field_type: 'number',
      show_in_list: false,
      show_in_dashboard: true,
      show_in_detail: true,
      sort_order: fields.length,
    };
    
    setFields([...fields, newField]);
  };

  const handleUpdateField = (index: number, updates: Partial<TemplateField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSaveFields = async () => {
    if (!editingTemplateId) return;
    
    try {
      const res = await fetch(`/api/admin/templates/${editingTemplateId}/fields`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
      
      if (res.ok) {
        toast.success('字段配置已保存');
        setFieldsDialogOpen(false);
        loadTemplates();
      } else {
        toast.error('保存失败');
      }
    } catch (error) {
      toast.error('保存失败');
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '生产设备': 'bg-blue-500/20 text-blue-400',
      '检测设备': 'bg-green-500/20 text-green-400',
      '辅助设备': 'bg-yellow-500/20 text-yellow-400',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  const getFieldIcon = (iconName?: string) => {
    const icons: Record<string, React.ReactNode> = {
      Thermometer: <Thermometer className="h-4 w-4" />,
      Droplets: <Droplets className="h-4 w-4" />,
      Zap: <Zap className="h-4 w-4" />,
      Gauge: <Gauge className="h-4 w-4" />,
      RotateCw: <RotateCw className="h-4 w-4" />,
      Activity: <Activity className="h-4 w-4" />,
      Boxes: <Boxes className="h-4 w-4" />,
      Timer: <Timer className="h-4 w-4" />,
    };
    return icons[iconName || ''] || <Activity className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">设备模板管理</h1>
          <p className="text-sm text-slate-400 mt-1">
            自定义设备类型、参数字段和显示样式，授权给厂家使用
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              新建模板
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>创建设备模板</DialogTitle>
              <DialogDescription className="text-slate-400">
                定义新的设备类型，后续可配置参数字段
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>模板名称 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如：注塑机"
                  className="bg-slate-900 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label>模板编码 *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="如：injection_molding"
                  className="bg-slate-900 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label>设备分类</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="bg-slate-900 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="生产设备">生产设备</SelectItem>
                    <SelectItem value="检测设备">检测设备</SelectItem>
                    <SelectItem value="辅助设备">辅助设备</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>图标</Label>
                <Select value={formData.icon} onValueChange={(v) => setFormData({ ...formData, icon: v })}>
                  <SelectTrigger className="bg-slate-900 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="Cog">机械</SelectItem>
                    <SelectItem value="Thermometer">温度计</SelectItem>
                    <SelectItem value="Gauge">仪表盘</SelectItem>
                    <SelectItem value="Zap">电力</SelectItem>
                    <SelectItem value="Activity">数据</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>描述</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="设备用途说明..."
                  className="bg-slate-900 border-slate-600"
                />
              </div>
            </div>

            {/* 快速选择预设模板 */}
            <div className="border-t border-slate-700 pt-4">
              <Label className="text-slate-400 mb-3 block">或选择预设模板快速创建：</Label>
              <div className="grid grid-cols-2 gap-2">
                {presetTemplates.map((preset) => (
                  <Button
                    key={preset.code}
                    variant="outline"
                    className="justify-start h-auto py-2 bg-slate-900/50 border-slate-700 hover:bg-slate-700"
                    onClick={() => {
                      setFormData({
                        name: preset.name,
                        code: preset.code,
                        category: preset.category,
                        description: preset.description || '',
                        icon: preset.icon || 'Cog',
                      });
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{preset.name}</span>
                      <span className="text-xs text-slate-500">({preset.fields.length}个参数)</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="border-slate-600">
                取消
              </Button>
              <Button onClick={handleCreateTemplate} className="bg-blue-600 hover:bg-blue-700">
                创建模板
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 筛选栏 */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索模板名称或编码..."
                  className="pl-9 bg-slate-900 border-slate-600"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 bg-slate-900 border-slate-600">
                <SelectValue placeholder="全部分类" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="生产设备">生产设备</SelectItem>
                <SelectItem value="检测设备">检测设备</SelectItem>
                <SelectItem value="辅助设备">辅助设备</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 模板列表 */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">设备模板列表</CardTitle>
          <CardDescription className="text-slate-400">
            共 {filteredTemplates.length} 个模板
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-400">模板信息</TableHead>
                <TableHead className="text-slate-400">分类</TableHead>
                <TableHead className="text-slate-400">字段数</TableHead>
                <TableHead className="text-slate-400">授权厂家</TableHead>
                <TableHead className="text-slate-400">状态</TableHead>
                <TableHead className="text-slate-400 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id} className="border-slate-700 hover:bg-slate-700/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-700 text-blue-400">
                        {template.icon === 'Cog' && <Cog className="h-5 w-5" />}
                        {template.icon === 'Thermometer' && <Thermometer className="h-5 w-5" />}
                        {template.icon === 'Gauge' && <Gauge className="h-5 w-5" />}
                        {template.icon === 'Zap' && <Zap className="h-5 w-5" />}
                        {template.icon === 'Activity' && <Activity className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-medium text-white">{template.name}</div>
                        <div className="text-xs text-slate-500">{template.code}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-white">{template.field_count}</span>
                    <span className="text-slate-500 text-sm ml-1">个字段</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-white">{template.vendor_count}</span>
                    <span className="text-slate-500 text-sm ml-1">家</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={template.is_active ? "default" : "secondary"} 
                           className={template.is_active ? "bg-green-500/20 text-green-400" : "bg-slate-600 text-slate-400"}>
                      {template.is_active ? '启用' : '禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white"
                        onClick={() => {
                          setEditingTemplateId(template.id);
                          // 加载字段
                          const presetTemplate = presetTemplates.find(t => t.code === template.code);
                          if (presetTemplate) {
                            const loadedFields = presetTemplate.fields.map((f, i) => ({
                              id: `field_${i}`,
                              ...presetFields[f],
                              show_in_list: false,
                              show_in_dashboard: true,
                              show_in_detail: true,
                              sort_order: i,
                            } as TemplateField));
                            setFields(loadedFields);
                          }
                          setFieldsDialogOpen(true);
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Link href={`/admin/templates/${template.id}/permission`}>
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                          <Users className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/templates/${template.id}`}>
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 字段配置弹窗 */}
      <Dialog open={fieldsDialogOpen} onOpenChange={setFieldsDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>配置参数字段</DialogTitle>
            <DialogDescription className="text-slate-400">
              自定义设备参数字段、显示样式和告警规则
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* 快速添加预设字段 */}
            <div className="mb-4">
              <Label className="text-slate-400 mb-2 block">快速添加预设字段：</Label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(presetFields).map((key) => (
                  <Button
                    key={key}
                    size="sm"
                    variant="outline"
                    className="bg-slate-900/50 border-slate-700 hover:bg-slate-700"
                    onClick={() => handleAddField(key)}
                    disabled={fields.some(f => f.field_key === key)}
                  >
                    {getFieldIcon(presetFields[key].icon)}
                    <span className="ml-1">{presetFields[key].field_name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* 字段列表 */}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <Card key={field.id} className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* 字段图标和颜色 */}
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${field.color}20` || 'transparent' }}
                      >
                        <span style={{ color: field.color || '#fff' }}>
                          {getFieldIcon(field.icon)}
                        </span>
                      </div>
                      
                      {/* 字段配置 */}
                      <div className="flex-1 grid grid-cols-4 gap-3">
                        <div>
                          <Label className="text-xs text-slate-500">字段键名</Label>
                          <Input
                            value={field.field_key}
                            onChange={(e) => handleUpdateField(index, { field_key: e.target.value })}
                            className="bg-slate-800 border-slate-600 h-8 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500">显示名称</Label>
                          <Input
                            value={field.field_name}
                            onChange={(e) => handleUpdateField(index, { field_name: e.target.value })}
                            className="bg-slate-800 border-slate-600 h-8 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500">单位</Label>
                          <Input
                            value={field.unit || ''}
                            onChange={(e) => handleUpdateField(index, { unit: e.target.value })}
                            className="bg-slate-800 border-slate-600 h-8 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500">图表类型</Label>
                          <Select 
                            value={field.chart_type || 'none'} 
                            onValueChange={(v) => handleUpdateField(index, { chart_type: v as any })}
                          >
                            <SelectTrigger className="bg-slate-800 border-slate-600 h-8 mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="none">无图表</SelectItem>
                              <SelectItem value="line">折线图</SelectItem>
                              <SelectItem value="bar">柱状图</SelectItem>
                              <SelectItem value="gauge">仪表盘</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* 告警阈值 */}
                        <div>
                          <Label className="text-xs text-slate-500">告警下限</Label>
                          <Input
                            type="number"
                            value={field.alert_min ?? ''}
                            onChange={(e) => handleUpdateField(index, { alert_min: parseFloat(e.target.value) || undefined })}
                            className="bg-slate-800 border-slate-600 h-8 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-500">告警上限</Label>
                          <Input
                            type="number"
                            value={field.alert_max ?? ''}
                            onChange={(e) => handleUpdateField(index, { alert_max: parseFloat(e.target.value) || undefined })}
                            className="bg-slate-800 border-slate-600 h-8 mt-1"
                          />
                        </div>
                        
                        {/* 显示选项 */}
                        <div className="col-span-2 flex items-center gap-4 mt-4">
                          <label className="flex items-center gap-2 text-sm">
                            <Switch
                              checked={field.show_in_dashboard}
                              onCheckedChange={(v) => handleUpdateField(index, { show_in_dashboard: v })}
                            />
                            <span className="text-slate-400">仪表盘</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <Switch
                              checked={field.show_in_detail}
                              onCheckedChange={(v) => handleUpdateField(index, { show_in_detail: v })}
                            />
                            <span className="text-slate-400">详情页</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <Switch
                              checked={field.show_in_list}
                              onCheckedChange={(v) => handleUpdateField(index, { show_in_list: v })}
                            />
                            <span className="text-slate-400">列表</span>
                          </label>
                        </div>
                      </div>
                      
                      {/* 删除按钮 */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleRemoveField(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {fields.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  暂无字段，请点击上方预设字段快速添加
                </div>
              )}
            </div>

            {/* 添加自定义字段按钮 */}
            <Button
              variant="outline"
              className="mt-4 w-full border-dashed border-slate-600 hover:bg-slate-700"
              onClick={() => handleAddField()}
            >
              <Plus className="h-4 w-4 mr-2" />
              添加自定义字段
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFieldsDialogOpen(false)} className="border-slate-600">
              取消
            </Button>
            <Button onClick={handleSaveFields} className="bg-blue-600 hover:bg-blue-700">
              保存字段配置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
