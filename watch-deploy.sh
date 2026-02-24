#!/bin/bash
# 监听文章变化，自动构建并部署
# 依赖: npm install -g chokidar-cli
# 用法: bash watch-deploy.sh

echo "=== 监听 src/content/posts/ 变化 ==="
echo "修改 .md 文件后将自动构建并部署"
echo "按 Ctrl+C 停止"

npx chokidar "src/content/posts/**/*.md" -c "echo '检测到变化，开始部署...' && pnpm build && scp -r dist/* root@122.51.23.7:/var/www/blog/ && echo '部署完成!'"
