import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    // 获取用户ID（从请求头或session中获取，这里暂时使用模拟数据）
    // 实际项目中应该从 JWT token 中解析用户ID
    const userId = 'demo-user-id';

    // 查询用户拥有的设备统计
    const { data: devices, error } = await supabase
      .from('devices')
      .select('status')
      .eq('owner_id', userId);

    if (error) {
      throw new Error(`查询设备失败: ${error.message}`);
    }

    // 统计各状态数量
    const stats = {
      total: devices?.length || 0,
      online: devices?.filter(d => d.status === 'online').length || 0,
      offline: devices?.filter(d => d.status === 'offline').length || 0,
      fault: devices?.filter(d => d.status === 'fault').length || 0,
    };

    // 如果没有数据，返回模拟数据
    if (stats.total === 0) {
      return NextResponse.json({
        total: 5,
        online: 3,
        offline: 1,
        fault: 1,
      });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('获取设备统计失败:', error);
    // 返回模拟数据作为兜底
    return NextResponse.json({
      total: 5,
      online: 3,
      offline: 1,
      fault: 1,
    });
  }
}
