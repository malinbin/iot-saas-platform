import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

/**
 * 数据解析处理 API
 * 
 * 接收DTU上报的数据，解析并匹配到对应设备
 */

interface ParsingResult {
  success: boolean;
  device_id?: string;
  device_name?: string;
  field?: string;
  value?: unknown;
  raw_data?: unknown;
  error?: string;
}

// 解析JSON数据
function parseJsonData(data: Record<string, unknown>, jsonPath?: string): unknown {
  if (!jsonPath) return data;
  
  const keys = jsonPath.split('.');
  let result: unknown = data;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return result;
}

// 应用数据转换
function transformValue(
  value: number,
  scale?: number,
  offset?: number
): number {
  let result = value;
  if (scale !== undefined && scale !== null) {
    result = result * scale;
  }
  if (offset !== undefined && offset !== null) {
    result = result + offset;
  }
  return result;
}

// 匹配设备并解析数据
async function matchAndParse(
  supabase: ReturnType<typeof getSupabaseClient>,
  dtuId: string,
  data: Record<string, unknown>,
  port?: number,
  topic?: string
): Promise<ParsingResult[]> {
  const results: ParsingResult[] = [];

  // 1. 获取该DTU的所有解析规则
  const { data: rules, error: rulesError } = await supabase
    .from('dtu_parsing_rules')
    .select(`
      *,
      target_device:devices(id, name, serial_number, device_type)
    `)
    .eq('dtu_id', dtuId)
    .eq('is_active', true);

  if (rulesError || !rules || rules.length === 0) {
    // 没有配置解析规则，返回原始数据
    return [{
      success: false,
      error: '未配置解析规则',
      raw_data: data
    }];
  }

  // 2. 遍历规则进行匹配
  for (const rule of rules) {
    let matched = false;
    let parsedValue: unknown = undefined;

    // 匹配检查
    switch (rule.match_type) {
      case 'port':
        // 端口匹配
        matched = rule.match_port === port || (rule.match_port === null && port === undefined);
        break;
      
      case 'topic':
        // 主题匹配（支持通配符）
        if (topic && rule.match_topic_pattern) {
          const pattern = rule.match_topic_pattern.replace(/\+/g, '[^/]+').replace(/#/g, '.*');
          const regex = new RegExp(`^${pattern}$`);
          matched = regex.test(topic);
        }
        break;
      
      case 'identifier':
        // 标识符匹配
        if (rule.match_identifier_field && rule.match_identifier_value) {
          const identifier = data[rule.match_identifier_field];
          matched = identifier === rule.match_identifier_value;
        }
        break;
      
      case 'all':
        // 匹配所有数据
        matched = true;
        break;
    }

    if (!matched) continue;

    // 3. 解析数据
    switch (rule.parsing_type) {
      case 'json':
        parsedValue = parseJsonData(data, rule.json_path);
        break;
      
      case 'modbus':
        // Modbus解析（简化版，实际需要更复杂的处理）
        parsedValue = data[`register_${rule.modbus_register}`];
        break;
      
      default:
        parsedValue = data;
    }

    // 4. 数据转换
    if (typeof parsedValue === 'number' && rule.data_scale !== null || rule.data_offset !== null) {
      parsedValue = transformValue(
        parsedValue as number,
        rule.data_scale ?? undefined,
        rule.data_offset ?? undefined
      );
    }

    // 5. 记录结果
    if (rule.target_device_id) {
      results.push({
        success: true,
        device_id: rule.target_device_id,
        device_name: rule.target_device?.name,
        field: rule.target_field,
        value: parsedValue,
        raw_data: data
      });

      // 6. 存储到设备数据历史表
      await supabase
        .from('device_data_history')
        .insert({
          device_id: rule.target_device_id,
          dtu_id: dtuId,
          raw_data: JSON.stringify(data),
          raw_data_type: 'json',
          parsed_data: {
            [rule.target_field || 'value']: parsedValue,
            unit: rule.data_unit
          },
          match_rule_id: rule.id,
          match_type: rule.match_type,
          received_at: new Date().toISOString()
        });
    }
  }

  return results;
}

// POST: 处理DTU上报的数据
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    const {
      dtu_id,           // DTU设备ID或UUID
      data,             // 上报的数据
      port,             // DTU端口号（可选）
      topic,            // MQTT主题（可选）
      timestamp         // 时间戳（可选）
    } = body;

    // 验证必填字段
    if (!dtu_id || !data) {
      return NextResponse.json(
        { error: 'dtu_id 和 data 为必填项' },
        { status: 400 }
      );
    }

    // 1. 获取DTU设备信息
    let dtuUuid = dtu_id;
    
    // 如果传入的是设备ID而不是UUID，需要查询
    const { data: dtuDevice } = await supabase
      .from('dtu_devices')
      .select('id')
      .or(`id.eq.${dtu_id},device_id.eq.${dtu_id}`)
      .single();

    if (dtuDevice) {
      dtuUuid = dtuDevice.id;
    }

    // 2. 解析数据并匹配设备
    const results = await matchAndParse(
      supabase,
      dtuUuid,
      typeof data === 'string' ? JSON.parse(data) : data,
      port,
      topic
    );

    // 3. 更新DTU最后数据时间
    await supabase
      .from('dtu_devices')
      .update({
        last_data_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', dtuUuid);

    return NextResponse.json({
      success: true,
      message: `处理完成，匹配到 ${results.filter(r => r.success).length} 个设备`,
      results,
      timestamp: timestamp || new Date().toISOString()
    });
  } catch (error) {
    console.error('数据处理错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '数据处理失败' },
      { status: 500 }
    );
  }
}

// GET: 获取设备数据历史
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const deviceId = searchParams.get('device_id');
    const dtuId = searchParams.get('dtu_id');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = supabase
      .from('device_data_history')
      .select(`
        *,
        device:devices(id, name, serial_number, device_type),
        dtu:dtu_devices(id, device_id, name)
      `)
      .order('received_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (deviceId) {
      query = query.eq('device_id', deviceId);
    }
    if (dtuId) {
      query = query.eq('dtu_id', dtuId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取数据历史失败' },
      { status: 500 }
    );
  }
}
