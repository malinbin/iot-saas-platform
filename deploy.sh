#!/bin/bash

# 工业物联网 SaaS 平台 - 快速部署脚本
# 使用方法: bash deploy.sh

set -e

echo "=========================================="
echo "  工业物联网 SaaS 平台 - 部署脚本"
echo "=========================================="

# 检查环境
echo ""
echo "[1/5] 检查环境..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    echo "   参考: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装"
    exit 1
fi

echo "✅ Docker 环境检查通过"

# 检查环境变量
echo ""
echo "[2/5] 检查环境变量..."

if [ ! -f .env ]; then
    echo "❌ .env 文件不存在，正在创建..."
    cat > .env << EOF
# Supabase 配置（请填写）
COZE_SUPABASE_URL=your_supabase_url
COZE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 其他配置
NODE_ENV=production
EOF
    echo "✅ 已创建 .env 文件，请编辑填写正确的配置后重新运行"
    exit 1
fi

# 检查环境变量是否配置
if grep -q "your_supabase_url" .env; then
    echo "❌ 请先在 .env 文件中配置 Supabase 信息"
    exit 1
fi

echo "✅ 环境变量检查通过"

# 构建镜像
echo ""
echo "[3/5] 构建 Docker 镜像..."
docker-compose build --no-cache

echo "✅ 镜像构建完成"

# 启动服务
echo ""
echo "[4/5] 启动服务..."
docker-compose up -d

echo "✅ 服务启动完成"

# 检查状态
echo ""
echo "[5/5] 检查服务状态..."
sleep 5

if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "=========================================="
    echo "  ✅ 部署成功！"
    echo "=========================================="
    echo ""
    echo "访问地址: http://localhost:5000"
    echo ""
    echo "常用命令:"
    echo "  查看日志: docker-compose logs -f"
    echo "  重启服务: docker-compose restart"
    echo "  停止服务: docker-compose down"
    echo ""
else
    echo "❌ 服务启动失败，请查看日志"
    docker-compose logs
    exit 1
fi
