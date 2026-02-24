@echo off
chcp 65001 >nul
echo 正在构建并预览...
cd /d S:\myblog-astro
call pnpm build
if %errorlevel% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)
start http://localhost:4321
pnpm preview
pause
