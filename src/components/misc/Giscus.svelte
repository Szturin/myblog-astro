<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { AUTO_MODE, DARK_MODE } from '@constants/constants.ts';
  import { getStoredTheme } from '@utils/setting-utils.ts';

  // ===== Giscus 配置 =====
  // 访问 https://giscus.app 填入你的仓库信息，获取以下 ID
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
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme } } },
      'https://giscus.app'
    );
  }

  function handleStorageChange(e: StorageEvent) {
    if (e.key === 'theme') {
      const newTheme = getGiscusTheme();
      sendThemeMessage(newTheme);
    }
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

    window.addEventListener('storage', handleStorageChange);
  });

  onDestroy(() => {
    window.removeEventListener('storage', handleStorageChange);
  });
</script>

<div class="giscus-wrapper" bind:this={container}></div>

<style>
  .giscus-wrapper {
    width: 100%;
    margin-top: 1rem;
  }
</style>
