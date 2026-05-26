'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Thermometer,
  Gauge,
  Zap,
  Droplets,
  RotateCw,
  Timer,
  Boxes,
  Wrench,
  Activity,
  Wind,
  Sun,
  Battery,
  CircuitBoard,
  GaugeIcon,
  Trash2,
  GripVertical,
  Plus,
  Eye,
  Save,
  ArrowLeft,
  Monitor,
  Smartphone,
  LayoutDashboard,
  Settings,
  LineChart,
  BarChart3,
  Target,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';

// 字段类型定义
interface FieldConfig {
  id: string;
  key: string;
  name: string;
  type: 'number' | 'string' | 'boolean';
  unit: string;
  icon: string;
  color: string;
  chartType: 'line' | 'bar' | 'gauge' | 'none';
  minValue?: number;
  maxValue?: number;
  showInDashboard: boolean;
  showInList: boolean;
  width: 'half' | 'full';
}

// 预设字段模板
const fieldTemplates: { name: string; icon: any; defaultConfig: Partial<FieldConfig> }[] = [
  {
    name: '温度',
    icon: Thermometer,
    defaultConfig: { key: 'temperature', unit: '℃', color: '#ef4444', chartType: 'line' },
  },
  {
    name: '压力',
    icon: Gauge,
    defaultConfig: { key: 'pressure', unit: 'MPa', color: '#3b82f6', chartType: 'line' },
  },
  {
    name: '功率',
    icon: Zap,
    defaultConfig: { key: 'power', unit: 'kW', color: '#f59e0b', chartType: 'bar' },
  },
  {
    name: '流量',
    icon: Droplets,
    defaultConfig: { key: 'flow', unit: 'L/min', color: '#06b6d4', chartType: 'line' },
  },
  {
    name: '转速',
    icon: RotateCw,
    defaultConfig: { key: 'speed', unit: 'rpm', color: '#8b5cf6', chartType: 'line' },
  },
  {
    name: '运行时间',
    icon: Timer,
    defaultConfig: { key: 'runtime', unit: 'h', color: '#64748b', chartType: 'none' },
  },
  {
    name: '产量',
    icon: Boxes,
    defaultConfig: { key: 'output', unit: '件', color: '#22c55e', chartType: 'bar' },
  },
  {
    name: '效率',
    icon: Activity,
    defaultConfig: { key: 'efficiency', unit: '%', color: '#10b981', chartType: 'gauge' },
  },
  {
    name: '湿度',
    icon: Wind,
    defaultConfig: { key: 'humidity', unit: '%', color: '#0ea5e9', chartType: 'line' },
  },
  {
    name: '光照',
    icon: Sun,
    defaultConfig: { key: 'light', unit: 'lux', color: '#fbbf24', chartType: 'line' },
  },
  {
    name: '电量',
    icon: Battery,
    defaultConfig: { key: 'battery', unit: '%', color: '#22c55e', chartType: 'gauge' },
  },
  {
    name: '振动',
    icon: Activity,
    defaultConfig: { key: 'vibration', unit: 'mm/s', color: '#f97316', chartType: 'line' },
  },
];

const iconMap: Record<string, any> = {
  Thermometer,
  Gauge,
  Zap,
  Droplets,
  RotateCw,
  Timer,
  Boxes,
  Activity,
  Wind,
  Sun,
  Battery,
  CircuitBoard,
};

const colorOptions = [
  { value: '#ef4444', label: '红色' },
  { value: '#f97316', label: '橙色' },
  { value: '#f59e0b', label: '黄色' },
  { value: '#22c55e', label: '绿色' },
  { value: '#10b981', label: '翠绿' },
  { value: '#06b6d4', label: '青色' },
  { value: '#3b82f6', label: '蓝色' },
  { value: '#8b5cf6', label: '紫色' },
  { value: '#ec4899', label: '粉色' },
  { value: '#64748b', label: '灰色' },
];

