#!/bin/bash
# 一键构建并部署到腾讯云
set -e

SERVER="root@122.51.23.7"
REMOTE_DIR="/var/www/blog"

echo "=== 构建中 ==="
pnpm build

echo "=== 上传到服务器 ==="
rsync -avz --delete dist/ "$SERVER:$REMOTE_DIR/"

echo "=== 部署完成 ==="
echo "访问 http://www.turinblog.cn/"
