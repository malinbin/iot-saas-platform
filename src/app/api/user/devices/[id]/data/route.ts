import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

/**
 * 用户端设备数据读取 API
 * 
 * GET /api/user/devices/[id]/data
 * 
 * 返回格式：
 * {
 *   "device": { 设备信息 },
 *   "template": { 模板信息 },
 *   "fields": [ 字段定义 ],
 *   "latestData": { 最新数据 },
 *   "historyData": [ 历史数据 ]
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id: deviceId } = await params;
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24', 10);
    
    // 获取设备信息
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select(`
        id,
        name,
        device_sn,
        status,
        template_id,
        owner_id,
        vendor_id,
        last_online_at,
        created_at,
        vendors (
          id,
          name
        )
      `)
      .eq('id', deviceId)
      .single();
    
    if (deviceError || !device) {
      return NextResponse.json(
        { success: false, error: '设备不存在' },
        { status: 404 }
      );
    }
    
    // 获取模板和字段定义
    let template = null;
    let fields: Array<{
      field_key: string;
      field_name: string;
      field_type: string;
      unit: string | null;
      icon: string | null;
      color: string | null;
      chart_type: string | null;
      alert_min: string | null;
      alert_max: string | null;
      show_in_dashboard: boolean;
      show_in_detail: boolean;
      sort_order: number;
    }> = [];
    
    if (device.template_id) {
      const { data: templateData } = await supabase
        .from('device_templates')
        .select('id, name, code, category, icon, dashboard_config')
        .eq('id', device.template_id)
        .single();
      
      template = templateData;
      
      // 获取字段定义
      const { data: fieldsData } = await supabase
        .from('template_fields')
        .select(`
          field_key,
          field_name,
          field_type,
          unit,
          icon,
          color,
          chart_type,
          alert_min,
          alert_max,
          show_in_dashboard,
          show_in_detail,
          sort_order
        `)
        .eq('template_id', device.template_id)
        .order('sort_order', { ascending: true });
      
      fields = fieldsData || [];
    }
    
    // 获取最新数据
    const { data: latestData } = await supabase
      .from('device_data')
      .select('data, status, recorded_at')
      .eq('device_id', deviceId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();
    
    // 获取历史数据（用于图表）
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);
    
    const { data: historyData } = await supabase
      .from('device_data')
      .select('data, recorded_at')
      .eq('device_id', deviceId)
      .gte('recorded_at', startTime.toISOString())
      .order('recorded_at', { ascending: true })
      .limit(1000);
    
    // 组装字段数据
    const fieldData = fields.map(field => {
      const latestValue = latestData?.data?.[field.field_key] ?? null;
      
      // 获取历史数据
      const history = (historyData || []).map(item => ({
        time: item.recorded_at,
        value: item.data?.[field.field_key] ?? null,
      })).filter(item => item.value !== null);
      
      // 检查告警状态
      let alertStatus: 'normal' | 'warning' | 'error' = 'normal';
      if (latestValue !== null && typeof latestValue === 'number') {
        const alertMin = field.alert_min ? parseFloat(field.alert_min) : null;
        const alertMax = field.alert_max ? parseFloat(field.alert_max) : null;
        
        if (alertMin !== null && latestValue < alertMin) {
          alertStatus = 'warning';
        } else if (alertMax !== null && latestValue > alertMax) {
          alertStatus = 'error';
        }
      }
      
      return {
        ...field,
        value: latestValue,
        alert_status: alertStatus,
        history,
      };
    });
    
    return NextResponse.json({
      success: true,
      data: {
        device: {
          ...device,
          vendor_name: Array.isArray(device.vendors) 
            ? (device.vendors[0] as { id: string; name: string })?.name 
            : (device.vendors as { id: string; name: string })?.name,
        },
        template,
        fields: fieldData,
        latest_data: latestData,
        online_status: latestData?.status || device.status,
        last_recorded_at: latestData?.recorded_at || device.last_online_at,
      },
    });
    
  } catch (error) {
    console.error('获取设备数据错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
