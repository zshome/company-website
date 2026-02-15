$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location $PSScriptRoot

Write-Host "====================================================" -ForegroundColor Green
Write-Host "  宜然焕新官网 - 后端服务启动" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

Write-Host "[检查Python]" -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  $pythonVersion" -ForegroundColor Cyan
} catch {
    Write-Host "  错误: 未找到Python，请先安装Python 3.11+" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}
Write-Host ""

Write-Host "[安装依赖]" -ForegroundColor Yellow
pip install -r requirements.txt -q 2>$null
Write-Host "  依赖安装完成" -ForegroundColor Cyan
Write-Host ""

Write-Host "[启动服务]" -ForegroundColor Yellow
Write-Host "  API文档: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  健康检查: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Gray
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
