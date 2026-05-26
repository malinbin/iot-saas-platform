import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const CONFIG_KEY = 'system_settings';

// 默认设置
const DEFAULT_SETTINGS = {
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

// 获取 Supabase admin client
function getAdminClient() {
  const url = process.env.COZE_SUPABASE_URL;
  const serviceKey = process.env.COZE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    console.error('缺少 Supabase URL 或 Service Role Key');
    return null;
  }
  
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// 获取系统设置
export async function GET() {
  try {
    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: '数据库客户端初始化失败' 
      }, { status: 500 });
    }
    
    const { data, error } = await supabase
      .from('system_config')
      .select('*')
      .eq('config_key', CONFIG_KEY)
      .maybeSingle();

    if (error) {
      console.error('获取系统设置失败:', error);
      return NextResponse.json({ 
        success: false, 
        error: '获取系统设置失败: ' + error.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      settings: data?.config_value || DEFAULT_SETTINGS,
    });
  } catch (error) {
    console.error('获取系统设置异常:', error);
    return NextResponse.json({ 
      success: false,
      error: '服务器内部错误: ' + (error instanceof Error ? error.message : String(error)) 
    }, { status: 500 });
  }
}

// 保存系统设置
export async function PUT(request: NextRequest) {
  try {
    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: '数据库客户端初始化失败' 
      }, { status: 500 });
    }
    
    const body = await request.json();
    
    console.log('保存系统设置，接收数据:', JSON.stringify(body, null, 2));
    
    // 先获取现有数据
    const { data: existing } = await supabase
      .from('system_config')
      .select('*')
      .eq('config_key', CONFIG_KEY)
      .maybeSingle();
    
    // 合并现有数据和新数据
    const currentData = existing?.config_value || DEFAULT_SETTINGS;
    const newData = { ...currentData, ...body };
    
    console.log('合并后的数据:', JSON.stringify(newData, null, 2));

    if (existing) {
      // 更新
      console.log('更新现有设置，ID:', existing.id);
      const { error: updateError } = await supabase
        .from('system_config')
        .update({
          config_value: newData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      
      if (updateError) {
        console.error('更新设置失败:', updateError);
        return NextResponse.json({ 
          success: false,
          error: '更新设置失败: ' + updateError.message 
        }, { status: 500 });
      }
      
      console.log('更新成功');
    } else {
      // 插入
      console.log('创建新设置');
      const { data: insertedData, error: insertError } = await supabase
        .from('system_config')
        .insert({
          config_key: CONFIG_KEY,
          config_value: newData,
        })
        .select()
        .maybeSingle();
      
      if (insertError) {
        console.error('插入设置失败:', insertError);
        return NextResponse.json({ 
          success: false,
          error: '插入设置失败: ' + insertError.message 
        }, { status: 500 });
      }
      
      console.log('插入成功，返回数据:', JSON.stringify(insertedData, null, 2));
    }
    
    // 验证保存结果
    const { data: saved, error: verifyError } = await supabase
      .from('system_config')
      .select('config_value')
      .eq('config_key', CONFIG_KEY)
      .maybeSingle();
    
    if (verifyError) {
      console.error('验证保存失败:', verifyError);
      return NextResponse.json({
        success: false,
        error: '验证保存失败: ' + verifyError.message
      }, { status: 500 });
    }

    console.log('保存验证成功，数据库中的数据:', JSON.stringify(saved?.config_value, null, 2));

    return NextResponse.json({
      success: true,
      settings: saved?.config_value || newData,
      message: '设置保存成功'
    });
  } catch (error) {
    console.error('保存系统设置异常:', error);
    return NextResponse.json({ 
      success: false,
      error: '服务器内部错误: ' + (error instanceof Error ? error.message : String(error)) 
    }, { status: 500 });
  }
}
