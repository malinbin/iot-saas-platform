import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    // 获取设备总数和状态分布
    const { data: devices } = await supabase
      .from('devices')
      .select('*');
    
    const totalDevices = devices?.length || 0;
    const onlineDevices = devices?.filter(d => d.status === 'online').length || 0;
    const offlineDevices = devices?.filter(d => d.status === 'offline').length || 0;
    const faultDevices = devices?.filter(d => d.status === 'fault').length || 0;
    
    // 获取厂家数量
    const { count: totalVendors } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true });
    
    const { count: pendingVendors } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    // 获取用户数量
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });
    
    // 获取告警数量
    const { count: alertCount } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    // 计算收益（模拟）
    const monthlyRevenue = (totalVendors || 0) * 1000 + (totalDevices || 0) * 10;
    
    // 设备分布
    const deviceDistribution = [
      { name: '在线', value: onlineDevices, color: '#22C55E' },
      { name: '离线', value: offlineDevices, color: '#94A3B8' },
      { name: '故障', value: faultDevices, color: '#EF4444' },
    ];
    
    // 趋势数据（最近7天）
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trendData.push({
        date: date.toISOString().slice(5, 10),
        value: Math.floor(totalDevices * 0.8 + Math.random() * totalDevices * 0.2),
      });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalDevices,
          onlineDevices,
          offlineDevices,
          faultDevices,
          totalVendors: totalVendors || 0,
          pendingVendors: pendingVendors || 0,
          totalUsers: totalUsers || 0,
          alertCount: alertCount || 0,
          monthlyRevenue,
        },
        deviceDistribution,
        trendData,
      },
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
