'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChartComponent } from '@/components/charts/area-chart';
import { PieChartComponent } from '@/components/charts/pie-chart';
import { BarChartComponent } from '@/components/charts/bar-chart';
import { 
  TrendingUp, 
  Activity, 
  Building2,
  DollarSign,
  Box,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const revenueData = [
  { date: '01月', value: 125000 },
  { date: '02月', value: 145000 },
  { date: '03月', value: 138000 },
  { date: '04月', value: 168000 },
  { date: '05月', value: 189000 },
  { date: '06月', value: 215000 },
];

const vendorDistribution = [
  { name: '华东地区', value: 35, color: '#2563EB' },
  { name: '华南地区', value: 28, color: '#3B82F6' },
  { name: '华北地区', value: 20, color: '#60A5FA' },
  { name: '西南地区', value: 12, color: '#93C5FD' },
  { name: '其他', value: 5, color: '#BFDBFE' },
];

const deviceGrowth = [
  { name: '1月', value: 120 },
  { name: '2月', value: 145 },
  { name: '3月', value: 138 },
  { name: '4月', value: 168 },
  { name: '5月', value: 189 },
  { name: '6月', value: 215 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">数据分析</h1>
        <p className="text-sm text-[#94A3B8]">平台整体运营数据分析</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">本月营收</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">¥215,000</div>
              <div className="flex items-center text-sm text-[#22C55E]">
                <ArrowUp className="h-4 w-4" />
                15.2%
              </div>
            </div>
            <div className="mt-1 text-xs text-[#64748B]">较上月增长</div>
          </CardContent>
        </Card>

        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">活跃厂家</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-[#2563EB]">156</div>
              <div className="flex items-center text-sm text-[#22C55E]">
                <ArrowUp className="h-4 w-4" />
                8
              </div>
            </div>
            <div className="mt-1 text-xs text-[#64748B]">本月新增</div>
          </CardContent>
        </Card>

        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">设备增长</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">+2,450</div>
              <div className="flex items-center text-sm text-[#22C55E]">
                <ArrowUp className="h-4 w-4" />
                18.5%
              </div>
            </div>
            <div className="mt-1 text-xs text-[#64748B]">本月新增设备</div>
          </CardContent>
        </Card>

        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">平台利润率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-[#22C55E]">23.5%</div>
              <div className="flex items-center text-sm text-[#EF4444]">
                <ArrowDown className="h-4 w-4" />
                1.2%
              </div>
            </div>
            <div className="mt-1 text-xs text-[#64748B]">较上月下降</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 营收趋势 */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#2563EB]" />
              <CardTitle className="text-lg text-white">营收趋势</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <AreaChartComponent 
              data={revenueData} 
              dataKey="value" 
              color="#2563EB"
              height={250}
            />
          </CardContent>
        </Card>

        {/* 厂家分布 */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#2563EB]" />
              <CardTitle className="text-lg text-white">厂家地区分布</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={vendorDistribution} height={250} />
          </CardContent>
        </Card>

        {/* 设备增长 */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Box className="h-5 w-5 text-[#2563EB]" />
              <CardTitle className="text-lg text-white">设备增长趋势</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <BarChartComponent 
              data={deviceGrowth} 
              bars={[{ dataKey: 'value', name: '新增设备', color: '#3B82F6' }]}
              height={250}
            />
          </CardContent>
        </Card>

        {/* 运营指标 */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#2563EB]" />
              <CardTitle className="text-lg text-white">核心运营指标</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94A3B8]">设备在线率</span>
                  <span className="font-medium text-white">94.5%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#0A1628]">
                  <div className="h-2 w-[94.5%] rounded-full bg-[#22C55E]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94A3B8]">客户满意度</span>
                  <span className="font-medium text-white">92.3%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#0A1628]">
                  <div className="h-2 w-[92.3%] rounded-full bg-[#2563EB]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94A3B8]">厂家留存率</span>
                  <span className="font-medium text-white">88.7%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#0A1628]">
                  <div className="h-2 w-[88.7%] rounded-full bg-[#3B82F6]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#94A3B8]">续费率</span>
                  <span className="font-medium text-white">85.2%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#0A1628]">
                  <div className="h-2 w-[85.2%] rounded-full bg-[#60A5FA]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
