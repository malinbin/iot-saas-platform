# 自有服务器部署指南

本文档说明如何将工业物联网 SaaS 平台部署到您自己的服务器。

---

## 一、服务器要求

### 最低配置
| 项目 | 要求 |
|------|------|
| CPU | 2核 |
| 内存 | 4GB |
| 硬盘 | 20GB SSD |
| 系统 | Ubuntu 20.04+ / CentOS 7+ / Debian 10+ |

### 推荐配置
| 项目 | 要求 |
|------|------|
| CPU | 4核 |
| 内存 | 8GB |
| 硬盘 | 50GB SSD |
| 系统 | Ubuntu 22.04 LTS |

---

## 二、部署方式选择

### 方式一：Docker 部署（推荐）⭐

**优点**：环境隔离、部署简单、易于迁移

```bash
# 1. 安装 Docker
curl -fsSL https://get.docker.com | sh

# 2. 克隆项目（或上传代码）
git clone <your-repo-url>
cd iot-platform

# 3. 创建环境变量文件
cat > .env << EOF
COZE_SUPABASE_URL=your_supabase_url
COZE_SUPABASE_ANON_KEY=your_supabase_key
EOF

# 4. 一键启动
docker-compose up -d

# 5. 查看日志
docker-compose logs -f
```

### 方式二：PM2 部署（传统方式）

**优点**：无需Docker、资源占用低

```bash
# 1. 安装 Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 2. 安装 pnpm 和 PM2
npm install -g pnpm pm2

# 3. 安装依赖并构建
cd iot-platform
pnpm install
pnpm run build

# 4. 设置环境变量
export COZE_SUPABASE_URL="your_supabase_url"
export COZE_SUPABASE_ANON_KEY="your_supabase_key"

# 5. 启动服务
pm2 start pnpm --name "iot-platform" -- run start

# 6. 设置开机自启
pm2 startup
pm2 save
```

### 方式三：Vercel 部署（最简单）

**优点**：零运维、自动CI/CD、全球CDN

1. 将代码推送到 GitHub
2. 登录 [vercel.com](https://vercel.com)
3. 导入项目，设置环境变量
4. 一键部署

---

## 三、Supabase 配置

### 选项A：使用 Supabase 云服务（推荐）

1. 访问 [supabase.com](https://supabase.com) 注册账号
2. 创建新项目，获取 URL 和 anon key
3. 在数据库中执行 SQL 创建表结构

### 选项B：自建 Supabase（私有化）

```bash
# 使用 Supabase 官方 Docker 部署
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
cp .env.example .env
docker-compose up -d
```

---

## 四、域名与SSL配置

### 使用 Nginx 反向代理

```bash
# 安装 Nginx
sudo apt install -y nginx

# 配置站点
sudo nano /etc/nginx/sites-available/iot-platform

# 内容示例
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}

# 启用站点
sudo ln -s /etc/nginx/sites-available/iot-platform /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 安装 SSL 证书（Let's Encrypt）
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 五、数据库初始化

部署后需要初始化数据库表结构，在 Supabase SQL Editor 中执行：

1. 用户与权限表
2. 设备模板表
3. 设备管理表
4. DTU相关表
5. 告警与日志表

（具体SQL请参考项目中的 schema 文件）

---

## 六、常用运维命令

### Docker 方式
```bash
# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f web

# 重启服务
docker-compose restart

# 更新部署
git pull
docker-compose build --no-cache
docker-compose up -d

# 备份数据
docker exec -t iot-postgres pg_dump -U postgres iot > backup.sql
```

### PM2 方式
```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs iot-platform

# 重启服务
pm2 restart iot-platform

# 更新部署
git pull && pnpm install && pnpm run build
pm2 restart iot-platform
```

---

## 七、监控与告警

推荐使用以下工具监控服务状态：

- **Uptime Kuma**：服务可用性监控
- **Grafana + Prometheus**：性能指标监控
- **Sentry**：错误追踪

---

## 八、安全建议

1. ✅ 使用 HTTPS 加密传输
2. ✅ 配置防火墙，仅开放必要端口
3. ✅ 定期更新系统和依赖
4. ✅ 数据库定期备份
5. ✅ 使用强密码和密钥管理
6. ✅ 限制 Supabase RLS 策略

---

如有问题，请参考项目文档或联系技术支持。
