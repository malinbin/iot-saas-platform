# DTU 设备通信对接指南

## 概述

DTU（Data Transfer Unit，数据传输单元）是连接工业设备与云平台的桥梁。本指南说明如何对接 DTU 实现设备数据的实时采集与远程控制。

---

## 一、架构说明

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  工业设备   │ ←──→ │    DTU      │ ←──→ │  云平台     │
│ (PLC/传感器)│      │  (通信模块)  │      │ (本项目)    │
└─────────────┘      └─────────────┘      └─────────────┘
                           │
                           ↓
                    ┌─────────────┐
                    │  消息队列   │
                    │ (MQTT/Kafka)│
                    └─────────────┘
```

---

## 二、支持的通信协议

### 1. MQTT（推荐）

**优点**：轻量级、实时性好、支持双向通信

**配置示例**（存储在 `dtu_configs` 表）：

```typescript
{
  device_id: 'device-uuid',
  dtu_sn: 'DTU20240001',
  protocol: 'mqtt',
  endpoint: 'mqtt.your-domain.com',
  port: 1883,
  topic_subscribe: 'device/{device_id}/command',  // 接收平台指令
  topic_publish: 'device/{device_id}/data',       // 上报设备数据
  username: 'device_auth_user',
  password: 'device_auth_password',
  interval_seconds: 30,  // 上报间隔
}
```

### 2. HTTP/HTTPS

**优点**：简单易用、防火墙友好

**配置示例**：

```typescript
{
  protocol: 'http',
  endpoint: 'https://api.your-domain.com/api/dtu/data',
  interval_seconds: 60,
}
```

### 3. TCP/WebSocket

**优点**：长连接、实时性高

---

## 三、数据上报格式

### 设备数据上报

**Topic**: `device/{device_id}/data`

**Payload**:
```json
{
  "device_id": "xxx-xxx-xxx",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "temperature": 45.2,
    "humidity": 62.5,
    "power": 456.8,
    "efficiency": 92.3,
    "speed": 3200,
    "pressure": 5.2,
    "output": 950.5,
    "runtime": 28800
  },
  "status": "online",
  "raw_data": {
    // 原始协议数据（可选）
  }
}
```

### 设备状态变更

**Topic**: `device/{device_id}/status`

**Payload**:
```json
{
  "device_id": "xxx-xxx-xxx",
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "online",  // online, offline, fault, maintenance
  "message": "设备启动"
}
```

---

## 四、远程控制指令

### 平台下发指令

**Topic**: `device/{device_id}/command`

**Payload**:
```json
{
  "command_id": "cmd-xxx",
  "command": "start",  // start, stop, restart, set_param
  "timestamp": "2024-01-15T10:30:00Z",
  "params": {
    "speed": 3000,
    "temperature": 50
  }
}
```

### 设备响应

**Topic**: `device/{device_id}/response`

**Payload**:
```json
{
  "command_id": "cmd-xxx",
  "success": true,
  "message": "指令执行成功",
  "timestamp": "2024-01-15T10:30:05Z"
}
```

---

## 五、对接步骤

### Step 1: 创建设备记录

在 `devices` 表中创建设备：

```sql
INSERT INTO devices (id, name, serial_number, vendor_id, owner_id, device_type, status)
VALUES ('设备UUID', '设备名称', 'SN编号', '厂家ID', '用户ID', '设备类型', 'offline');
```

### Step 2: 配置 DTU

在 `dtu_configs` 表中创建 DTU 配置：

```sql
INSERT INTO dtu_configs (device_id, dtu_sn, protocol, endpoint, port, topic_subscribe, topic_publish, username, password, interval_seconds)
VALUES ('设备UUID', 'DTU序列号', 'mqtt', 'mqtt服务器地址', 1883, '订阅主题', '发布主题', '用户名', '密码', 30);
```

### Step 3: 创建后端接收服务

创建 API 接收 DTU 上报的数据：

```typescript
// src/app/api/dtu/data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { device_id, timestamp, data, status } = body;
    
    const supabase = getSupabaseClient();
    
    // 1. 更新设备状态
    await supabase
      .from('devices')
      .update({ 
        status,
        last_heartbeat_at: timestamp,
      })
      .eq('id', device_id);
    
    // 2. 插入设备数据
    await supabase
      .from('device_data')
      .insert({
        device_id,
        ...data,
        recorded_at: timestamp,
      });
    
    // 3. 检查告警阈值（如温度过高）
    if (data.temperature > 80) {
      await supabase
        .from('alerts')
        .insert({
          device_id,
          vendor_id: '从设备关联获取',
          type: 'temperature',
          level: 'critical',
          title: '温度过高告警',
          message: `温度达到 ${data.temperature}°C`,
          status: 'active',
          value: data.temperature,
          threshold: 80,
        });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '处理失败' }, { status: 500 });
  }
}
```

### Step 4: 使用消息队列（生产环境推荐）

对于高并发场景，建议使用消息队列：

```typescript
// 使用 Supabase Realtime 或外部 MQ
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 订阅设备数据变更
supabase
  .channel('device-data')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'device_data' },
    (payload) => {
      console.log('新设备数据:', payload);
      // 推送给前端实时展示
    }
  )
  .subscribe();
