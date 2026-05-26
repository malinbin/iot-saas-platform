import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

/**
 * DTU 数据上报 API
 * 
 * POST /api/dtu/report
 * 
 * 请求格式：
 * {
 *   "device_id": "xxx",
 *   "timestamp": "2024-01-15T10:30:00Z",
 *   "data": {
 *     "temperature": 45.2,
 *     "pressure": 5.8,
 *     "speed": 3200,
 *     "efficiency": 92.3
 *   },
 *   "status": "online"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    
    const { device_id, timestamp, data, status = 'online' } = body;
    
    // 验证必要字段
    if (!device_id || !data) {
      return NextResponse.json(
        { success: false, error: '缺少必要字段: device_id, data' },
        { status: 400 }
      );
    }
    
    // 查询设备是否存在
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('id, template_id, vendor_id, status')
      .eq('id', device_id)
      .single();
    
    if (deviceError || !device) {
      return NextResponse.json(
        { success: false, error: '设备不存在' },
        { status: 404 }
      );
    }
    
    // 存储数据
    const recordedAt = timestamp ? new Date(timestamp) : new Date();
    const now = new Date();
    
    const { error: insertError } = await supabase
      .from('device_data')
      .insert({
        device_id,
        data,
        status,
        recorded_at: recordedAt.toISOString(),
        received_at: now.toISOString(),
      });
    
    if (insertError) {
      console.error('数据存储失败:', insertError);
      return NextResponse.json(
        { success: false, error: '数据存储失败' },
        { status: 500 }
      );
    }
    
    // 检查告警阈值
    if (device.template_id) {
      await checkAlerts(supabase, device_id, device.template_id, device.vendor_id, data);
    }
    
    // 更新设备最后在线时间
    await supabase
      .from('devices')
      .update({ 
        status,
        last_online_at: now.toISOString(),
      })
      .eq('id', device_id);
    
    return NextResponse.json({ 
      success: true, 
      message: '数据上报成功',
      recorded_at: recordedAt.toISOString(),
    });
    
  } catch (error) {
    console.error('DTU数据上报错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

/**
 * 检查告警阈值
 */
async function checkAlerts(
  supabase: ReturnType<typeof getSupabaseClient>,
  deviceId: string,
  templateId: string,
  vendorId: string,
  data: Record<string, number | string | boolean>
) {
  // 获取模板字段定义（包含告警阈值）
  const { data: fields } = await supabase
    .from('template_fields')
    .select('field_key, field_name, alert_min, alert_max, unit')
    .eq('template_id', templateId);
  
  if (!fields) return;
  
  for (const field of fields) {
    const value = data[field.field_key];
    if (typeof value !== 'number') continue;
    
    const alertMin = field.alert_min ? parseFloat(field.alert_min) : null;
    const alertMax = field.alert_max ? parseFloat(field.alert_max) : null;
    
    let alertLevel: string | null = null;
    let alertMessage: string | null = null;
    
    if (alertMin !== null && value < alertMin) {
      alertLevel = 'warning';
      alertMessage = `${field.field_name}过低: ${value}${field.unit || ''} < ${alertMin}${field.unit || ''}`;
    } else if (alertMax !== null && value > alertMax) {
      alertLevel = 'error';
      alertMessage = `${field.field_name}过高: ${value}${field.unit || ''} > ${alertMax}${field.unit || ''}`;
    }
    
    if (alertLevel && alertMessage) {
      // 检查是否已存在相同的活跃告警
      const { data: existingAlert } = await supabase
        .from('alerts')
        .select('id')
        .eq('device_id', deviceId)
        .eq('type', field.field_key)
        .eq('status', 'active')
        .single();
      
      if (!existingAlert) {
        // 创建告警
        await supabase
          .from('alerts')
          .insert({
            device_id: deviceId,
            vendor_id: vendorId,
            type: field.field_key,
            level: alertLevel,
            title: `${field.field_name}告警`,
            message: alertMessage,
            status: 'active',
            value: value,
            threshold: alertLevel === 'warning' ? alertMin : alertMax,
          });
      }
    }
  }
}
