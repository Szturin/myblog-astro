/**
 * rehype-mark-highlight
 *
 * 将 Markdown 中的 ==高亮文本== 转换为 <mark>高亮文本</mark>
 * 在 rehype (HTML AST) 阶段处理文本节点中的 ==...== 模式
 */
import { visit } from 'unist-util-visit';

export function rehypeMarkHighlight() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (!node.value.includes('==')) return;

      // 匹配 ==text== 模式
      const parts = node.value.split(/(==(?:[^=]|=[^=])+==)/g);
      if (parts.length <= 1) return;

      const newNodes = [];
      for (const part of parts) {
        const markMatch = part.match(/^==([\s\S]+)==$/);
        if (markMatch) {
          newNodes.push({
            type: 'element',
            tagName: 'mark',
            properties: {},
            children: [{ type: 'text', value: markMatch[1] }],
          });
        } else if (part) {
          newNodes.push({ type: 'text', value: part });
        }
      }

      parent.children.splice(index, 1, ...newNodes);
    });
  };
}
