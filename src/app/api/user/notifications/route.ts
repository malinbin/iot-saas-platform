import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    // 获取用户ID
    const userId = 'demo-user-id';

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`查询通知失败: ${error.message}`);
    }

    // 如果没有数据，返回模拟数据
    if (!data || data.length === 0) {
      return NextResponse.json([
        {
          id: '1',
          type: 'alert',
          title: '设备告警',
          message: '注塑机 A-001 温度过高，已超过安全阈值',
          is_read: false,
          created_at: new Date(Date.now() - 300000).toISOString(),
        },
        {
          id: '2',
          type: 'system',
          title: '系统通知',
          message: '您的账号已成功登录移动端',
          is_read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          type: 'device',
          title: '设备状态变更',
          message: '包装机 B-002 已恢复正常运行',
          is_read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '4',
          type: 'alert',
          title: '维护提醒',
          message: '检测仪 C-001 需要进行例行维护',
          is_read: true,
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('获取通知列表失败:', error);
    return NextResponse.json([]);
  }
}

// 标记全部已读
export async function POST() {
  try {
    const supabase = getSupabaseClient();
    
    const userId = 'demo-user-id';

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      throw new Error(`标记已读失败: ${error.message}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('标记全部已读失败:', error);
    return NextResponse.json({ success: false });
  }
}
