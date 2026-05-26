import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    // TODO: 从 session 获取当前登录厂家
    const { data: vendors } = await supabase
      .from('vendors')
      .select('*')
      .eq('status', 'approved')
      .limit(1)
      .single();
    
    if (!vendors) {
      return NextResponse.json({ success: true, data: [] });
    }
    
    // 获取告警列表
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select(`
        *,
        devices!inner(name, code, vendor_id)
      `)
      .eq('devices.vendor_id', vendors.id)
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error('Fetch alerts error:', error);
      return NextResponse.json({ success: true, data: [] });
    }
    
    // 格式化数据
    const formattedAlerts = (alerts || []).map((alert: any) => ({
      id: alert.id,
      deviceName: alert.devices?.name || '未知设备',
      deviceCode: alert.devices?.code || '',
      level: alert.level,
      type: alert.type,
      message: alert.message,
      status: alert.status,
      createdAt: alert.created_at,
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedAlerts,
    });
  } catch (error) {
    console.error('Vendor alerts fetch error:', error);
    return NextResponse.json(
      { success: false, error: '获取告警列表失败' },
      { status: 500 }
    );
  }
}
