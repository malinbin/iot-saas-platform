import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'week';
    
    const days = range === 'week' ? 7 : 30;
    const trend = [];
    const now = new Date();
    
    let totalOutput = 0;
    let totalRuntime = 0;
    let totalEfficiency = 0;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const output = 800 + Math.random() * 400;
      const efficiency = 85 + Math.random() * 10;
      const runtime = 3600 * 8 + Math.random() * 3600 * 2; // 8-10小时
      
      totalOutput += output;
      totalRuntime += runtime;
      totalEfficiency += efficiency;
      
      trend.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        output: Math.round(output),
        efficiency: Math.round(efficiency * 10) / 10,
        runtime: Math.round(runtime),
      });
    }

    const summary = {
      totalOutput: Math.round(totalOutput),
      avgEfficiency: Math.round((totalEfficiency / days) * 10) / 10,
      totalRuntime: Math.round(totalRuntime),
      faultCount: Math.floor(Math.random() * 5),
    };

    return NextResponse.json({ trend, summary });
  } catch (error) {
    console.error('获取报表数据失败:', error);
    return NextResponse.json({ trend: [], summary: {} });
  }
}
