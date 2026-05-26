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
    
    // 获取 DTU 配置列表
    const { data: dtuConfigs, error } = await supabase
      .from('dtu_configs')
      .select(`
        *,
        devices(name, code)
      `)
      .eq('vendor_id', vendors.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Fetch DTU configs error:', error);
      return NextResponse.json({ success: true, data: [] });
    }
    
    const formattedConfigs = (dtuConfigs || []).map((config: any) => ({
      id: config.id,
      deviceId: config.device_id,
      deviceName: config.devices?.name || '未关联设备',
      deviceCode: config.devices?.code || '',
      protocol: config.protocol,
      serverAddress: config.server_address,
      port: config.port,
      username: config.username,
      reportInterval: config.report_interval,
      isActive: config.is_active,
      createdAt: config.created_at,
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedConfigs,
    });
  } catch (error) {
    console.error('Vendor DTU configs fetch error:', error);
    return NextResponse.json(
      { success: false, error: '获取DTU配置失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseClient();
    
    // TODO: 从 session 获取当前登录厂家
    const { data: vendors } = await supabase
      .from('vendors')
      .select('*')
      .eq('status', 'approved')
      .limit(1)
      .single();
    
    if (!vendors) {
      return NextResponse.json(
        { success: false, error: '未找到厂家信息' },
        { status: 400 }
      );
    }
    
    const configData = {
      vendor_id: vendors.id,
      device_id: body.deviceId || null,
      protocol: body.protocol || 'mqtt',
      server_address: body.serverAddress,
      port: body.port || 1883,
      username: body.username,
      password: body.password,
      report_interval: body.reportInterval || 30,
      is_active: true,
    };
    
    const { data, error } = await supabase
      .from('dtu_configs')
      .insert(configData)
      .select()
      .single();
    
    if (error) {
      console.error('Create DTU config error:', error);
      return NextResponse.json(
        { success: false, error: '创建DTU配置失败' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data,
      message: 'DTU配置创建成功',
    });
  } catch (error) {
    console.error('Create DTU config error:', error);
    return NextResponse.json(
      { success: false, error: '创建DTU配置失败' },
      { status: 500 }
    );
  }
}
