# Windows 服务器部署指南

## 一、服务器环境准备

### 1. 服务器要求
- 操作系统：Windows Server 2016/2019/2022
- 内存：至少 4GB
- 硬盘：至少 20GB
- 网络：开放 80 和 443 端口

### 2. 安装基础软件

#### 安装 Python 3.11
1. 下载 Python 3.11：https://www.python.org/downloads/
2. 运行安装程序，勾选 "Add Python to PATH"
3. 验证安装：
```powershell
python --version
pip --version
```

#### 安装 Node.js 18
1. 下载 Node.js 18 LTS：https://nodejs.org/
2. 运行安装程序
3. 验证安装：
```powershell
node --version
npm --version
```

#### 安装 Git
1. 下载 Git：https://git-scm.com/download/win
2. 运行安装程序
3. 验证安装：
```powershell
git --version
```

#### 安装 NSSM（将应用注册为Windows服务）
1. 下载 NSSM：https://nssm.cc/download
2. 解压到 `C:\nssm`
3. 添加到系统 PATH 环境变量

## 二、项目部署

### 1. 创建项目目录

```powershell
# 创建项目目录
mkdir C:\www\yiran-huanxin
cd C:\www\yiran-huanxin
```

### 2. 克隆代码

```powershell
git clone <your-repo-url> .
```

## 三、后端部署

### 1. 创建虚拟环境

```powershell
cd C:\www\yiran-huanxin\backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
.\venv\Scripts\Activate.ps1

# 安装依赖
pip install -r requirements.txt
```

### 2. 配置环境变量

创建 `C:\www\yiran-huanxin\backend\.env` 文件：

```env
DATABASE_URL=sqlite:///./data/yiran_huanxin.db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### 3. 创建数据目录

```powershell
mkdir C:\www\yiran-huanxin\backend\data
mkdir C:\www\yiran-huanxin\backend\uploads
```

### 4. 使用 NSSM 注册为 Windows 服务

```powershell
# 以管理员身份运行 PowerShell
nssm install YiranBackend

# 在弹出的窗口中配置：
# Application Path: C:\www\yiran-huanxin\backend\venv\Scripts\python.exe
# Startup directory: C:\www\yiran-huanxin\backend
# Arguments: -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# 或使用命令行：
nssm install YiranBackend C:\www\yiran-huanxin\backend\venv\Scripts\python.exe
nssm set YiranBackend AppParameters "-m uvicorn app.main:app --host 127.0.0.1 --port 8000"
nssm set YiranBackend AppDirectory C:\www\yiran-huanxin\backend
nssm set YiranBackend DisplayName "Yiran Huanxin Backend API"
nssm set YiranBackend Description "福建省宜然焕新科技有限公司官网后端API服务"
nssm set YiranBackend Start SERVICE_AUTO_START

# 启动服务
nssm start YiranBackend
```

### 5. 服务管理命令

```powershell
# 启动服务
nssm start YiranBackend
# 或
net start YiranBackend

# 停止服务
nssm stop YiranBackend
# 或
net stop YiranBackend

# 重启服务
nssm restart YiranBackend

# 查看服务状态
sc query YiranBackend

# 删除服务
nssm remove YiranBackend confirm
```

## 四、前端部署

### 1. 配置环境变量

创建 `C:\www\yiran-huanxin\frontend\.env.production` 文件：

```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api/v1
```

### 2. 安装依赖并构建

```powershell
cd C:\www\yiran-huanxin\frontend

# 安装依赖
npm install

# 构建生产版本
npm run build
```

### 3. 使用 NSSM 注册为 Windows 服务

```powershell
# 安装 PM2（推荐）
npm install -g pm2
npm install -g pm2-windows-startup

# 配置 PM2 开机自启
pm2-startup install

# 启动前端服务
pm2 start npm --name "yiran-frontend" -- start

# 保存 PM2 配置
pm2 save
```

### 或使用 NSSM 直接注册

```powershell
nssm install YiranFrontend
# Application Path: C:\Program Files\nodejs\node.exe
# Startup directory: C:\www\yiran-huanxin\frontend
# Arguments: C:\Users\<用户名>\AppData\Roaming\npm\node_modules\next\dist\bin\next start

nssm set YiranFrontend AppParameters "C:\Users\<用户名>\AppData\Roaming\npm\node_modules\next\dist\bin\next start"
nssm set YiranFrontend AppDirectory C:\www\yiran-huanxin\frontend
nssm set YiranFrontend DisplayName "Yiran Huanxin Frontend"
nssm set YiranFrontend Start SERVICE_AUTO_START