// 可拖拽字段项组件
function SortableFieldItem({
  field,
  onEdit,
  onDelete,
  isSelected,
}: {
  field: FieldConfig;
  onEdit: () => void;
  onDelete: () => void;
  isSelected: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = iconMap[field.icon] || Activity;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 p-3 bg-background rounded-lg border-2 transition-all cursor-pointer ${
        isSelected ? 'border-primary shadow-md' : 'border-transparent hover:border-muted'
      }`}
      onClick={onEdit}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${field.color}20` }}
      >
        <IconComponent className="h-5 w-5" style={{ color: field.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{field.name}</div>
        <div className="text-xs text-muted-foreground">
          {field.key} · {field.unit}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {field.showInDashboard && (
          <Badge variant="secondary" className="text-xs">
            <LayoutDashboard className="h-3 w-3 mr-1" />
            仪表盘
          </Badge>
        )}
        {field.chartType !== 'none' && (
          <Badge variant="outline" className="text-xs">
            {field.chartType === 'line' && <LineChart className="h-3 w-3" />}
            {field.chartType === 'bar' && <BarChart3 className="h-3 w-3" />}
            {field.chartType === 'gauge' && <Target className="h-3 w-3" />}
          </Badge>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

// 预览组件
function PreviewPanel({
  fields,
  deviceName,
  previewMode,
}: {
  fields: FieldConfig[];
  deviceName: string;
  previewMode: 'dashboard' | 'detail';
}) {
  return (
    <div
      className={`bg-background rounded-lg border ${
        previewMode === 'dashboard' ? 'p-4' : 'p-3'
      }`}
    >
      {previewMode === 'dashboard' ? (
        // 仪表盘预览
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{deviceName || '设备名称'}</h3>
            <Badge variant="outline" className="text-green-600">
              在线
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fields
              .filter((f) => f.showInDashboard)
              .map((field) => {
                const IconComponent = iconMap[field.icon] || Activity;
                const mockValue =
                  field.key === 'temperature'
                    ? 45.2
                    : field.key === 'pressure'
                    ? 12.5
                    : field.key === 'power'
                    ? 456
                    : field.key === 'efficiency'
                    ? 92.3
                    : field.key === 'speed'
                    ? 3200
                    : Math.floor(Math.random() * 100);
                const isWarning =
                  (field.minValue !== undefined && mockValue < field.minValue) ||
                  (field.maxValue !== undefined && mockValue > field.maxValue);

                return (
                  <Card
                    key={field.id}
                    className={`${field.width === 'full' ? 'col-span-2' : ''}`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <IconComponent
                            className="h-4 w-4"
                            style={{ color: field.color }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {field.name}
                          </span>
                        </div>
                        {isWarning && (
                          <Badge variant="destructive" className="text-xs">
                            告警
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-2xl font-bold ${
                            isWarning ? 'text-destructive' : ''
                          }`}
                        >
                          {mockValue}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {field.unit}
                        </span>
                      </div>
                      {field.chartType === 'gauge' && (
                        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${mockValue}%`,
                              backgroundColor: field.color,
                            }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ) : (
        // 详情页预览
        <div className="space-y-3">
          <h4 className="font-medium text-sm">参数列表</h4>
          <div className="space-y-2">
            {fields.map((field) => {
              const IconComponent = iconMap[field.icon] || Activity;
              const mockValue =
                field.key === 'temperature'
                  ? 45.2
                  : field.key === 'pressure'
                  ? 12.5
                  : field.key === 'power'
                  ? 456
                  : Math.floor(Math.random() * 100);

              return (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent
                      className="h-4 w-4"
                      style={{ color: field.color }}
                    />
                    <span className="text-sm">{field.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{mockValue}</span>
                    <span className="text-xs text-muted-foreground">
                      {field.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VisualTemplateEditor({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [templateName, setTemplateName] = useState('新设备模板');
  const [templateCategory, setTemplateCategory] = useState('industrial');
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'dashboard' | 'detail'>(
    'dashboard'
  );
  const [deviceType, setDeviceType] = useState('custom');
  const [saving, setSaving] = useState(false);

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 添加字段
  const addField = useCallback(
    (template: (typeof fieldTemplates)[0]) => {
      const newField: FieldConfig = {
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        key: template.defaultConfig.key || 'field',
        name: template.name,
        type: 'number',
        unit: template.defaultConfig.unit || '',
        icon: template.icon.name,
        color: template.defaultConfig.color || '#3b82f6',
        chartType: template.defaultConfig.chartType || 'line',
        showInDashboard: true,
        showInList: true,
        width: 'half',
        ...template.defaultConfig,
      };
      setFields((prev) => [...prev, newField]);
      setSelectedFieldId(newField.id);
    },
    []
  );

  // 删除字段
  const deleteField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setSelectedFieldId(null);
  }, []);

  // 更新字段
  const updateField = useCallback(
    (id: string, updates: Partial<FieldConfig>) => {
      setFields((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );

  // 拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // 保存模板
  const handleSave = async () => {
    if (!templateName.trim()) {
      toast.error('请输入模板名称');
      return;
    }
    if (fields.length === 0) {
      toast.error('请至少添加一个字段');
      return;
    }

    setSaving(true);
    try {
      // 调用API保存
      const response = await fetch(`/api/admin/templates/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          code: templateName.toLowerCase().replace(/\s+/g, '_'),
          category: templateCategory,
          description: `${templateName} - ${deviceType}`,
          icon: 'Cog',
          is_active: true,
          fields: fields.map((f, index) => ({
            ...f,
            display_order: index,
          })),
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.template) {
        toast.success('模板保存成功');
        setTimeout(() => {
          router.push('/admin/templates');
        }, 1000);
      } else {
        toast.error(data.error || '保存失败');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-muted/30">
      {/* 顶部工具栏 */}
      <header className="bg-background border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-48 font-medium"
            placeholder="模板名称"
          />
          <Select value={templateCategory} onValueChange={setTemplateCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="industrial">工业设备</SelectItem>
              <SelectItem value="energy">能源设备</SelectItem>
              <SelectItem value="agriculture">农业设备</SelectItem>
              <SelectItem value="transport">交通设备</SelectItem>
              <SelectItem value="custom">自定义</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreviewMode(previewMode === 'dashboard' ? 'detail' : 'dashboard')}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode === 'dashboard' ? '详情预览' : '仪表盘预览'}
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存模板
          </Button>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：字段组件库 */}
        <aside className="w-64 bg-background border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-3">字段组件库</h3>
            <p className="text-xs text-muted-foreground mb-4">
              点击添加到画布
            </p>
            <div className="grid grid-cols-2 gap-2">
              {fieldTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <button
                    key={template.name}
                    onClick={() => addField(template)}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg border border-dashed hover:border-primary hover:bg-muted/50 transition-colors"
                  >
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs">{template.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <Separator />
          <div className="p-4">
            <h4 className="font-medium text-sm mb-2">自定义字段</h4>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                addField({
                  name: '自定义',
                  icon: Settings,
                  defaultConfig: {
                    key: 'custom_field',
                    unit: '',
                    color: '#64748b',
                    chartType: 'none',
                  },
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              添加自定义字段
            </Button>
          </div>
        </aside>

        {/* 中间：画布 */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <Tabs defaultValue="canvas" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-2">
              <TabsTrigger value="canvas" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                字段配置
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Smartphone className="h-4 w-4" />
                预览效果
              </TabsTrigger>
            </TabsList>

            <TabsContent value="canvas" className="flex-1 p-4 overflow-y-auto">
              {fields.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <Card className="w-96">
                    <CardContent className="p-8 text-center">
                      <LayoutDashboard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">开始设计设备页面</h3>
                      <p className="text-sm text-muted-foreground">
                        从左侧选择字段组件添加到画布
                        <br />
                        或创建自定义字段
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={fields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 max-w-2xl mx-auto">
                      {fields.map((field) => (
                        <SortableFieldItem
                          key={field.id}
                          field={field}
                          onEdit={() => setSelectedFieldId(field.id)}
                          onDelete={() => deleteField(field.id)}
                          isSelected={selectedFieldId === field.id}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </TabsContent>

            <TabsContent value="preview" className="flex-1 p-4 overflow-y-auto">
              <div className="max-w-md mx-auto">
                {/* 模拟手机框架 */}
                <div className="bg-muted rounded-3xl p-3 shadow-lg">
                  <div className="bg-background rounded-2xl overflow-hidden">
                    {/* 状态栏 */}
                    <div className="bg-background px-4 py-2 flex justify-between items-center text-xs">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-foreground rounded-sm" />
                      </div>
                    </div>
                    {/* 内容区 */}
                    <div className="p-4 min-h-[400px]">
                      <PreviewPanel
                        fields={fields}
                        deviceName={templateName}
                        previewMode={previewMode}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* 右侧：属性面板 */}
        <aside className="w-80 bg-background border-l overflow-y-auto">
          {selectedField ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">字段属性</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFieldId(null)}
                >
                  取消
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>字段名称</Label>
                  <Input
                    value={selectedField.name}
                    onChange={(e) =>
                      updateField(selectedField.id, { name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>字段标识</Label>
                  <Input
                    value={selectedField.key}
                    onChange={(e) =>
                      updateField(selectedField.id, { key: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>单位</Label>
                  <Input
                    value={selectedField.unit}
                    onChange={(e) =>
                      updateField(selectedField.id, { unit: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>颜色</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() =>
                          updateField(selectedField.id, { color: color.value })
                        }
                        className={`w-8 h-8 rounded-lg border-2 ${
                          selectedField.color === color.value
                            ? 'border-foreground'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>图表类型</Label>
                  <Select
                    value={selectedField.chartType}
                    onValueChange={(value: 'line' | 'bar' | 'gauge' | 'none') =>
                      updateField(selectedField.id, { chartType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">
                        <div className="flex items-center gap-2">
                          <LineChart className="h-4 w-4" />
                          折线图
                        </div>
                      </SelectItem>
                      <SelectItem value="bar">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          柱状图
                        </div>
                      </SelectItem>
                      <SelectItem value="gauge">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          仪表盘
                        </div>
                      </SelectItem>
                      <SelectItem value="none">
                        <div className="flex items-center gap-2">
                          <EyeOff className="h-4 w-4" />
                          不显示图表
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>显示在仪表盘</Label>
                    <Switch
                      checked={selectedField.showInDashboard}
                      onCheckedChange={(checked) =>
                        updateField(selectedField.id, {
                          showInDashboard: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>显示在列表</Label>
                    <Switch
                      checked={selectedField.showInList}
                      onCheckedChange={(checked) =>
                        updateField(selectedField.id, { showInList: checked })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>告警阈值</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        最小值
                      </Label>
                      <Input
                        type="number"
                        value={selectedField.minValue ?? ''}
                        onChange={(e) =>
                          updateField(selectedField.id, {
                            minValue: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        placeholder="不限"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        最大值
                      </Label>
                      <Input
                        type="number"
                        value={selectedField.maxValue ?? ''}
                        onChange={(e) =>
                          updateField(selectedField.id, {
                            maxValue: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        placeholder="不限"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>卡片宽度</Label>
                  <Select
                    value={selectedField.width}
                    onValueChange={(value: 'half' | 'full') =>
                      updateField(selectedField.id, { width: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="half">半宽（两列布局）</SelectItem>
                      <SelectItem value="full">全宽（单独一行）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <Settings className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">选择字段以编辑属性</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
