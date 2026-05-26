'use client';

import { FileText, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChartComponent } from '@/components/charts';
import { generateRevenueTrend } from '@/lib/mock-data';

export default function UserReportsPage() {
  const productionData = generateRevenueTrend();

  // 报表数据
  const reports = [
    {
      id: 1,
      name: '2024年1月生产报表',
      date: '2024-01-31',
      type: '月报',
      size: '2.3 MB',
    },
    {
      id: 2,
      name: '2024年2月生产报表',
      date: '2024-02-29',
      type: '月报',
      size: '2.1 MB',
    },
    {
      id: 3,
      name: '2024年3月生产报表',
      date: '2024-03-31',
      type: '月报',
      size: '2.5 MB',
    },
    {
      id: 4,
      name: '2024年第1季度生产报表',
      date: '2024-03-31',
      type: '季报',
      size: '5.8 MB',
    },
  ];

  // 柱状图数据 - 移除 Math.random 使用固定值
  const barData = productionData.map((item) => ({
    month: item.month.split('-')[1] + '月',
    output: item.devices * 120,
    efficiency: 90,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">生产报表</h1>
          <p className="text-sm text-[#64748B]">查看和下载生产数据报表</p>
        </div>
        <Button className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
          <Download className="mr-2 h-4 w-4" />
          导出报表
        </Button>
      </div>

      {/* Chart */}
      <Card className="border-[#E0F2FE] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#0F172A]">
            月度产量统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChartComponent
            data={barData}
            xAxisKey="month"
            bars={[
              { dataKey: 'output', name: '产量', color: '#0EA5E9' },
            ]}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card className="border-[#E0F2FE] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#0F172A]">历史报表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[#64748B]">报表名称</TableHead>
                <TableHead className="text-[#64748B]">生成日期</TableHead>
                <TableHead className="text-[#64748B]">类型</TableHead>
                <TableHead className="text-[#64748B]">大小</TableHead>
                <TableHead className="text-[#64748B]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-[#F8FAFC]">
                  <TableCell className="font-medium text-[#0F172A]">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#0EA5E9]" />
                      {report.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#64748B]">{report.date}</TableCell>
                  <TableCell className="text-[#64748B]">{report.type}</TableCell>
                  <TableCell className="text-[#64748B]">{report.size}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#E0F2FE] text-[#0EA5E9] hover:bg-[#F0F9FF]"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      下载
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm text-[#64748B]">本月产量</div>
            <div className="mt-2 text-3xl font-bold text-[#0F172A]">
              15,280
            </div>
            <div className="mt-1 text-xs text-[#22C55E]">↑ 12.5%</div>
          </CardContent>
        </Card>
        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm text-[#64748B]">本月运行时长</div>
            <div className="mt-2 text-3xl font-bold text-[#0F172A]">
              486.5h
            </div>
            <div className="mt-1 text-xs text-[#22C55E]">↑ 8.2%</div>
          </CardContent>
        </Card>
        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm text-[#64748B]">平均效率</div>
            <div className="mt-2 text-3xl font-bold text-[#22C55E]">
              94.2%
            </div>
            <div className="mt-1 text-xs text-[#22C55E]">↑ 3.1%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
