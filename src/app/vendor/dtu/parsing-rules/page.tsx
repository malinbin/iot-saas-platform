'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Edit, Trash2, Settings, Cpu, Radio } from 'lucide-react';
import Link from 'next/link';

interface DTUDevice {
  id: string;
  device_id: string;
  name: string;
  online: boolean;
}

interface Device {
  id: string;
  name: string;
  serial_number: string;
  device_type: string;
}

interface ParsingRule {
  id: string;
  dtu_id: string;
  name: string;
  description: string;
  match_type: string;
  match_port: number | null;
  match_topic_pattern: string | null;
  match_identifier_field: string | null;
  match_identifier_value: string | null;
  parsing_type: string;
  json_path: string | null;
  target_device_id: string | null;
  target_field: string | null;
  data_unit: string | null;
  data_scale: number | null;
  data_offset: number | null;
  is_active: boolean;
  dtu?: DTUDevice;
  target_device?: Device;
}

export default function DTUParsingRulesPage() {
  const { toast } = useToast();
  const [rules, setRules] = useState<ParsingRule[]>([]);
  const [dtuDevices, setDtuDevices] = useState<DTUDevice[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ParsingRule | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    dtu_id: '',
    name: '',
    description: '',
    match_type: 'port',
    match_port: '',
    match_topic_pattern: '',
    match_identifier_field: '',
    match_identifier_value: '',
    parsing_type: 'json',
    json_path: '',
    target_device_id: '',
    target_field: '',
    data_unit: '',
    data_scale: '',
    data_offset: '',
    is_active: true
  });

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 并行加载
      const [rulesRes, dtuRes, devicesRes] = await Promise.all([
        fetch('/api/dtu/parsing-rules'),
        fetch('/api/dtu/data'),
        fetch('/api/vendor/devices')
      ]);

      const rulesData = await rulesRes.json();
      const dtuData = await dtuRes.json();
      const devicesData = await devicesRes.json();

      if (rulesData.success) setRules(rulesData.data || []);
      if (dtuData.success) setDtuDevices(dtuData.data || []);
      if (devicesData.success) setDevices(devicesData.data || []);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      dtu_id: '',
      name: '',
      description: '',
      match_type: 'port',
      match_port: '',
      match_topic_pattern: '',
      match_identifier_field: '',
      match_identifier_value: '',
      parsing_type: 'json',
      json_path: '',
      target_device_id: '',
      target_field: '',
      data_unit: '',
      data_scale: '',
      data_offset: '',
      is_active: true
    });
    setEditingRule(null);
  };

  const handleSave = async () => {
    try {
      const url = '/api/dtu/parsing-rules';
      const method = editingRule ? 'PUT' : 'POST';
      
      const body: Record<string, unknown> = {
        ...formData,
        match_port: formData.match_port ? parseInt(formData.match_port) : null,
        data_scale: formData.data_scale ? parseFloat(formData.data_scale) : null,
        data_offset: formData.data_offset ? parseFloat(formData.data_offset) : null
      };

      if (editingRule) {
        body.id = editingRule.id;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: editingRule ? '更新成功' : '创建成功',
          description: `解析规则已${editingRule ? '更新' : '创建'}`
        });
        setDialogOpen(false);
        resetForm();
        loadData();
      } else {
        toast({
          variant: 'error',
          title: '操作失败',
          description: data.error
        });
      }
    } catch (error) {
      toast({
        variant: 'error',
        title: '操作失败',
        description: '请检查网络连接'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条解析规则吗？')) return;

    try {
      const res = await fetch(`/api/dtu/parsing-rules?id=${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (data.success) {
        toast({ title: '删除成功' });
        loadData();
      } else {
        toast({
          variant: 'error',
          title: '删除失败',
          description: data.error
        });
      }
    } catch (error) {
      toast({
        variant: 'error',
        title: '删除失败'
      });
    }
  };

  const openEditDialog = (rule: ParsingRule) => {
    setEditingRule(rule);
    setFormData({
      dtu_id: rule.dtu_id,
      name: rule.name,
      description: rule.description || '',
      match_type: rule.match_type,
      match_port: rule.match_port?.toString() || '',
      match_topic_pattern: rule.match_topic_pattern || '',
      match_identifier_field: rule.match_identifier_field || '',
      match_identifier_value: rule.match_identifier_value || '',
      parsing_type: rule.parsing_type,
      json_path: rule.json_path || '',
      target_device_id: rule.target_device_id || '',
      target_field: rule.target_field || '',
      data_unit: rule.data_unit || '',
      data_scale: rule.data_scale?.toString() || '',
      data_offset: rule.data_offset?.toString() || '',
      is_active: rule.is_active
    });
    setDialogOpen(true);
  };

  const getMatchTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      port: '端口匹配',
      topic: '主题匹配',
      identifier: '标识符匹配',
      all: '全部匹配'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/vendor/dtu">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">数据解析规则</h1>
            <p className="text-muted-foreground">配置DTU数据与设备的匹配规则</p>
          </div>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          添加规则
        </Button>
      </div>

      {/* 说明卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            匹配方式说明
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-muted">
              <div className="font-medium mb-1">端口匹配</div>
              <div className="text-sm text-muted-foreground">根据DTU串口号匹配设备</div>
              <div className="text-xs mt-2 text-blue-600">例: 端口1 → 设备A</div>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="font-medium mb-1">主题匹配</div>
              <div className="text-sm text-muted-foreground">根据MQTT主题匹配设备</div>
              <div className="text-xs mt-2 text-blue-600">例: device/001/data → 设备A</div>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="font-medium mb-1">标识符匹配</div>
              <div className="text-sm text-muted-foreground">根据数据中的标识字段匹配</div>
              <div className="text-xs mt-2 text-blue-600">例: {"{id:'001'}"} → 设备A</div>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="font-medium mb-1">全部匹配</div>
              <div className="text-sm text-muted-foreground">匹配所有数据</div>
              <div className="text-xs mt-2 text-blue-600">适用于单设备场景</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 规则列表 */}
      <Card>
        <CardHeader>
          <CardTitle>解析规则列表 ({rules.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Radio className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无解析规则</p>
              <p className="text-sm mt-1">点击"添加规则"创建第一条规则</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline">{getMatchTypeLabel(rule.match_type)}</Badge>
                        {rule.dtu && (
                          <span>DTU: {rule.dtu.name || rule.dtu.device_id}</span>
                        )}
                        {rule.target_device && (
                          <span>→ {rule.target_device.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                      {rule.is_active ? '启用' : '禁用'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rule.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 添加/编辑对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRule ? '编辑规则' : '添加规则'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>DTU设备 *</Label>
                <Select
                  value={formData.dtu_id}
                  onValueChange={(v) => setFormData({ ...formData, dtu_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择DTU" />
                  </SelectTrigger>
                  <SelectContent>
                    {dtuDevices.map((dtu) => (
                      <SelectItem key={dtu.id} value={dtu.id}>
                        {dtu.name || dtu.device_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>规则名称 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例: 温度传感器数据解析"
                />
              </div>
            </div>

            <div>
              <Label>描述</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="规则描述"
              />
            </div>

            {/* 匹配条件 */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">匹配条件</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>匹配方式</Label>
                  <Select
                    value={formData.match_type}
                    onValueChange={(v) => setFormData({ ...formData, match_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="port">端口匹配</SelectItem>
                      <SelectItem value="topic">主题匹配</SelectItem>
                      <SelectItem value="identifier">标识符匹配</SelectItem>
                      <SelectItem value="all">全部匹配</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.match_type === 'port' && (
                  <div>
                    <Label>端口号</Label>
                    <Input
                      type="number"
                      value={formData.match_port}
                      onChange={(e) => setFormData({ ...formData, match_port: e.target.value })}
                      placeholder="1"
                    />
                  </div>
                )}
                
                {formData.match_type === 'topic' && (
                  <div>
                    <Label>主题模式</Label>
                    <Input
                      value={formData.match_topic_pattern}
                      onChange={(e) => setFormData({ ...formData, match_topic_pattern: e.target.value })}
                      placeholder="device/+/data"
                    />
                  </div>
                )}
                
                {formData.match_type === 'identifier' && (
                  <>
                    <div>
                      <Label>标识符字段</Label>
                      <Input
                        value={formData.match_identifier_field}
                        onChange={(e) => setFormData({ ...formData, match_identifier_field: e.target.value })}
                        placeholder="device_id"
                      />
                    </div>
                    <div>
                      <Label>标识符值</Label>
                      <Input
                        value={formData.match_identifier_value}
                        onChange={(e) => setFormData({ ...formData, match_identifier_value: e.target.value })}
                        placeholder="001"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 解析配置 */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">解析配置</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>解析类型</Label>
                  <Select
                    value={formData.parsing_type}
                    onValueChange={(v) => setFormData({ ...formData, parsing_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON解析</SelectItem>
                      <SelectItem value="modbus">Modbus解析</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.parsing_type === 'json' && (
                  <div>
                    <Label>JSON路径</Label>
                    <Input
                      value={formData.json_path}
                      onChange={(e) => setFormData({ ...formData, json_path: e.target.value })}
                      placeholder="data.temperature"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 目标设备 */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">目标设备</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>目标设备</Label>
                  <Select
                    value={formData.target_device_id}
                    onValueChange={(v) => setFormData({ ...formData, target_device_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择设备" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map((device) => (
                        <SelectItem key={device.id} value={device.id}>
                          {device.name} ({device.device_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>存入字段</Label>
                  <Input
                    value={formData.target_field}
                    onChange={(e) => setFormData({ ...formData, target_field: e.target.value })}
                    placeholder="temperature"
                  />
                </div>
              </div>
            </div>

            {/* 数据处理 */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">数据处理（可选）</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>单位</Label>
                  <Input
                    value={formData.data_unit}
                    onChange={(e) => setFormData({ ...formData, data_unit: e.target.value })}
                    placeholder="℃"
                  />
                </div>
                <div>
                  <Label>缩放系数</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.data_scale}
                    onChange={(e) => setFormData({ ...formData, data_scale: e.target.value })}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label>偏移量</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.data_offset}
                    onChange={(e) => setFormData({ ...formData, data_offset: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* 启用状态 */}
            <div className="flex items-center justify-between border-t pt-4">
              <Label>启用规则</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              {editingRule ? '更新' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
