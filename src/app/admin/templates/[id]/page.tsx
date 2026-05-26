'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Edit,
  Layout,
  Activity,
  Settings,
  Users,
  Cog,
  Thermometer,
  Gauge,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { AreaChartComponent } from '@/components/charts/area-chart';
import { PieChartComponent, PieChartData } from '@/components/charts/pie-chart';

export default function TemplateDetailPage() {
  const params = useParams();
  const templateId = params.id as string;
  
  const [template, setTemplate] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/templates/${templateId}`);
      if (res.ok) {
        const data = await res.json();
        setTemplate(data.template);
        setFields(data.fields || []);
      }
    } catch (error) {
      console.error('加载模板失败:', error);
      // 模拟数据
      setTemplate({
        id: templateId,
        name: '注塑机',
        code: 'injection_molding',
        category: '生产设备',
        description: '塑料注塑成型设备，用于生产各类塑料制品',
        icon: 'Cog',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
      });
      setFields([
        { field_key: 'temperature', field_name: '温度', unit: '℃', chart_type: 'line', color: '#ef4444', show_in_dashboard: true },
        { field_key: 'pressure', field_name: '压力', unit: 'MPa', chart_type: 'line', color: '#ec4899', show_in_dashboard: true },
        { field_key: 'speed', field_name: '转速', unit: 'rpm', chart_type: 'line', color: '#8b5cf6', show_in_dashboard: true },
        { field_key: 'power', field_name: '功率', unit: 'kW', chart_type: 'bar', color: '#f59e0b', show_in_dashboard: true },
        { field_key: 'efficiency', field_name: '效率', unit: '%', chart_type: 'gauge', color: '#22c55e', show_in_dashboard: true },
        { field_key: 'output', field_name: '产量', unit: '件/h', chart_type: 'bar', color: '#06b6d4', show_in_dashboard: true },
      ]);
    }
    setLoading(false);
  };

  // 模拟趋势数据
  const trendData = Array.from({ length: 24 }, (_, i) => ({
    date: `${i}:00`,
    value: 45 + Math.sin(i / 3) * 10 + Math.random() * 5,
  }));

  // 模拟分布数据
  const distributionData: PieChartData[] = [
    { name: '温度', value: 35, color: '#ef4444' },
    { name: '压力', value: 25, color: '#ec4899' },
    { name: '转速', value: 20, color: '#8b5cf6' },
    { name: '功率', value: 15, color: '#f59e0b' },
    { name: '其他', value: 5, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      {/* 返回和标题 */}
      <div className="flex items-center gap-4">
        <Link href="/admin/templates">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{template?.name || '加载中...'}</h1>
          <p className="text-sm text-slate-400 mt-1">{template?.code}</p>
        </div>
        <Link href={`/admin/templates/${templateId}/permission`}>
          <Button variant="outline" className="border-slate-600">
            <Users className="h-4 w-4 mr-2" />
            授权管理
          </Button>
        </Link>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Edit className="h-4 w-4 mr-2" />
          编辑模板
        </Button>
      </div>

      {/* 基本信息 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-700 text-blue-400">
                <Cog className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm text-slate-400">设备分类</div>
                <div className="text-lg font-medium text-white">{template?.category}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-700 text-green-400">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm text-slate-400">参数字段</div>
                <div className="text-lg font-medium text-white">{fields.length} 个</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-700 text-yellow-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm text-slate-400">授权厂家</div>
                <div className="text-lg font-medium text-white">2 家</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 标签页 */}
      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="preview" className="data-[state=active]:bg-slate-700">
            <Layout className="h-4 w-4 mr-2" />
            页面预览
          </TabsTrigger>
          <TabsTrigger value="fields" className="data-[state=active]:bg-slate-700">
            <Activity className="h-4 w-4 mr-2" />
            参数字段
          </TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-slate-700">
            <Settings className="h-4 w-4 mr-2" />
            配置
          </TabsTrigger>
        </TabsList>

        {/* 页面预览 */}
        <TabsContent value="preview" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">仪表盘预览</CardTitle>
              <CardDescription className="text-slate-400">
                用户端设备详情页的仪表盘布局
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* 模拟移动端布局 */}
              <div className="max-w-sm mx-auto bg-slate-900 rounded-2xl p-4 space-y-4">
                <div className="text-center text-white font-medium mb-4">
                  {template?.name} - 实时监控
                </div>
                
                {/* 主要数据卡片 */}
                <div className="grid grid-cols-2 gap-3">
                  {fields.filter(f => f.show_in_dashboard).slice(0, 4).map((field) => (
                    <div 
                      key={field.field_key}
                      className="bg-slate-800 rounded-lg p-3"
                    >
                      <div className="text-xs text-slate-400">{field.field_name}</div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: field.color }}
                        >
                          {(45 + Math.random() * 20).toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-500">{field.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 图表区域 */}
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-2">温度趋势</div>
                  <div className="h-20 flex items-end gap-1">
                    {trendData.slice(-12).map((d, i) => (
                      <div 
                        key={i}
                        className="flex-1 bg-red-500/50 rounded-t"
                        style={{ height: `${(d.value / 70) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 参数字段 */}
        <TabsContent value="fields" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">参数字段列表</CardTitle>
              <CardDescription className="text-slate-400">
                设备采集的参数字段及其配置
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div 
                    key={field.field_key}
                    className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${field.color}20` }}
                    >
                      <Activity className="h-4 w-4" style={{ color: field.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{field.field_name}</span>
                        <code className="text-xs text-slate-500 bg-slate-800 px-1 rounded">
                          {field.field_key}
                        </code>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        单位: {field.unit} | 图表: {field.chart_type || '无'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {field.show_in_dashboard && (
                        <Badge className="bg-blue-500/20 text-blue-400">仪表盘</Badge>
                      )}
                      {field.show_in_detail && (
                        <Badge className="bg-green-500/20 text-green-400">详情页</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 配置 */}
        <TabsContent value="config" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">模板配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">模板描述</div>
                <div className="text-white">{template?.description || '暂无描述'}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">创建时间</div>
                <div className="text-white">
                  {template?.created_at ? new Date(template.created_at).toLocaleString() : '-'}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">状态</div>
                <Badge 
                  variant={template?.is_active ? "default" : "secondary"}
                  className={template?.is_active ? "bg-green-500/20 text-green-400" : "bg-slate-600 text-slate-400"}
                >
                  {template?.is_active ? '已启用' : '已禁用'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
