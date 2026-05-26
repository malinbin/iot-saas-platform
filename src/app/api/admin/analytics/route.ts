import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  const supabase = getSupabaseClient();

  try {
    // 获取厂家统计
    const { data: vendors } = await supabase
      .from('vendors')
      .select('id, is_active');

    const totalVendors = vendors?.length || 0;
    const activeVendors = vendors?.filter(v => v.is_active).length || 0;

    // 获取设备统计
    const { data: devices } = await supabase
      .from('devices')
      .select('id, status');

    const totalDevices = devices?.length || 0;
    const onlineDevices = devices?.filter(d => d.status === 'online').length || 0;
    const offlineDevices = devices?.filter(d => d.status === 'offline').length || 0;
    const faultDevices = devices?.filter(d => d.status === 'fault').length || 0;

    // 获取用户统计
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('id', { count: 'exact', head: true });

    // 获取告警统计
    const { count: activeAlerts } = await supabase
      .from('alerts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active');

    // 计算比率
    const deviceOnlineRate = totalDevices > 0 ? (onlineDevices / totalDevices) * 100 : 0;
    const vendorActiveRate = totalVendors > 0 ? (activeVendors / totalVendors) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalVendors,
        activeVendors,
        totalDevices,
        onlineDevices,
        offlineDevices,
        faultDevices,
        totalUsers: totalUsers || 0,
        activeAlerts: activeAlerts || 0,
        deviceOnlineRate,
        vendorActiveRate,
      },
    });
  } catch (error) {
    console.error('获取分析数据失败:', error);
    return NextResponse.json({ error: '获取分析数据失败' }, { status: 500 });
  }
}
