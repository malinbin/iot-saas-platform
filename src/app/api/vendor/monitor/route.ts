import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    
    // 获取厂家ID（实际应该从认证token获取）
    const vendorId = searchParams.get('vendorId') || 'default-vendor';

    if (deviceId) {
      // 获取单个设备的实时数据
      const { data: device, error: deviceError } = await supabase
        .from('devices')
        .select(`
          id,
          name,
          device_code,
          status,
          location,
          template:device_templates (
            id,
            name,
            fields:template_fields (*)
          )
        `)
        .eq('id', deviceId)
        .single();

      if (deviceError) {
        return NextResponse.json(
          { success: false, error: deviceError.message },
          { status: 500 }
        );
      }

      // 获取最新数据
      const { data: latestData } = await supabase
        .from('device_data')
        .select('*')
        .eq('device_id', deviceId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      return NextResponse.json({
        success: true,
        data: {
          device,
          latestData: latestData?.data || {},
          recordedAt: latestData?.recorded_at || null
        }
      });
    }

    // 获取厂家的所有设备
    const { data: devices, error } = await supabase
      .from('devices')
      .select(`
        id,
        name,
        device_code,
        status,
        location,
        template:device_templates (
          id,
          name
        )
      `)
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: devices || []
    });
  } catch (error) {
    console.error('Monitor API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
