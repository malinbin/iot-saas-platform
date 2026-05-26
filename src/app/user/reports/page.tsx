'use client';

import { useEffect, useState } from 'react';
import { MobileHeader } from '@/components/user/mobile-header';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { cn } from '@/lib/utils';

interface ReportData {
  date: string;
  output: number;
  efficiency: number;
  runtime: number;
}

export default function UserReportsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [summary, setSummary] = useState({
    totalOutput: 0,
    avgEfficiency: 0,
    totalRuntime: 0,
    faultCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      const res = await fetch(`/api/user/reports?range=${timeRange}`);
      if (res.ok) {
        const data = await res.json();
        setReportData(data.trend || []);
        setSummary(data.summary || {
          totalOutput: 0,
          avgEfficiency: 0,
          totalRuntime: 0,
          faultCount: 0,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('获取报表数据失败:', error);
      setLoading(false);
    }
  };

  const formatRuntime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MobileHeader 
        title="生产报表" 
        rightAction={
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <Download className="h-5 w-5" />
          </button>
        }
      />
      
      <div className="px-4 py-4 space-y-4">
        {/* 时间范围选择 */}
        <div className="flex gap-2">
          {(['week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'flex-1 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2',
                timeRange === range
                  ? 'bg-[#0EA5E9] text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              )}
            >
              <Calendar className="h-4 w-4" />
              {range === 'week' ? '本周' : '本月'}
            </button>
          ))}
        </div>

        {/* 汇总数据 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <BarChart3 className="h-4 w-4" />
              <span>总产量</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.totalOutput.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">件</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span>平均效率</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.avgEfficiency.toFixed(1)}%</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div 
                className="bg-green-500 rounded-full h-1.5" 
                style={{ width: `${summary.avgEfficiency}%` }}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <TrendingDown className="h-4 w-4" />
              <span>运行时长</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatRuntime(summary.totalRuntime)}</p>
            <p className="text-xs text-gray-400 mt-1">总运行时长</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span>故障次数</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.faultCount}</p>
            <p className="text-xs text-gray-400 mt-1">累计故障</p>
          </div>
        </div>

        {/* 产量趋势图 */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-4">产量趋势</h2>
          
          <div className="h-48">
            {reportData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  />
                  <YAxis hide />
                  <Area 
                    type="monotone" 
                    dataKey="output" 
                    stroke="#0EA5E9" 
                    fill="#0EA5E9" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                暂无数据
              </div>
            )}
          </div>
        </div>

        {/* 效率柱状图 */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-4">效率分析</h2>
          
          <div className="h-48">
            {reportData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Bar 
                    dataKey="efficiency" 
                    fill="#22C55E" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                暂无数据
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
