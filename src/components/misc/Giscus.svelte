<script lang="ts">
  import { onMount } from 'svelte';
  import { AUTO_MODE, DARK_MODE } from '@constants/constants.ts';
  import { getStoredTheme } from '@utils/setting-utils.ts';

  // ===== Giscus 配置 =====
  const REPO = 'Szturin/myblog-astro';
  const REPO_ID = 'R_kgDORX1C1A';
  const CATEGORY = 'Announcements';
  const CATEGORY_ID = 'DIC_kwDORX1C1M4C7FsF';
  // ======================

  let container: HTMLDivElement;

  function getGiscusTheme(): string {
    const stored = getStoredTheme();
    if (stored === DARK_MODE) return 'dark';
    if (stored === AUTO_MODE) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  function sendThemeMessage(theme: string) {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      'https://giscus.app'
    );
  }

  onMount(() => {
    const theme = getGiscusTheme();
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', REPO);
    script.setAttribute('data-repo-id', REPO_ID);
    script.setAttribute('data-category', CATEGORY);
    script.setAttribute('data-category-id', CATEGORY_ID);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;
    container.appendChild(script);

    // 监听 <html> class 变化（dark 类增减）来同步 Giscus 主题
    // 使用 MutationObserver 而非 storage 事件，因为 storage 事件
    // 只在其他标签页触发，无法捕获当前页面的主题切换
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      sendThemeMessage(isDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  });
</script>

<div class="giscus-wrapper" bind:this={container}></div>

<style>
  .giscus-wrapper {
    width: 100%;
    margin-top: 1rem;
  }
</style>
