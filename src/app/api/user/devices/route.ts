import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const supabase = getSupabaseClient();
    
    // 获取用户ID（从请求头或session中获取）
    const userId = 'demo-user-id';

    let query = supabase
      .from('devices')
      .select('id, name, serial_number, status, device_type, location, last_heartbeat_at')
      .eq('owner_id', userId)
      .order('name', { ascending: true });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`查询设备失败: ${error.message}`);
    }

    // 如果没有数据，返回模拟数据
    if (!data || data.length === 0) {
      const mockDevices = [
        {
          id: '1',
          name: '注塑机 A-001',
          serial_number: 'SN20240001',
          status: 'online',
          device_type: '生产设备',
          location: '车间 A - 1号线',
          last_heartbeat_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: '包装机 B-002',
          serial_number: 'SN20240002',
          status: 'online',
          device_type: '生产设备',
          location: '车间 B - 2号线',
          last_heartbeat_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: '检测仪 C-001',
          serial_number: 'SN20240003',
          status: 'fault',
          device_type: '检测设备',
          location: '车间 C - 质检区',
          last_heartbeat_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '4',
          name: '压缩机 D-001',
          serial_number: 'SN20240004',
          status: 'online',
          device_type: '辅助设备',
          location: '机房 D',
          last_heartbeat_at: new Date().toISOString(),
        },
        {
          id: '5',
          name: '温控仪 E-001',
          serial_number: 'SN20240005',
          status: 'offline',
          device_type: '监控设备',
          location: '仓库 E',
          last_heartbeat_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      if (status && status !== 'all') {
        return NextResponse.json(mockDevices.filter(d => d.status === status));
      }
      return NextResponse.json(mockDevices);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('获取设备列表失败:', error);
    return NextResponse.json([]);
  }
}
