import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const SETTINGS_BUSINESS_ID = 'system_settings';
const SETTINGS_BUSINESS_TYPE = 'system';

// 获取系统设置
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('configurations')
      .select('*')
      .eq('business_id', SETTINGS_BUSINESS_ID)
      .eq('business_type', SETTINGS_BUSINESS_TYPE)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('获取系统设置失败:', error);
      return NextResponse.json({ error: '获取系统设置失败' }, { status: 500 });
    }

    // 如果没有设置，返回默认值
    const defaultSettings = {
      // 平台信息
      platformName: '工业物联网管理平台',
      platformDomain: 'iot.example.com',
      supportEmail: 'support@iot.com',
      supportPhone: '400-888-8888',
      
      // 告警规则
      offlineThreshold: 30,
      faultAutoEscalate: 60,
      autoSmsAlert: true,
      
      // 安全配置
      loginFailLock: 5,
      sessionTimeout: 120,
      forceTwoFactor: true,
      ipWhitelist: false,
      ipWhitelistValues: '',
      
      // 数据配置
      collectInterval: 30,
      dataRetention: 365,
      autoArchive: true,
      
      // API密钥
      apiKey: '',
      apiSecret: '',
    };

    return NextResponse.json({
      success: true,
      settings: data?.data || defaultSettings,
    });
  } catch (error) {
    console.error('获取系统设置异常:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}

// 保存系统设置
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    
    // 检查是否已存在设置
    const { data: existing } = await supabase
      .from('configurations')
      .select('id')
      .eq('business_id', SETTINGS_BUSINESS_ID)
      .eq('business_type', SETTINGS_BUSINESS_TYPE)
      .single();

    let result;
    if (existing) {
      // 更新
      result = await supabase
        .from('configurations')
        .update({
          data: body,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      // 创建
      result = await supabase
        .from('configurations')
        .insert({
          business_id: SETTINGS_BUSINESS_ID,
          business_type: SETTINGS_BUSINESS_TYPE,
          data: body,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('保存系统设置失败:', result.error);
      return NextResponse.json({ error: '保存系统设置失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      settings: result.data?.data || body,
    });
  } catch (error) {
    console.error('保存系统设置异常:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
