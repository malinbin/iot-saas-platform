import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const supabase = getSupabaseClient();
    
    // 获取用户ID
    const userId = 'demo-user-id';

    // 先获取用户拥有的设备ID列表
    const { data: userDevices } = await supabase
      .from('devices')
      .select('id')
      .eq('owner_id', userId);

    const deviceIds = userDevices?.map(d => d.id) || [];

    if (deviceIds.length === 0) {
      // 返回模拟数据
      return NextResponse.json(getMockAlerts(status));
    }

    let query = supabase
      .from('alerts')
      .select('id, type, level, title, message, status, created_at, device_id')
      .in('device_id', deviceIds)
      .order('created_at', { ascending: false })
      .limit(50);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`查询告警失败: ${error.message}`);
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('获取告警列表失败:', error);
    return NextResponse.json(getMockAlerts('all'));
  }
}

function getMockAlerts(status: string | null) {
  const alerts = [
    {
      id: '1',
      type: 'temperature',
      level: 'critical',
      title: '设备温度过高',
      message: '注塑机 A-001 温度达到 85°C，超过阈值 80°C，请立即处理',
      status: 'active',
      device_name: '注塑机 A-001',
      created_at: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: '2',
      type: 'pressure',
      level: 'warning',
      title: '压力偏低警告',
      message: '压缩机 D-001 压力降至 3.2MPa，建议检查',
      status: 'active',
      device_name: '压缩机 D-001',
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: '3',
      type: 'offline',
      level: 'error',
      title: '设备离线',
      message: '温控仪 E-001 已离线超过 24 小时',
      status: 'active',
      device_name: '温控仪 E-001',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '4',
      type: 'fault',
      level: 'critical',
      title: '检测仪故障',
      message: '检测仪 C-001 出现硬件故障，错误代码 E003',
      status: 'active',
      device_name: '检测仪 C-001',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '5',
      type: 'info',
      level: 'info',
      title: '设备维护提醒',
      message: '包装机 B-002 已运行 500 小时，建议进行例行维护',
      status: 'resolved',
      device_name: '包装机 B-002',
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  if (status && status !== 'all') {
    return alerts.filter(a => a.status === status);
  }
  return alerts;
}
