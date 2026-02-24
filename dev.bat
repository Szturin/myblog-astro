@echo off
chcp 65001 >nul
echo 正在启动 Astro 开发服务器...
cd /d S:\myblog-astro
start http://localhost:4321
pnpm dev
pause