nssm start YiranFrontend
```

## 五、IIS 反向代理配置

### 1. 安装 IIS

```powershell
# 以管理员身份运行
Install-WindowsFeature -name Web-Server -IncludeManagementTools
```

### 2. 安装 URL Rewrite 和 Application Request Routing

1. 下载并安装 URL Rewrite：https://www.iis.net/downloads/microsoft/url-rewrite
2. 下载并安装 ARR：https://www.iis.net/downloads/microsoft/application-request-routing

### 3. 配置 IIS 站点

```powershell
# 创建 IIS 站点目录
mkdir C:\inetpub\wwwroot\yiran-huanxin

# 创建 web.config 文件
```

创建 `C:\inetpub\wwwroot\yiran-huanxin\web.config`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- API 请求转发到后端 -->
        <rule name="API Proxy" stopProcessing="true">
          <match url="^api/(.*)" />
          <action type="Rewrite" url="http://127.0.0.1:8000/api/{R:1}" />
        </rule>
        
        <!-- 上传文件转发到后端 -->
        <rule name="Uploads Proxy" stopProcessing="true">
          <match url="^uploads/(.*)" />
          <action type="Rewrite" url="http://127.0.0.1:8000/uploads/{R:1}" />
        </rule>
        
        <!-- 其他请求转发到前端 -->
        <rule name="Frontend Proxy" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://127.0.0.1:3000/{R:1}" />
        </rule>
      </rules>
    </rewrite>
    
    <!-- 静态资源缓存 -->
    <staticContent>
      <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="30.00:00:00" />
    </staticContent>
    
    <!-- Gzip 压缩 -->
    <urlCompression doStaticCompression="true" doDynamicCompression="true" />
    <httpCompression>
      <dynamicTypes>
        <add mimeType="application/json" enabled="true" />
        <add mimeType="text/javascript" enabled="true" />
      </dynamicTypes>
    </httpCompression>
  </system.webServer>
</configuration>
```

### 4. 在 IIS 中创建站点

```powershell
# 导入 IIS 模块
Import-Module WebAdministration

# 创建应用程序池
New-Item -Path "IIS:\AppPools\YiranHuanxin" -Type AppPool
Set-ItemProperty -Path "IIS:\AppPools\YiranHuanxin" -Name "managedRuntimeVersion" -Value ""

# 创建站点
New-Item -Path "IIS:\Sites\YiranHuanxin" -Type Site -Bindings @{protocol="http";bindingInformation="*:80:"} -PhysicalPath "C:\inetpub\wwwroot\yiran-huanxin"
Set-ItemProperty -Path "IIS:\Sites\YiranHuanxin" -Name "applicationPool" -Value "YiranHuanxin"

# 启动站点
Start-Website -Name "YiranHuanxin"
```

## 六、配置域名和 SSL

### 1. 绑定域名

```powershell
# 添加域名绑定
New-WebBinding -Name "YiranHuanxin" -Protocol "http" -Port 80 -HostHeader "your-domain.com"
New-WebBinding -Name "YiranHuanxin" -Protocol "http" -Port 80 -HostHeader "www.your-domain.com"
```

### 2. 安装 SSL 证书

#### 使用 Win-ACME（免费 Let's Encrypt 证书）

1. 下载 Win-ACME：https://www.win-acme.com/
2. 解压到 `C:\win-acme`
3. 运行配置：

```powershell
cd C:\win-acme
.\wacs.exe
```

按提示操作：
- 选择创建新证书
- 输入域名
- 选择 IIS 站点
- 选择自动续期

#### 或导入已有证书

```powershell
# 导入 PFX 证书
$cert = Import-PfxCertificate -FilePath "C:\certs\your-domain.pfx" -CertStoreLocation Cert:\LocalMachine\My -Password (ConvertTo-SecureString -String "your-password" -AsPlainText -Force)

# 添加 HTTPS 绑定
New-WebBinding -Name "YiranHuanxin" -Protocol "https" -Port 443 -HostHeader "your-domain.com"
$binding = Get-WebBinding -Name "YiranHuanxin" -Protocol "https" -Port 443 -HostHeader "your-domain.com"
$binding.AddSslCertificate($cert.Thumbprint, "My")
```

## 七、防火墙配置

```powershell
# 开放 HTTP 端口
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow

# 开放 HTTPS 端口
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow

# 查看防火墙规则
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*HTTP*"}
```

