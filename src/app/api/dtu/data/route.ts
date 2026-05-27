import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

/**
 * DTU数据上报API
 * 
 * 支持两种方式：
 * 1. HTTP POST - DTU直接上报数据
 * 2. MQTT回调 - MQTT服务转发数据
 * 
 * 请求格式：
 * {
 *   "device_id": "DTU001",      // 设备ID
 *   "imei": "86758xxxxx",       // IMEI号
 *   "iccid": "89860xxxxx",      // ICCID号
 *   "data": {...},              // 上报的数据
 *   "raw": "原始数据",          // 原始数据(可选)
 *   "topic": "device/DTU001/data", // MQTT主题(可选)
 *   "signal": 25,               // 信号强度(可选)
 *   "type": "data|heartbeat|register" // 消息类型
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      device_id,
      imei,
      iccid,
      data,
      raw,
      topic,
      signal,
      type = 'data',
    } = body;

    if (!device_id && !imei) {
      return NextResponse.json(
        { error: 'device_id 或 imei 必填' },
        { status: 400 }
      );
    }

    // 查找或创建设备
    let dtuDevice = null;
    
    // 先按device_id查找
    if (device_id) {
      const { data: found } = await supabase
        .from('dtu_devices')
        .select('*')
        .eq('device_id', device_id)
        .single();
      dtuDevice = found;
    }
    
    // 如果没找到，按imei查找
    if (!dtuDevice && imei) {
      const { data: found } = await supabase
        .from('dtu_devices')
        .select('*')
        .eq('imei', imei)
        .single();
      dtuDevice = found;
    }

    const now = new Date().toISOString();

    if (type === 'register') {
      // 设备注册包 - 首次上线
      if (dtuDevice) {
        // 更新设备状态
        const { error } = await supabase
          .from('dtu_devices')
          .update({
            online: true,
            last_heartbeat_at: now,
            signal_strength: signal,
            imei: imei || dtuDevice.imei,
            iccid: iccid || dtuDevice.iccid,
            updated_at: now,
          })
          .eq('id', dtuDevice.id);
        
        if (error) {
          console.error('Update DTU error:', error);
        }
      } else {
        // 自动创建新设备
        const { data: newDevice, error } = await supabase
          .from('dtu_devices')
          .insert({
            device_id: device_id || imei,
            imei: imei,
            iccid: iccid,
            name: `DTU-${device_id || imei}`,
            online: true,
            last_heartbeat_at: now,
            signal_strength: signal,
          })
          .select()
          .single();
        
        if (!error) {
          dtuDevice = newDevice;
        }
      }

      return NextResponse.json({
        success: true,
        message: '设备注册成功',
        device_id: dtuDevice?.device_id || device_id,
      });
    }

    if (type === 'heartbeat') {
      // 心跳包
      if (dtuDevice) {
        await supabase
          .from('dtu_devices')
          .update({
            online: true,
            last_heartbeat_at: now,
            signal_strength: signal,
            updated_at: now,
          })
          .eq('id', dtuDevice.id);
      }

      return NextResponse.json({
        success: true,
        message: '心跳更新成功',
      });
    }

    // 数据上报
    if (!dtuDevice) {
      // 自动创建设备
      const { data: newDevice, error: insertError } = await supabase
        .from('dtu_devices')
        .insert({
          device_id: device_id || imei,
          imei: imei,
          iccid: iccid,
          name: `DTU-${device_id || imei}`,
          online: true,
          last_data_at: now,
          last_heartbeat_at: now,
          signal_strength: signal,
        })
        .select()
        .single();
      
      if (insertError || !newDevice) {
        return NextResponse.json(
          { error: '创建设备失败: ' + (insertError?.message || '未知错误') },
          { status: 500 }
        );
      }
      
      dtuDevice = newDevice;
    } else {
      // 更新设备状态
      await supabase
        .from('dtu_devices')
        .update({
          online: true,
          last_data_at: now,
          signal_strength: signal,
          updated_at: now,
        })
        .eq('id', dtuDevice.id);
    }

    // 保存数据记录
    if (!dtuDevice) {
      return NextResponse.json(
        { error: '设备信息获取失败' },
        { status: 500 }
      );
    }

    const { data: dataRecord, error: dataError } = await supabase
      .from('dtu_data')
      .insert({
        dtu_id: dtuDevice.id,
        raw_data: raw || JSON.stringify(data),
        parsed_data: data,
        topic: topic,
        direction: 'up',
        received_at: now,
      })
      .select()
      .single();

    if (dataError) {
      console.error('Save DTU data error:', dataError);
    }

    return NextResponse.json({
      success: true,
      message: '数据上报成功',
      data_id: dataRecord?.id,
    });
  } catch (error) {
    console.error('DTU data API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    );
  }
}

// 获取DTU设备列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendor_id');
    const deviceId = searchParams.get('device_id');
    const online = searchParams.get('online');

    let query = supabase
      .from('dtu_devices')
      .select('*')
      .order('created_at', { ascending: false });

    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }
    if (deviceId) {
      query = query.eq('device_id', deviceId);
    }
    if (online !== null) {
      query = query.eq('online', online === 'true');
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    );
  }
}
