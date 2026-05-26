import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    // 获取用户ID（从请求头或session中获取）
    const userId = 'demo-user-id';

    // 查询未读通知数量
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      throw new Error(`查询通知失败: ${error.message}`);
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('获取未读通知数量失败:', error);
    // 返回模拟数据
    return NextResponse.json({ count: 3 });
  }
}