## 八、数据库备份

### 创建备份脚本

创建 `C:\www\yiran-huanxin\backup.ps1`：

```powershell
$Date = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupDir = "C:\www\yiran-huanxin\backups"
$SourceFile = "C:\www\yiran-huanxin\backend\data\yiran_huanxin.db"

# 创建备份目录
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
}

# 备份数据库
Copy-Item $SourceFile "$BackupDir\yiran_huanxin_$Date.db"

# 删除7天前的备份
Get-ChildItem $BackupDir -Filter "*.db" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item

Write-Host "Backup completed: yiran_huanxin_$Date.db"
```

### 配置定时任务

```powershell
# 创建定时任务（每天凌晨2点执行）
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\www\yiran-huanxin\backup.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -TaskName "YiranBackup" -Action $action -Trigger $trigger -User "SYSTEM"
```

## 九、常用运维命令

### 服务管理

```powershell
# 查看后端服务状态
sc query YiranBackend

# 重启后端服务
net stop YiranBackend
net start YiranBackend

# 查看前端服务状态
pm2 status

# 重启前端服务
pm2 restart yiran-frontend

# 查看 PM2 日志
pm2 logs yiran-frontend
```

### IIS 管理

```powershell
# 重启 IIS
iisreset

# 停止站点
Stop-Website -Name "YiranHuanxin"

# 启动站点
Start-Website -Name "YiranHuanxin"

# 查看站点状态
Get-Website -Name "YiranHuanxin"
```

### 日志查看

```powershell
# 后端日志（通过 NSSM 配置）
# 日志位置：C:\www\yiran-huanxin\backend\logs\

# IIS 日志
Get-Content "C:\inetpub\logs\LogFiles\W3SVC*\*.log" -Tail 100

# Windows 事件日志
Get-EventLog -LogName Application -Source "Yiran*" -Newest 50
```

## 十、更新部署

创建更新脚本 `C:\www\yiran-huanxin\update.ps1`：

```powershell
# 停止服务
net stop YiranBackend
pm2 stop yiran-frontend

# 拉取最新代码
cd C:\www\yiran-huanxin
git pull

# 更新后端
cd C:\www\yiran-huanxin\backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 更新前端
cd C:\www\yiran-huanxin\frontend
npm install
npm run build

# 启动服务
net start YiranBackend
pm2 start yiran-frontend

Write-Host "Update completed!"
```

## 十一、故障排查

### 后端无法启动

```powershell
# 检查端口占用
netstat -ano | findstr :8000

# 手动运行测试
cd C:\www\yiran-huanxin\backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# 查看服务日志
# 在服务属性中配置日志输出路径
```

### 前端无法访问

```powershell
# 检查端口占用
netstat -ano | findstr :3000

# 检查 PM2 状态
pm2 status
pm2 logs yiran-frontend

# 手动运行测试
cd C:\www\yiran-huanxin\frontend
npm start
```

### IIS 配置问题

```powershell
# 测试 IIS 配置
Test-Path C:\inetpub\wwwroot\yiran-huanxin\web.config

# 检查应用程序池
Get-ItemProperty IIS:\AppPools\YiranHuanxin

# 查看 IIS 错误日志
Get-Content C:\inetpub\logs\LogFiles\W3SVC1\*.log -Tail 50
```

## 十二、安全建议

1. **修改默认管理员密码**
2. **配置 Windows 更新自动安装**
3. **启用 Windows 防火墙**
4. **定期备份数据库**
5. **使用强密码**
6. **禁用不必要的 Windows 服务**
7. **配置安全策略**

## 十三、性能优化

### IIS 优化

```xml
<!-- 在 web.config 中添加 -->
<system.webServer>
  <httpProtocol>
    <customHeaders>
      <add name="X-Content-Type-Options" value="nosniff" />
      <add name="X-Frame-Options" value="SAMEORIGIN" />
      <add name="X-XSS-Protection" value="1; mode=block" />
    </customHeaders>
  </httpProtocol>
</system.webServer>
```

### 应用程序池优化

```powershell
# 设置应用程序池回收时间
Set-ItemProperty -Path "IIS:\AppPools\YiranHuanxin" -Name "recycling.periodicRestart.time" -Value "00:00:00"  # 禁用定时回收

# 设置最大工作进程
Set-ItemProperty -Path "IIS:\AppPools\YiranHuanxin" -Name "processModel.maxProcesses" -Value 1
```
