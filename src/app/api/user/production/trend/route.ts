import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 生成最近7天的趋势数据
    const data = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        output: 800 + Math.random() * 400,
        efficiency: 85 + Math.random() * 10,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('获取生产趋势失败:', error);
    return NextResponse.json([]);
  }
}
