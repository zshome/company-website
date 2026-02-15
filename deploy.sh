#!/bin/bash

set -e

echo "========================================"
echo "  宜然焕新官网 - 部署脚本"
echo "========================================"

echo ""
echo "[1/6] 检查环境..."
if ! command -v docker &> /dev/null; then
    echo "错误: 未安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "错误: 未安装 Docker Compose"
    exit 1
fi

echo "Docker 版本: $(docker --version)"
echo "Docker Compose 版本: $(docker-compose --version)"

echo ""
echo "[2/6] 检查环境变量..."
if [ ! -f .env.prod ]; then
    echo "警告: .env.prod 文件不存在，使用默认配置"
    cp .env.prod.example .env.prod
fi

echo ""
echo "[3/6] 创建必要目录..."
mkdir -p ssl
mkdir -p nginx/conf.d
mkdir -p backend/data

echo ""
echo "[4/6] 构建镜像..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "[5/6] 启动服务..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "[6/6] 检查服务状态..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "========================================"
echo "  部署完成!"
echo "========================================"
echo ""
echo "访问地址:"
echo "  - 官网: https://yiran-huanxin.com"
echo "  - API: https://api.yiran-huanxin.com/docs"
echo ""
echo "常用命令:"
echo "  - 查看日志: docker-compose -f docker-compose.prod.yml logs -f"
echo "  - 重启服务: docker-compose -f docker-compose.prod.yml restart"
echo "  - 停止服务: docker-compose -f docker-compose.prod.yml down"
echo ""
