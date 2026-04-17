# Journal - myblog-astro (Part 1)

> AI development session journal
> Started: 2026-04-18

---



## Session 1: 博客功能完善 + 代码审查修复

**Date**: 2026-04-18
**Task**: 博客功能完善 + 代码审查修复

### Summary

(Add summary)

### Main Changes

| 功能 | 说明 |
|------|------|
| Giscus 评论 | 新增评论系统，支持暗/亮主题自动同步（MutationObserver） |
| OG 图优化 | 文章封面图现在用于社交分享预览，修复 URL 双斜杠问题 |
| 404 页面 | 新增符合博客风格的 404 错误页 |
| 构建修复 | 修复 markdown.css btn-regular-dark 跨文件 @apply 报错 |
| Obsidian 兼容 | Vite 忽略 .base 文件，解决 Obsidian Bases 插件冲突 |
| Trellis 初始化 | 完成 Bootstrap Guidelines，填充前端规范文档 |

**修复的 Bug**：
- Giscus 主题同步改用 MutationObserver（storage 事件只在跨标签页触发）
- entry.render() 双重调用合并为一次，减少构建开销
- OG 图片 URL 用 new URL() 构造，避免双斜杠

**修改文件**：
- `src/components/misc/Giscus.svelte`（新建）
- `src/pages/404.astro`（新建）
- `src/layouts/Layout.astro`
- `src/layouts/MainGridLayout.astro`
- `src/pages/posts/[...slug].astro`
- `src/styles/markdown.css`
- `astro.config.mjs`
- `.trellis/spec/frontend/*.md`（6 个规范文件）


### Git Commits

| Hash | Message |
|------|---------|
| `04bcf9d` | (see git log) |
| `b4d8643` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete
