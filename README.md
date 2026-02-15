# company-website
 Company Website
# 项目部署指南

## 一、服务器环境准备

### 1. 服务器要求
- 操作系统：Ubuntu 20.04/22.04 或 CentOS 7/8
- 内存：至少 2GB
- 硬盘：至少 20GB
- 网络：开放 80 和 443 端口

### 2. 安装基础环境

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 Nginx
sudo apt install -y nginx

# 安装 Git
sudo apt install -y git

# 安装 SQLite（如使用 SQLite）
sudo apt install -y sqlite3
```

## 二、后端部署

### 1. 创建项目目录

```bash
sudo mkdir -p /var/www/yiran-huanxin
sudo chown -R $USER:$USER /var/www/yiran-huanxin
cd /var/www/yiran-huanxin
```

### 2. 克隆代码

```bash
git clone <your-repo-url> .
```

### 3. 配置 Python 环境

```bash
cd /var/www/yiran-huanxin/backend

# 创建虚拟环境
python3.11 -m venv venv

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 4. 配置环境变量

```bash
# 创建环境变量文件
cat > .env << EOF
DATABASE_URL=sqlite:///./data/yiran_huanxin.db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
EOF
```

### 5. 初始化数据库

```bash
# 创建数据目录
mkdir -p data

# 初始化数据库（首次运行时自动创建）
python -c "from app.core.database import init_db; init_db()"
```

### 6. 创建 Systemd 服务

```bash
sudo cat > /etc/systemd/system/yiran-backend.service << EOF
[Unit]
Description=Yiran Huanxin Backend API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/yiran-huanxin/backend
Environment="PATH=/var/www/yiran-huanxin/backend/venv/bin"
ExecStart=/var/www/yiran-huanxin/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 重载 systemd
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start yiran-backend

# 设置开机自启
sudo systemctl enable yiran-backend

# 查看状态
sudo systemctl status yiran-backend
```

## 三、前端部署

### 1. 配置环境变量

```bash
cd /var/www/yiran-huanxin/frontend

# 创建环境变量文件
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://your-domain.com/api/v1
EOF
```

### 2. 安装依赖并构建

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

### 3. 使用 PM2 运行（推荐）

```bash
# 安装 PM2
sudo npm install -g pm2

# 启动前端服务
pm2 start npm --name "yiran-frontend" -- start

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

## 四、Nginx 配置

### 1. 创建 Nginx 配置

```bash
sudo cat > /etc/nginx/sites-available/yiran-huanxin << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 证书配置（使用 Let's Encrypt）
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 前端
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 上传文件
    location /uploads/ {
        alias /var/www/yiran-huanxin/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 静态资源缓存
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
}
EOF

# 启用站点
sudo ln -s /etc/nginx/sites-available/yiran-huanxin /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

## 五、SSL 证书配置

### 使用 Let's Encrypt 免费证书

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期测试
sudo certbot renew --dry-run
```

## 六、防火墙配置

```bash
# 开放端口
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22

# 启用防火墙
sudo ufw enable
```

## 七、常用运维命令

### 后端服务管理

```bash
# 查看状态
sudo systemctl status yiran-backend

# 重启服务
sudo systemctl restart yiran-backend

# 查看日志
sudo journalctl -u yiran-backend -f
```

### 前端服务管理

```bash
# 查看状态
pm2 status

# 重启服务
pm2 restart yiran-frontend

# 查看日志
pm2 logs yiran-frontend
```

### Nginx 管理

```bash
# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx

# 查看日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 数据库备份

```bash
# 创建备份脚本
cat > /var/www/yiran-huanxin/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/www/yiran-huanxin/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
cp /var/www/yiran-huanxin/backend/data/yiran_huanxin.db $BACKUP_DIR/yiran_huanxin_$DATE.db
# 保留最近7天的备份
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
EOF

chmod +x /var/www/yiran-huanxin/backup.sh

# 添加定时任务（每天凌晨2点备份）
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/yiran-huanxin/backup.sh") | crontab -
```

## 八、更新部署

```bash
cd /var/www/yiran-huanxin

# 拉取最新代码
git pull

# 更新后端
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart yiran-backend

# 更新前端
cd ../frontend
npm install
npm run build
pm2 restart yiran-frontend
```

## 九、监控与日志

### 安装监控工具（可选）

```bash
# 安装 htop
sudo apt install -y htop

# 安装 netdata（可选）
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

### 日志轮转配置

```bash
sudo cat > /etc/logrotate.d/yiran-huanxin << 'EOF'
/var/www/yiran-huanxin/backend/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
}
EOF
```

## 十、安全建议

1. **修改默认管理员密码**：首次登录后立即修改
2. **定期更新系统**：`sudo apt update && sudo apt upgrade`
3. **配置 fail2ban**：防止暴力破解
4. **定期备份数据库**
5. **使用强密码和密钥登录 SSH**
6. **关闭不必要的端口**

## 十一、故障排查

### 后端无法启动

```bash
# 检查端口占用
sudo lsof -i :8000

# 检查日志
sudo journalctl -u yiran-backend -n 100
```

### 前端无法访问

```bash
# 检查 PM2 状态
pm2 status

# 检查端口
sudo lsof -i :3000
```

### Nginx 错误

```bash
# 检查配置语法
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```
