/**
 * remark-obsidian-images
 *
 * Astro 构建时自动转换 Obsidian 风格的图片路径为 Astro 可识别的格式。
 *
 * 支持的输入格式：
 *   - Obsidian wiki: ![[image.png]]  ![[image.png|alt text]]
 *   - 相对路径:      ![](./image.png)  ![](image.png)
 *   - 子文件夹:      ![](attachments/image.png)  ![](assets/image.png)
 *   - 已有绝对路径:  ![](/posts/slug/image.png)  (保持不变)
 *   - 外部 URL:      ![](https://example.com/image.png) (保持不变)
 *
 * 输出格式：
 *   相对路径 ./image.png（Astro 内容集合原生支持）
 */
import { visit } from 'unist-util-visit';

export function remarkObsidianImages() {
  return (tree, file) => {
    // 1. 先处理 Obsidian wiki 风格的图片嵌入: ![[image.png]] 或 ![[image.png|alt]]
    // 这些在 remark 解析后会变成文本节点中的 ![[...]]
    visit(tree, 'paragraph', (node) => {
      if (!node.children) return;

      const newChildren = [];
      for (const child of node.children) {
        if (child.type === 'text' && child.value.includes('![[')) {
          // 拆分文本节点，将 ![[...]] 转为 image 节点
          const parts = child.value.split(/!\[\[([^\]]+)\]\]/g);
          for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
              // 普通文本
              if (parts[i]) {
                newChildren.push({ type: 'text', value: parts[i] });
              }
            } else {
              // 图片引用: image.png 或 image.png|alt text
              const [imgPath, alt] = parts[i].split('|');
              const fileName = imgPath.trim().split('/').pop(); // 只取文件名
              newChildren.push({
                type: 'image',
                url: `./${fileName}`,
                alt: alt?.trim() || '',
              });
            }
          }
        } else {
          newChildren.push(child);
        }
      }
      node.children = newChildren;
    });

    // 2. 处理标准 markdown 图片节点的路径
    visit(tree, 'image', (node) => {
      const url = node.url;

      // 跳过外部 URL
      if (url.startsWith('http://') || url.startsWith('https://')) return;

      // 跳过已经是 /posts/ 绝对路径的（旧文章）
      if (url.startsWith('/posts/')) return;

      // 跳过 /img/ 等其他绝对路径
      if (url.startsWith('/')) return;

      // 跳过已经是 ./ 相对路径的
      if (url.startsWith('./')) return;

      // 跳过 Windows 绝对路径 (C:\..., D:\..., etc.)
      if (/^[A-Za-z]:[\\\/]/.test(url)) return;

      // 跳过包含 Windows 用户目录的路径（Typora 遗留）
      if (url.includes('AppData') || url.includes('Users')) return;

      // 只处理看起来像合法相对图片路径的
      const fileName = url.split(/[/\\]/).pop();
      if (fileName && /\.(png|jpg|jpeg|gif|svg|webp|avif|bmp|ico)$/i.test(fileName)) {
        node.url = `./${decodeURIComponent(fileName)}`;
      }
    });
  };
}
