# 宜然焕新官网 - 后端启动说明

## 环境要求
- Python 3.11+
- pip

## 启动步骤

### 方法一：使用启动脚本（推荐）

**Windows PowerShell:**
```powershell
cd e:\AI Project\Company-Official-Website\backend
.\start.ps1
```

**Windows CMD:**
```cmd
cd e:\AI Project\Company-Official-Website\backend
start.bat
```

### 方法二：手动启动

1. 打开终端，进入后端目录：
```powershell
cd e:\AI Project\Company-Official-Website\backend
```

2. 安装依赖（首次运行）：
```powershell
pip install -r requirements.txt
```

3. 启动服务：
```powershell
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 访问地址

启动成功后可访问：

- **API 文档 (Swagger)**: http://localhost:8000/docs
- **API 文档 (ReDoc)**: http://localhost:8000/redoc
- **健康检查**: http://localhost:8000/health
- **API 端点**: http://localhost:8000/api/v1

## 常见问题

### 1. 端口被占用
```powershell
# 查看端口占用
netstat -ano | findstr :8000
# 结束占用进程（替换 PID）
taskkill /PID <PID> /F
```

### 2. 模块导入错误
```powershell
# 确保在 backend 目录下运行
cd e:\AI Project\Company-Official-Website\backend
pip install -r requirements.txt
```

### 3. 数据库错误
```powershell
# 确保 data 目录存在
mkdir data
```

## API 端点列表

| 模块 | 端点 | 方法 | 说明 |
|------|------|------|------|
| 认证 | /api/v1/auth/register | POST | 用户注册 |
| 认证 | /api/v1/auth/login | POST | 用户登录 |
| 联系 | /api/v1/contacts/ | POST | 提交咨询 |
| 联系 | /api/v1/contacts/ | GET | 获取咨询列表 |
| 新闻 | /api/v1/news/ | GET | 获取新闻列表 |
| 新闻 | /api/v1/news/{id} | GET | 获取新闻详情 |
| 案例 | /api/v1/cases/ | GET | 获取案例列表 |
| 案例 | /api/v1/cases/{id} | GET | 获取案例详情 |
