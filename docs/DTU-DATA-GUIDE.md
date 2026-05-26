# DTU 设备数据对接指南

## 数据流程

```
DTU设备 → 数据采集 → POST /api/dtu/report → 数据库存储 → 用户端查询
```

## 1. 数据上报 API

**接口地址**: `POST /api/dtu/report`

**请求格式**:
```json
{
  "device_id": "设备ID",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "temperature": 45.2,
    "pressure": 5.8,
    "speed": 3200,
    "efficiency": 92.3
  },
  "status": "online"
}
```

**字段说明**:
- `device_id`: 设备ID（在厂家后台创建设备时生成）
- `timestamp`: 数据采集时间（ISO 8601格式）
- `data`: 设备数据对象，**key必须对应模板字段的 field_key**
- `status`: 设备状态（online/offline/fault/maintenance）

**响应格式**:
```json
{
  "success": true,
  "message": "数据上报成功",
  "recorded_at": "2024-01-15T10:30:00.000Z"
}
```

---

## 2. 数据字段映射

### 关键：字段键名必须匹配

在可视化编辑器中定义的**字段标识（field_key）**必须与 DTU 上报的数据 key 完全一致。

**示例**:

模板定义：
```
| 字段名称 | 字段标识(field_key) |
|---------|---------------------|
| 温度    | temperature         |
| 压力    | pressure            |
| 转速    | speed               |
| 效率    | efficiency          |
```

DTU 上报数据：
```json
{
  "data": {
    "temperature": 45.2,  // 对应 "温度" 字段
    "pressure": 5.8,      // 对应 "压力" 字段
    "speed": 3200,        // 对应 "转速" 字段
    "efficiency": 92.3    // 对应 "效率" 字段
  }
}
```

如果 key 不匹配，用户端将无法显示对应的数据！

---

## 3. DTU 设备对接示例

### HTTP 方式（推荐入门）

#### Python 示例
```python
import requests
import json
from datetime import datetime
import time

# 配置
API_URL = "https://your-domain.com/api/dtu/report"
DEVICE_ID = "your-device-id"

def collect_data():
    """采集设备数据"""
    # 这里替换为实际的数据采集代码
    return {
        "temperature": 45.2,
        "pressure": 5.8,
        "speed": 3200,
        "efficiency": 92.3,
        "power": 456.8,
    }

def report_data():
    """上报数据"""
    data = collect_data()
    
    payload = {
        "device_id": DEVICE_ID,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "data": data,
        "status": "online"
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        result = response.json()
        
        if result.get("success"):
            print(f"数据上报成功: {result}")
        else:
            print(f"数据上报失败: {result}")
            
    except Exception as e:
        print(f"上报错误: {e}")

# 定时上报
while True:
    report_data()
    time.sleep(30)  # 每30秒上报一次
```

#### Node.js 示例
```javascript
const axios = require('axios');

const API_URL = 'https://your-domain.com/api/dtu/report';
const DEVICE_ID = 'your-device-id';

// 采集设备数据
function collectData() {
  // 这里替换为实际的数据采集代码
  return {
    temperature: 45.2,
    pressure: 5.8,
    speed: 3200,
    efficiency: 92.3,
    power: 456.8,
  };
}

// 上报数据
async function reportData() {
  const data = collectData();
  
  const payload = {
    device_id: DEVICE_ID,
    timestamp: new Date().toISOString(),
    data: data,
    status: 'online',
  };
  
  try {
    const response = await axios.post(API_URL, payload);
    const result = response.data;
    
    if (result.success) {
      console.log('数据上报成功:', result);
    } else {
      console.log('数据上报失败:', result);
    }
  } catch (error) {
    console.error('上报错误:', error.message);
  }
}

// 定时上报
setInterval(reportData, 30000); // 每30秒上报一次
reportData(); // 立即执行一次
```

### MQTT 方式（推荐生产环境）

MQTT 适合需要实时双向通信的场景。

```python
import paho.mqtt.client as mqtt
import json
from datetime import datetime
import time

# MQTT 配置
MQTT_BROKER = "your-mqtt-broker.com"
MQTT_PORT = 1883
MQTT_TOPIC = "device/data/report"
DEVICE_ID = "your-device-id"

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT broker with result code {rc}")
    # 订阅控制指令
    client.subscribe(f"device/control/{DEVICE_ID}")

def on_message(client, userdata, msg):
    """接收控制指令"""
    try:
        payload = json.loads(msg.payload)
        print(f"收到控制指令: {payload}")
        # 处理控制指令（如远程启停）
        handle_control(payload)
    except Exception as e:
        print(f"处理指令错误: {e}")

def handle_control(payload):
    """处理控制指令"""
    command = payload.get("command")
    if command == "start":
        print("执行启动指令")
    elif command == "stop":
        print("执行停止指令")

def collect_data():
    """采集设备数据"""
    return {
        "temperature": 45.2,
        "pressure": 5.8,
        "speed": 3200,
        "efficiency": 92.3,
    }

# 创建 MQTT 客户端
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# 连接服务器
client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.loop_start()

# 定时上报数据
try:
    while True:
        data = collect_data()
        payload = {
            "device_id": DEVICE_ID,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "data": data,
            "status": "online"
        }
        
        client.publish(MQTT_TOPIC, json.dumps(payload))
        print(f"数据已发送: {payload}")
        
        time.sleep(30)
except KeyboardInterrupt:
    client.loop_stop()
    client.disconnect()
```

---

## 4. 用户端数据读取

### 获取设备详情和最新数据
```
GET /api/user/devices/{device_id}/data
```

响应：
```json
{
  "success": true,
  "data": {
    "device": { "name": "注塑机001", ... },
    "template": { "name": "注塑机", ... },
    "fields": [
      {
        "field_key": "temperature",
        "field_name": "温度",
        "unit": "℃",
        "value": 45.2,
        "alert_status": "normal",
        "history": [...]
      }
    ]
  }
}
```

### 获取字段历史数据
```
GET /api/user/devices/{device_id}/history?field=temperature&hours=24
```

---

## 5. 告警自动触发

当 DTU 上报的数据超过模板字段定义的告警阈值时，系统会自动创建告警：

- `alert_min`: 下限告警
- `alert_max`: 上限告警

**示例**:
```
字段定义: temperature, alert_min=20, alert_max=80
上报数据: temperature=85

→ 自动创建告警: "温度过高: 85℃ > 80℃"
```

---

## 6. 最佳实践

1. **字段键名一致性**: 确保 DTU 上报的 key 与模板 field_key 完全一致
2. **上报频率**: 建议 10-60 秒上报一次
3. **数据类型**: 使用 number 类型便于图表展示
4. **异常处理**: 实现网络断开重连机制
5. **时间同步**: 使用 NTP 同步设备时间，确保时间戳准确
