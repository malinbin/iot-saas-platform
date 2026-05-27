-- =====================================================
-- 工业物联网 SaaS 平台 - 数据库初始化脚本
-- =====================================================
-- 适用于 PostgreSQL / Supabase
-- 使用方法: 在数据库中执行此脚本
-- =====================================================

-- =====================================================
-- 1. 基础用户系统表
-- =====================================================

-- 厂家表
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  password VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  expire_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  vendor_id UUID REFERENCES vendors(id),
  role VARCHAR(20) DEFAULT 'user',
  status VARCHAR(20) DEFAULT 'active',
  expire_at TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- 2. 设备模板系统表
-- =====================================================

-- 设备模板表
CREATE TABLE IF NOT EXISTS device_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(50),
  description TEXT,
  icon VARCHAR(100),
  vendor_id UUID REFERENCES vendors(id),
  is_public BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 模板字段表
CREATE TABLE IF NOT EXISTS template_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES device_templates(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  field_key VARCHAR(50) NOT NULL,
  field_type VARCHAR(20) DEFAULT 'text',
  unit VARCHAR(20),
  default_value TEXT,
  options JSONB,
  min_value NUMERIC,
  max_value NUMERIC,
  is_required BOOLEAN DEFAULT false,
  show_in_list BOOLEAN DEFAULT true,
  show_in_detail BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  group_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 模板授权表
CREATE TABLE IF NOT EXISTS template_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES device_templates(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  can_view BOOLEAN DEFAULT true,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. 设备管理表
-- =====================================================

-- 设备表
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100),
  template_id UUID REFERENCES device_templates(id),
  vendor_id UUID REFERENCES vendors(id),
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'offline',
  online BOOLEAN DEFAULT false,
  last_online_at TIMESTAMP,
  location VARCHAR(200),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  config JSONB DEFAULT '{}',
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 设备数据历史表
CREATE TABLE IF NOT EXISTS device_data_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  recorded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 4. DTU 设备表
-- =====================================================

-- DTU设备表
CREATE TABLE IF NOT EXISTS dtu_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(50) UNIQUE NOT NULL,
  imei VARCHAR(20) UNIQUE,
  iccid VARCHAR(20),
  vendor_id UUID REFERENCES vendors(id),
  name VARCHAR(100),
  connection_mode VARCHAR(20) DEFAULT 'mqtt',
  server_address VARCHAR(255),
  server_port INTEGER,
  mqtt_topic_subscribe TEXT,
  mqtt_topic_publish TEXT,
  mqtt_username VARCHAR(100),
  mqtt_password VARCHAR(100),
  serial_baudrate INTEGER DEFAULT 9600,
  heartbeat_interval INTEGER DEFAULT 60,
  last_heartbeat_at TIMESTAMP,
  last_data_at TIMESTAMP,
  online BOOLEAN DEFAULT false,
  signal_strength INTEGER,
  firmware_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  config JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- DTU数据记录表
CREATE TABLE IF NOT EXISTS dtu_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dtu_id UUID REFERENCES dtu_devices(id),
  raw_data TEXT,
  parsed_data JSONB,
  topic VARCHAR(255),
  direction VARCHAR(10),
  received_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- DTU告警表
CREATE TABLE IF NOT EXISTS dtu_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dtu_id UUID REFERENCES dtu_devices(id),
  alert_type VARCHAR(50),
  alert_level VARCHAR(20) DEFAULT 'warning',
  message TEXT,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. 告警系统表
-- =====================================================

-- 告警表
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES devices(id),
  vendor_id UUID REFERENCES vendors(id),
  alert_type VARCHAR(50) NOT NULL,
  alert_level VARCHAR(20) DEFAULT 'warning',
  title VARCHAR(200),
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  resolved_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. 系统配置表
-- =====================================================

-- 系统配置表
CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  category VARCHAR(50),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 操作日志表
CREATE TABLE IF NOT EXISTS operation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_type VARCHAR(20),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  description TEXT,
  ip_address VARCHAR(50),
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 7. 创建索引
-- =====================================================

-- 厂家相关索引
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_users_vendor ON users(vendor_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 设备模板索引
CREATE INDEX IF NOT EXISTS idx_device_templates_vendor ON device_templates(vendor_id);
CREATE INDEX IF NOT EXISTS idx_device_templates_code ON device_templates(code);
CREATE INDEX IF NOT EXISTS idx_template_fields_template ON template_fields(template_id);
CREATE INDEX IF NOT EXISTS idx_template_permissions_template ON template_permissions(template_id);
CREATE INDEX IF NOT EXISTS idx_template_permissions_vendor ON template_permissions(vendor_id);

-- 设备索引
CREATE INDEX IF NOT EXISTS idx_devices_vendor ON devices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_devices_user ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_template ON devices(template_id);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_device_data_history_device ON device_data_history(device_id);

-- DTU索引
CREATE INDEX IF NOT EXISTS idx_dtu_devices_vendor ON dtu_devices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_dtu_devices_online ON dtu_devices(online);
CREATE INDEX IF NOT EXISTS idx_dtu_data_dtu ON dtu_data(dtu_id);
CREATE INDEX IF NOT EXISTS idx_dtu_data_time ON dtu_data(received_at);
CREATE INDEX IF NOT EXISTS idx_dtu_alerts_dtu ON dtu_alerts(dtu_id);

-- 告警索引
CREATE INDEX IF NOT EXISTS idx_alerts_device ON alerts(device_id);
CREATE INDEX IF NOT EXISTS idx_alerts_vendor ON alerts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_alerts_level ON alerts(alert_level);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at);

-- 操作日志索引
CREATE INDEX IF NOT EXISTS idx_operation_logs_user ON operation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_operation_logs_action ON operation_logs(action);
CREATE INDEX IF NOT EXISTS idx_operation_logs_time ON operation_logs(created_at);

-- =====================================================
-- 8. 插入默认系统配置
-- =====================================================

INSERT INTO system_config (key, value, description, category) VALUES
  ('system_name', '工业物联网SaaS平台', '系统名称', 'basic'),
  ('system_logo', '', '系统Logo', 'basic'),
  ('default_expire_days', '365', '默认账号有效期(天)', 'account'),
  ('max_devices_per_vendor', '100', '每个厂家最大设备数', 'limit'),
  ('max_users_per_vendor', '50', '每个厂家最大用户数', 'limit'),
  ('data_retention_days', '90', '数据保留天数', 'data'),
  ('alert_retention_days', '30', '告警保留天数', 'data')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 完成！
-- =====================================================
