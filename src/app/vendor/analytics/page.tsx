'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChartComponent } from '@/components/charts/area-chart';
import { PieChartComponent } from '@/components/charts/pie-chart';
import { BarChartComponent } from '@/components/charts/bar-chart';
import { 
  TrendingUp, 
  Activity, 
  Box, 
  Zap,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const trendData = [
  { date: '01月', value: 1200 },
  { date: '02月', value: 1450 },
  { date: '03月', value: 1380 },
  { date: '04月', value: 1680 },
  { date: '05月', value: 1890 },
  { date: '06月', value: 2150 },
];

const deviceTypeData = [
  { name: 'CNC加工', value: 35, color: '#2563EB' },
  { name: '激光切割', value: 25, color: '#3B82F6' },
  { name: '注塑机', value: 20, color: '#60A5FA' },
  { name: '冲压机', value: 15, color: '#93C5FD' },
  { name: '其他', value: 5, color: '#BFDBFE' },
];

const efficiencyData = [
  { name: '周一', value: 92 },
  { name: '周二', value: 88 },
  { name: '周三', value: 95 },
  { name: '周四', value: 90 },
  { name: '周五', value: 87 },
  { name: '周六', value: 75 },
  { name: '周日', value: 60 },
];

export default function VendorAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1E293B]">数据分析</h1>
        <p className="text-sm text-[#64748B]">设备运行数据统计分析</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">本月产量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-[#1E293B]">21,580</div>
              <div className="flex items-center text-sm text-[#22C55E]">
                <ArrowUp className="h-4 w-4" />
                12.5%
              </div>
            </div>
            <div className="mt-1 text-xs text-[#94A3B8]">较上月增长</div>
          </CardContent>
        </Card>

        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">平均效率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-[#2563EB]">87.3%</div>
              <div className="flex items-center text-sm text-[#22C55E]">
                <ArrowUp className="h-4 w-4" />
                3.2%
              </div>
            </div>
            <div className="mt-1 text-xs text-[#94A3B8]">设备综合效率</div>
          </CardContent>
        </Card>

        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">运行时长</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-[#1E293B]">1,280h</div>
              <div className="flex items-center text-sm text-[#EF4444]">
                <ArrowDown className="h-4 w-4" />
                2.1%
              </div>
            </div>
            <div className="mt-1 text-xs text-[#94A3B8]">本月累计</div>
          </CardContent>
        </Card>

        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">故障率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-[#22C55E]">1.2%</div>
              <div className="flex items-center text-sm text-[#22C55E]">
                <ArrowDown className="h-4 w-4" />
                0.5%
              </div>
            </div>
            <div className="mt-1 text-xs text-[#94A3B8]">较上月降低</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 产量趋势 */}
        <Card className="border-[#E2E8F0]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#2563EB]" />
              <CardTitle className="text-lg text-[#1E293B]">产量趋势</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <AreaChartComponent 
              data={trendData} 
              dataKey="value" 
              color="#2563EB"
              height={250}
            />
          </CardContent>
        </Card>

        {/* 设备类型分布 */}
        <Card className="border-[#E2E8F0]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Box className="h-5 w-5 text-[#2563EB]" />
              <CardTitle className="text-lg text-[#1E293B]">设备类型分布</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={deviceTypeData} height={250} />
          </CardContent>
        </Card>

        {/* 运行效率 */}
        <Card className="border-[#E2E8F0]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#2563EB]" />
              <CardTitle className="text-lg text-[#1E293B]">本周运行效率</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <BarChartComponent 
              data={efficiencyData} 
              bars={[{ dataKey: 'value', name: '效率', color: '#3B82F6' }]}
              height={250}
            />
          </CardContent>
        </Card>

        {/* 能耗分析 */}
        <Card className="border-[#E2E8F0]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#2563EB]" />
              <CardTitle className="text-lg text-[#1E293B]">能耗分析</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#64748B]">本月总能耗</span>
                <span className="font-semibold text-[#1E293B]">45,680 kWh</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#64748B]">平均单台能耗</span>
                <span className="font-semibold text-[#1E293B]">456.8 kWh</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#64748B]">能耗成本</span>
                <span className="font-semibold text-[#1E293B]">¥36,544</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#64748B]">能效比</span>
                <span className="font-semibold text-[#22C55E]">92.3%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#F1F5F9]">
                <div className="h-2 w-[92%] rounded-full bg-[#22C55E]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
