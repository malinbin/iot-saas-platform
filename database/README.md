# 数据库配置指南

## 概述

本项目使用 **PostgreSQL** 数据库，推荐使用 **Supabase**（托管 PostgreSQL 服务）。

数据库表结构存储在 `database/init.sql` 文件中，不在 Git 仓库的代码中。

---

## 方案一：使用 Supabase（推荐）

### 1. 创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 **Start your project** 注册/登录
3. 点击 **New Project** 创建新项目
   - 项目名称：`iot-saas`
   - 区域：选择离您最近的（如 Singapore）
   - 数据库密码：设置一个强密码
4. 等待项目创建完成（约 2 分钟）

### 2. 执行数据库初始化脚本

1. 进入项目后，点击左侧 **SQL Editor**
2. 点击 **New query**
3. 复制 `database/init.sql` 的全部内容
4. 粘贴到编辑器中
5. 点击 **Run** 执行

### 3. 获取连接信息

1. 点击左侧 **Project Settings** → **API**
2. 复制以下信息：
   - **Project URL** → `COZE_SUPABASE_URL`
   - **anon public key** → `COZE_SUPABASE_ANON_KEY`

### 4. 配置环境变量

在您的部署平台设置环境变量：

```env
COZE_SUPABASE_URL=https://xxxxx.supabase.co
COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 方案二：自建 PostgreSQL

### 1. 安装 PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**CentOS/RHEL:**
```bash
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
```

**Docker:**
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=iot_saas \
  -p 5432:5432 \
  postgres:15
```

### 2. 创建数据库和用户

```bash
sudo -u postgres psql

# 创建数据库
CREATE DATABASE iot_saas;

# 创建用户
CREATE USER iot_user WITH PASSWORD 'your_password';

# 授权
GRANT ALL PRIVILEGES ON DATABASE iot_saas TO iot_user;

# 退出
\q
```

### 3. 执行初始化脚本

```bash
psql -h localhost -U iot_user -d iot_saas -f database/init.sql
```

### 4. 配置环境变量

```env
COZE_SUPABASE_URL=http://localhost:5432
COZE_SUPABASE_ANON_KEY=your_password
```

---

## 方案三：使用其他托管数据库

### 支持的平台
- **阿里云 RDS PostgreSQL**
- **腾讯云 TDSQL PostgreSQL**
- **AWS RDS PostgreSQL**
- **Google Cloud SQL PostgreSQL**
- **Neon** (https://neon.tech) - Serverless PostgreSQL
- **PlanetScale** - 支持 PostgreSQL

### 配置步骤
1. 在平台创建 PostgreSQL 数据库
2. 使用平台提供的 SQL 编辑器执行 `database/init.sql`
3. 配置环境变量连接到您的数据库

---

## 数据库表结构

执行 `init.sql` 后会创建以下表：

| 表名 | 说明 |
|------|------|
| vendors | 厂家表 |
| users | 用户表 |
| device_templates | 设备模板表 |
| template_fields | 模板字段表 |
| template_permissions | 模板授权表 |
| devices | 设备表 |
| device_data_history | 设备数据历史表 |
| dtu_devices | DTU设备表 |
| dtu_data | DTU数据记录表 |
| dtu_alerts | DTU告警表 |
| alerts | 告警表 |
| system_config | 系统配置表 |
| operation_logs | 操作日志表 |

---

## 数据库维护

### 备份数据库

**Supabase:**
- 项目设置 → Database → Backups
- 支持自动每日备份

**自建数据库:**
```bash
pg_dump -h localhost -U iot_user iot_saas > backup.sql
```

### 恢复数据库

```bash
psql -h localhost -U iot_user iot_saas < backup.sql
```

---

## 常见问题

### Q: 克隆代码后数据库是空的吗？
A: 是的。代码只包含表结构脚本 (`database/init.sql`)，不包含数据。您需要：
1. 创建数据库
2. 执行初始化脚本
3. 配置环境变量

### Q: 能否导出现有数据？
A: 可以，但不推荐将敏感数据放入 Git。建议使用数据库的备份功能。

### Q: 多环境如何管理？
A: 推荐为每个环境创建独立的 Supabase 项目：
- `iot-saas-dev` - 开发环境
- `iot-saas-prod` - 生产环境