```

---

## 六、告警规则配置

### 自动告警检查

建议在后端创建定时任务或触发器检查告警：

```sql
-- 创建告警检查函数
CREATE OR REPLACE FUNCTION check_device_alerts()
RETURNS void AS $$
BEGIN
  -- 检查温度告警
  INSERT INTO alerts (device_id, vendor_id, type, level, title, message, status, value, threshold)
  SELECT 
    dd.device_id,
    d.vendor_id,
    'temperature',
    CASE WHEN dd.temperature > 85 THEN 'critical' ELSE 'warning' END,
    '温度异常',
    '设备温度超过阈值',
    'active',
    dd.temperature,
    80
  FROM device_data dd
  JOIN devices d ON d.id = dd.device_id
  WHERE dd.temperature > 80
    AND dd.recorded_at > NOW() - INTERVAL '1 minute'
    AND NOT EXISTS (
      SELECT 1 FROM alerts a 
      WHERE a.device_id = dd.device_id 
        AND a.type = 'temperature' 
        AND a.status = 'active'
    );
END;
$$ LANGUAGE plpgsql;
```

---

## 七、安全建议

1. **使用 TLS/SSL 加密**：MQTT 使用 8883 端口（TLS），HTTP 使用 HTTPS
2. **设备认证**：每个 DTU 使用独立的用户名密码或证书
3. **数据校验**：后端验证上报数据的合法性
4. **限流保护**：限制单个设备的上报频率
5. **IP 白名单**：限制 DTU 的访问 IP

---

## 八、常见 DTU 厂商对接

| 厂商 | 协议 | 说明 |
|------|------|------|
| 有人物联网 | MQTT/TCP | 需配置有人云账号 |
| 四信科技 | MQTT/HTTP | 支持 Modbus 转换 |
| 宏电科技 | MQTT | 内置多种协议解析 |
| 自研 DTU | 自定义 | 需按本文档开发 |

---

## 九、测试工具

### MQTT 测试

```bash
# 安装 mosquitto-clients
apt-get install mosquitto-clients

# 模拟设备上报
mosquitto_pub -h mqtt.your-domain.com -p 1883 \
  -u "username" -P "password" \
  -t "device/xxx-xxx-xxx/data" \
  -m '{"device_id":"xxx-xxx-xxx","timestamp":"2024-01-15T10:30:00Z","data":{"temperature":45.2}}'
```

### HTTP 测试

```bash
curl -X POST https://api.your-domain.com/api/dtu/data \
  -H "Content-Type: application/json" \
  -d '{"device_id":"xxx-xxx-xxx","timestamp":"2024-01-15T10:30:00Z","data":{"temperature":45.2}}'
```

---

## 十、相关表结构

- `devices` - 设备信息
- `dtu_configs` - DTU 配置
- `device_data` - 设备历史数据
- `alerts` - 告警记录
- `notifications` - 用户通知

详细字段说明见 `src/storage/database/shared/schema.ts`
