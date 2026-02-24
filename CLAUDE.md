# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Turin's Blog — 基于 Astro 5 + Fuwari 主题的个人技术博客。作者 Szturin，内容涵盖嵌入式系统、STM32、ROS2、深度学习、计算机视觉等方向。86 篇文章，部署到腾讯云 VPS。

## 常用命令

```bash
pnpm dev              # 启动开发服务器 (localhost:4321)
pnpm build            # 构建：astro build + pagefind 搜索索引
pnpm preview          # 预览构建产物
pnpm new-post -- <名称>  # 创建新文章
pnpm format           # Biome 格式化
pnpm lint             # Biome 代码检查
```

Windows 快捷方式：双击 `dev.bat`（开发）或 `preview.bat`（构建+预览）

## 架构要点

- **文章目录**: `src/content/posts/*.md` — Fuwari 内容集合
- **旧文章图片**: `public/posts/{slug}/` — 从 Hexo 迁移的图片，按文章 slug 组织，路径 `/posts/{slug}/img.png`
- **新文章图片**: 放在 `src/content/posts/` 中文章旁边，用相对路径 `./img.png`（Astro 原生支持）
- **站点配置**: `src/config.ts` — 标题、导航、个人资料、主题色
- **内容 Schema**: `src/content/config.ts` — Front Matter 字段定义（title + published 必填）
- **Astro 配置**: `astro.config.mjs` — Markdown 插件链
- **样式**: `src/styles/` — Tailwind CSS，主题色通过 HSL hue 控制
- **布局常量**: `src/constants/constants.ts` — PAGE_WIDTH 等全局尺寸

## 分类体系

- **category**（单选）：`学习笔记` / `项目总结` / `技术随笔`
- **tags**（多选）：`STM32` / `单片机` / `嵌入式软件` / `嵌入式硬件` / `操作系统` / `控制工程` / `计算机视觉` / `深度学习` / `机器人技术` / `ROS2` / `算法` / `软件工具` / `编程语言` / `通信协议` / `Linux` 等

## 文章 Front Matter 格式

```yaml
---
title: "文章标题"
published: 2024-01-01       # 必填，YYYY-MM-DD
updated: 2024-02-01         # 可选
category: 学习笔记           # 学习笔记 / 项目总结 / 技术随笔
tags:                       # 可选，数组
  - STM32
  - 嵌入式软件
description: ""             # 可选
draft: false                # 可选，true 隐藏文章
---
```

## Markdown 扩展语法

已配置与 Obsidian 同等的渲染能力：

- KaTeX 数学公式：`$行内$` 和 `$$块级$$`（remark-math + rehype-katex）
- GFM 扩展：~~删除线~~、任务列表 `- [ ]`、脚注 `[^1]`、表格（remark-gfm）
- ==高亮文本==（自定义 rehype-mark-highlight 插件）
- Mermaid 图表：` ```mermaid ` 代码块（客户端 CDN 渲染）
- GitHub Admonitions：`> [!NOTE]`、`> [!WARNING]` 等
- GitHub 仓库卡片：`::github{repo="owner/repo"}`
- Expressive Code 代码块：行高亮 `{1,4-7}`、diff、折叠 `collapse={1-5}`
- Obsidian 图片语法：`![[image.png]]` 自动转换（remark-obsidian-images 插件）

## 自定义插件

- `src/plugins/remark-obsidian-images.mjs` — Obsidian 图片路径自动转换
- `src/plugins/rehype-mark-highlight.mjs` — ==高亮== 语法支持
- `src/plugins/remark-reading-time.mjs` — 阅读时间计算
- `src/plugins/remark-excerpt.js` — 摘要提取

## 部署

构建产物在 `dist/` 目录。腾讯云通过 git bare repo hook 自动部署：
```bash
git push deploy master  # root@122.51.23.7:/var/repo/hexo_static.git
```

## 注意事项

- 包管理器必须用 **pnpm**（项目有 only-allow 限制）
- 旧文章图片路径用 `/posts/{slug}/filename.png` 绝对路径（存放在 `public/posts/`）
- 新文章图片直接放在 `src/content/posts/` 旁边，用相对路径 `./filename.png`
- Obsidian 写作配置：附件存放位置选「当前文件所在文件夹」，关闭 Wiki 链接
