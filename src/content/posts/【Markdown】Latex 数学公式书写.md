---
title: 【Markdown】Latex 数学公式书写
published: 2024-12-16
updated: 2026-02-25
description: ""
category: 技术随笔
tags:
  - 软件工具
  - Markdown
draft: true
---
# 前言
LaTex是一个排版系统，和我们常用的Word有本质的区别。
与Markdown类似，通过编写“代码”来生成文档。我们写Latex是纯文本脚本，通过编译器处理后，能够生成精美、严谨排版的PDF格式文档。在理工科领域，LaTex是独一无二的存在，无论是复杂的矩阵、微积分公式还是希腊字母，使用LaTex排版都非常专业且美观，Word的公式编译器在美感和效率上难以企及。


Markdown和LaTex这两者都是通过“标记语言”来控制格式，但定位完全不同。

| **特性**   | **Markdown**       | **LaTeX**                        |
| -------- | ------------------ | -------------------------------- |
| **定位**   | 轻量级标记语言，追求易读易写。    | 专业排版系统，追求极致的排版质量。                |
| **学习曲线** | 极低                 | 较高，需要学习宏包、环境和命令。                 |
| **功能性**  | 基础排版（标题、加粗、列表）。    | 极其强大（复杂公式、交叉引用、自动目录、精细到微米的间距控制）。 |
| **文件大小** | 非常小。               | 基础安装包很大（完整版数 GB），包含大量宏包。         |
| **适用场景** | 笔记、博客、GitHub 项目说明。 | 学术论文、书籍、幻灯片（Beamer）、复杂公式。        |

# 一、Latex 基本语法
LaTeX 的语法逻辑非常清晰。它的结构主要分为两个部分：**导言区（Preamble）和正文区（Body）**。

---
## 1. 文档的基本结构
一个最简单的 LaTeX 文件（`.tex`）长这样：
```latex
% 1. 声明文档类型 (如 article, report, book)
\documentclass{article}

% 2. 导言区：引入宏包（类似 Python 的 import 或 C 的 include）
\usepackage[utf8]{inputenc} % 处理编码
\usepackage{amsmath}        % 数学公式增强包

% 3. 正文区
\begin{document}

Hello, LaTeX! 这是我的第一个文档。

\end{document}
```
---
## 2. 常用文本格式命令
LaTeX 的命令通常以反斜杠 `\` 开头，参数放在花括号 `{}` 中。

- **分段**：在代码里空一行，或者使用 `\par`。
- **粗体**：`\textbf{加粗文本}`
- **斜体**：`\textit{斜体文本}`
- **章节标题**：
    - `\section{一级标题}`
    - `\subsection{二级标题}`
    - `\subsubsection{三级标题}`
---
## 3. 环境（Environments）
“环境”用于处理需要特殊格式的区块，以 `\begin{...}` 开始，`\end{...}` 结束。
### 列表环境
- **无序列表**：
    代码段
    ```latex
    \begin{itemize}
      \item 第一项
      \item 第二项
    \end{itemize}
    ```
    
- **有序列表**：将 `itemize` 换成 `enumerate` 即可。
---
## 4. ==数学公式（核心语法）==
这是 LaTeX 最强大的地方。公式分为**行内公式**和**行间公式**。
- **行内公式**：使用 `$ ... $`。例如：`$a^2 + b^2 = c^2$` 会在段落中显示 $a^2 + b^2 = c^2$。
- **行间公式**：使用 `\[ ... \]` 或 `equation` 环境。
    ```latex
    \begin{equation}
        E = mc^2
    \end{equation}
    ```
### 常用数学符号对照：
- **上下标**：`x^2` ($x^2$), `a_n` ($a_n$)
- **分式**：`\frac{分子}{分母}` ($\frac{1}{2}$)
- **根号**：`\sqrt{x}` ($\sqrt{x}$)
- **希腊字母**：`\alpha, \beta, \gamma, \pi` ($\alpha, \beta, \gamma, \pi$)
- **求和/积分**：`\sum_{i=1}^n` ($\sum_{i=1}^n$), `\int_a^b` ($\int_a^b$)

---
## 5. 插入图片与表格
### 插入图片
需要先在导言区加入 `\usepackage{graphicx}`。
```
\begin{figure}[h]    % [h] 表示放在当前位置 (here)
    \centering
    \includegraphics[width=0.5\textwidth]{image_name}
    \caption{图片标题}
    \label{fig:my_label}
\end{figure}
```
### 插入表格
建议使用在线生成器（如 [Tables Generator](https://www.tablesgenerator.com/)），因为手写复杂的 LaTeX 表格代码比较繁琐。
## 6. 交叉引用（自动编号）
这是 LaTeX 自动化的体现。你不需要手动写“见图 3”，只需要：
1. 在图表或章节处设置标签：`\label{key}`
2. 在正文里引用：`As shown in Figure \ref{key}.`
    LaTeX 在编译时会自动帮你填上正确的数字。

# 二、Markdown书写LaTex
### 两者的联系
- **公式标准**：Markdown 本身不支持复杂公式，但现在几乎所有主流的 Markdown 编辑器（如 Typora, Obsidian）都使用 **LaTeX 语法**来渲染数学公式。例如输入 `$E=mc^2$`。
- **相互转换**：你可以通过工具（如 Pandoc）轻松地将 Markdown 转换为 LaTeX，或者反向转换。
- **纯文本本质**：两者都是纯文本文件，非常适合配合 Git 等版本控制工具进行管理。


# 三、示例

$E=mc^2$

# 总结

# 参考文章
-  [如何优雅地在Markdown中输入数学公式 - 不爱喝橙子汁的橙子 - 博客园](https://www.cnblogs.com/syqwq/p/15190115.html#%E4%B8%80%E5%9F%BA%E7%A1%80%E9%83%A8%E5%88%86)
