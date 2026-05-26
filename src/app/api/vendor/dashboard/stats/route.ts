import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    // 获取当前商家信息（模拟，实际应从认证获取）
    // TODO: 从 session 获取当前登录厂家
    const { data: vendors } = await supabase
      .from('vendors')
      .select('*')
      .eq('status', 'approved')
      .limit(1)
      .single();
    
    if (!vendors) {
      return NextResponse.json({
        success: true,
        data: {
          stats: {
            totalDevices: 0,
            onlineDevices: 0,
            faultDevices: 0,
            warningDevices: 0,
            offlineDevices: 0,
            totalCustomers: 0,
            monthlyNewDevices: 0,
          },
          trendData: [],
          deviceDistribution: [],
          vendor: null,
        },
      });
    }
    
    const vendorId = vendors.id;
    
    // 获取设备统计
    const { data: devices } = await supabase
      .from('devices')
      .select('*')
      .eq('vendor_id', vendorId);
    
    const totalDevices = devices?.length || 0;
    const onlineDevices = devices?.filter(d => d.status === 'online').length || 0;
    const faultDevices = devices?.filter(d => d.status === 'fault').length || 0;
    const warningDevices = devices?.filter(d => d.status === 'warning').length || 0;
    const offlineDevices = devices?.filter(d => d.status === 'offline').length || 0;
    
    // 获取客户数量
    const { count: totalCustomers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('vendor_id', vendorId);
    
    // 本月新增设备
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { count: monthlyNewDevices } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .eq('vendor_id', vendorId)
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    // 获取最近7天数据趋势
    const { data: recentData } = await supabase
      .from('device_data')
      .select('recorded_at')
      .order('recorded_at', { ascending: false })
      .limit(100);
    
    // 按天统计趋势
    const trendMap = new Map<string, { date: string; count: number }>();
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trendMap.set(dateStr, { date: dateStr, count: 0 });
    }
    
    recentData?.forEach(d => {
      const dateStr = d.recorded_at?.split('T')[0];
      if (dateStr && trendMap.has(dateStr)) {
        trendMap.get(dateStr)!.count++;
      }
    });
    
    const trendData = Array.from(trendMap.values()).map(d => ({
      date: d.date.slice(5), // MM-DD
      value: d.count,
    }));
    
    // 设备分布
    const deviceDistribution = [
      { name: '在线', value: onlineDevices, color: '#22C55E' },
      { name: '离线', value: offlineDevices, color: '#94A3B8' },
      { name: '故障', value: faultDevices, color: '#EF4444' },
      { name: '告警', value: warningDevices, color: '#F59E0B' },
    ];
    
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalDevices,
          onlineDevices,
          faultDevices,
          warningDevices,
          offlineDevices,
          totalCustomers: totalCustomers || 0,
          monthlyNewDevices: monthlyNewDevices || 0,
        },
        trendData,
        deviceDistribution,
        vendor: vendors,
      },
    });
  } catch (error) {
    console.error('Vendor dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
