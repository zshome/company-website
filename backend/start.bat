@echo off
cd /d "%~dp0"

echo ====================================================
echo   Yiran Huanxin Backend Server
echo ====================================================
echo.

python --version
if %errorlevel% neq 0 (
    echo Error: Python not found
    pause
    exit /b 1
)
echo.

echo Installing dependencies...
pip install -r requirements.txt -q
echo.

echo Starting server...
echo API Docs: http://localhost:8000/docs
echo Health Check: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop
echo ====================================================
echo.

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
