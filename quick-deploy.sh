#!/bin/bash

set -e

echo "========================================"
echo "  宜然焕新官网 - 快速部署"
echo "========================================"

echo ""
echo "[1/4] 检查 Docker..."
if ! command -v docker &> /dev/null; then
    echo "安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
fi

if ! command -v docker-compose &> /dev/null; then
    echo "安装 Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

echo ""
echo "[2/4] 创建必要目录..."
mkdir -p backend/data

echo ""
echo "[3/4] 构建并启动服务..."
docker-compose -f docker-compose.simple.yml up -d --build

echo ""
echo "[4/4] 等待服务启动..."
sleep 10

echo ""
echo "========================================"
echo "  部署完成!"
echo "========================================"
echo ""
echo "访问地址:"
echo "  - 前端: http://localhost:3000"
echo "  - API文档: http://localhost:8000/docs"
echo "  - 健康检查: http://localhost:8000/health"
echo ""
echo "常用命令:"
echo "  - 查看状态: docker-compose -f docker-compose.simple.yml ps"
echo "  - 查看日志: docker-compose -f docker-compose.simple.yml logs -f"
echo "  - 停止服务: docker-compose -f docker-compose.simple.yml down"
echo ""
