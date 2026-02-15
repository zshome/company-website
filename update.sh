#!/bin/bash

echo "========================================"
echo "  宜然焕新官网 - 更新部署"
echo "========================================"

echo ""
echo "[1/4] 拉取最新代码..."
git pull origin main

echo ""
echo "[2/4] 重新构建镜像..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "[3/4] 重启服务..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "[4/4] 清理旧镜像..."
docker image prune -f

echo ""
echo "更新完成!"
docker-compose -f docker-compose.prod.yml ps
