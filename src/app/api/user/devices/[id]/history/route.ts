import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

/**
 * 用户端设备历史数据查询 API
 * 
 * GET /api/user/devices/[id]/history?field=temperature&hours=24
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id: deviceId } = await params;
    const { searchParams } = new URL(request.url);
    
    const field = searchParams.get('field'); // 字段键名
    const hours = parseInt(searchParams.get('hours') || '24', 10);
    const limit = parseInt(searchParams.get('limit') || '200', 10);
    
    if (!field) {
      return NextResponse.json(
        { success: false, error: '缺少字段参数: field' },
        { status: 400 }
      );
    }
    
    // 验证设备是否存在
    const { data: device } = await supabase
      .from('devices')
      .select('id')
      .eq('id', deviceId)
      .single();
    
    if (!device) {
      return NextResponse.json(
        { success: false, error: '设备不存在' },
        { status: 404 }
      );
    }
    
    // 查询历史数据
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);
    
    const { data: historyData, error } = await supabase
      .from('device_data')
      .select('data, recorded_at')
      .eq('device_id', deviceId)
      .gte('recorded_at', startTime.toISOString())
      .order('recorded_at', { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error('查询历史数据错误:', error);
      return NextResponse.json(
        { success: false, error: '查询失败' },
        { status: 500 }
      );
    }
    
    // 提取指定字段的数据
    const result = (historyData || []).map(item => ({
      time: item.recorded_at,
      value: item.data?.[field] ?? null,
    })).filter(item => item.value !== null);
    
    return NextResponse.json({
      success: true,
      data: {
        field,
        hours,
        count: result.length,
        history: result,
      },
    });
    
  } catch (error) {
    console.error('获取历史数据错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
