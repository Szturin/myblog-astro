---
title: 【科研写作】01 - Markdown 与 Latex 数学公式书写
published: 2024-12-16
updated: 2026-02-25
description: ""
category: 技术随笔
tags:
  - 软件工具
  - Markdown
  - Latex
  - 科研写作
  - 博客写作
draft: false
---
# 前言
LaTex是一个排版系统，和我们常用的Word有本质的区别。
与Markdown类似，通过编写“代码”来生成文档。我们写Latex是纯文本脚本，通过编译器处理后，能够生成精美、严谨排版的PDF格式文档。在理工科领域，LaTex是独一无二的存在，无论是复杂的矩阵、微积分公式还是希腊字母，使用LaTex排版都非常专业且美观，Word的公式编译器在美感和效率上难以企及。

---
Markdown和LaTex这两者都是通过“标记语言”来控制格式，但定位完全不同。

| **特性**   | **Markdown**       | **LaTeX**                        |
| -------- | ------------------ | -------------------------------- |
| **定位**   | 轻量级标记语言，追求易读易写。    | 专业排版系统，追求极致的排版质量。                |
| **学习曲线** | 极低                 | 较高，需要学习宏包、环境和命令。                 |
| **功能性**  | 基础排版（标题、加粗、列表）。    | 极其强大（复杂公式、交叉引用、自动目录、精细到微米的间距控制）。 |
| **文件大小** | 非常小。               | 基础安装包很大（完整版数 GB），包含大量宏包。         |
| **适用场景** | 笔记、博客、GitHub 项目说明。 | 学术论文、书籍、幻灯片（Beamer）、复杂公式。        |

---
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
在 Markdown 中使用 LaTeX，本质上是利用 Markdown 解析器（如 MathJax 或 KaTeX）来渲染 LaTeX 格式的数学公式。

---
## 两者的联系
- **公式标准**：Markdown 本身不支持复杂公式，但现在几乎所有主流的 Markdown 编辑器（如 Typora, Obsidian）都使用 **LaTeX 语法**来渲染数学公式。例如输入 `$E=mc^2$`。
- **相互转换**：可以通过工具（如 Pandoc）将 Markdown 转换为 LaTeX，或者反向转换。
---
## 核心语法
在Markdown环境中，LaTex公式主要通过符号`$`来触发。
### 行内公式 (Inline)
- **语法**：将公式包裹在两个单美元符号之间 `$ ... $`。
- **效果**：公式会嵌入在文字流中，不会另起一行。
- **示例**：`勾股定理是 $a^2 + b^2 = c^2$。`
### 块级公式 (Display/Block)
- **语法**：将公式包裹在两个双美元符号之间 `$$...$$`。
- **效果**：公式会独占一行，通常居中显示，且字体略大。
- **示例**：
    ```markdown
    $$
    E = mc^2
    $$
    ```
---
# 三、示例
## 1. 基础运算与符号

|**说明**|**LaTeX 语法**|**渲染效果**|
|---|---|---|
|**上下标**|`x_{i}^{2} + y_{j}^{3}`|$x_{i}^{2} + y_{j}^{3}$|
|**分式**|`\frac{a+b}{c-d}`|$\frac{a+b}{c-d}$|
|**开方**|`\sqrt[n]{x}`|$\sqrt[n]{x}$|
|**希腊字母**|`\alpha, \beta, \gamma, \omega, \Omega`|$\alpha, \beta, \gamma, \omega, \Omega$|
|**向量/粗体**|`\vec{a} \cdot \mathbf{b}`|$\vec{a} \cdot \mathbf{b}$|

---

## 2. 高等数学

| **说明**            | **LaTeX 语法**                      | **渲染效果**                          |
| ----------------- | --------------------------------- | --------------------------------- |
| **累加 (Sum)**      | `\sum_{i=1}^{n} i^2`              | $\sum_{i=1}^{n} i^2$              |
| **积分 (Integral)** | `\int_{a}^{b} f(x) \, dx`         | $\int_{a}^{b} f(x) \, dx$         |
| **极限 (Limit)**    | `\lim_{x \to \infty} \frac{1}{x}` | $\lim_{x \to \infty} \frac{1}{x}$ |
| **偏导数**           | `\frac{\partial y}{\partial x}`   | $\frac{\partial y}{\partial x}$   |

---

## 3. 线性代数

对于矩阵和多行公式，建议使用**块级公式**（即包裹在 `$$...$$` 之间）以获得最佳显示效果。

### 矩阵 (Matrix)

```latex
\begin{bmatrix}
    1 & 0 & 0 \\
    0 & 1 & 0 \\
    0 & 0 & 1
\end{bmatrix}
```


$$\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

### 分段函数 (Cases)
```latex
f(n) = \begin{cases} 
    n/2, & \text{if } n \text{ is even} \\
    3n+1, & \text{if } n \text{ is odd} 
\end{cases}
```


$$f(n) = \begin{cases} n/2, & \text{if } n \text{ is even} \\ 3n+1, & \text{if } n \text{ is odd} \end{cases}$$
### 多行对齐 (Aligned)

当你推导公式时，希望等号对齐：


```latex
\begin{aligned}
    (a+b)^2 &= (a+b)(a+b) \\
            &= a^2 + 2ab + b^2
\end{aligned}
```

$$\begin{aligned} (a+b)^2 &= (a+b)(a+b) \\ &= a^2 + 2ab + b^2 \end{aligned}$$

---

## 4. 进阶

1. **括号自动缩放**：如果你写 `(\frac{1}{2})`，括号会很小，很难看。
    - **改进**：使用 `\left( \frac{1}{2} \right)`。效果：$\left( \frac{1}{2} \right)$。括号会自动包裹住内容。
2. **公式中的空格**：LaTeX 公式中直接打空格是无效的。
    - **微调间距**：`\,` (小空格), `\;` (大空格), `\quad` (一个字符宽度), `\qquad` (两个字符宽度)。
3. **公式中的正体**：变量默认是斜体，但单位（如 kg, m/s）或特定函数（如 log, sin）应该用正体。
    - **正确写法**：`\sin(x)`, `10 \, \text{kg}`。效果：$\sin(x)$, $10 \, \text{kg}$。

---
### 总结
- **行内引用**：使用 `$公式$`，适合把符号嵌入句子。
- **独立展示**：使用 `$$公式$$`，适合展示核心结论。
- **代码查阅**：遇到复杂的直接去 [Mathpix](https://mathpix.com/) 截图，利用AI编写。

---
## 常用工具汇总

| **类别**   | **工具名称**                    | **核心功能与亮点**                    |
| -------- | --------------------------- | ------------------------------ |
| **编辑器**  | **Overleaf**                | 在线协作 LaTeX，免安装，内置海量期刊模板。       |
| **编辑器**  | **VS Code/Obsidian/Typora** | 快速本地撰写                         |
| **公式输入** | **Mathpix Snip**            | 截图自动转 LaTeX 代码                 |
| **公式输入** | **Detexify**                | 手写符号识别，解决“不知道符号命令是什么”的问题。      |
| **表格制作** | **Tables Generator**        | 像用 Excel 一样在线画表，一键生成 LaTeX 源码。 |
| **文献管理** | **Zotero / BibTeX**         | 自动管理参考文献，一键生成文中引用和末尾列表。        |
| **矢量绘图** | **TikZ / Matplotlib**       | 生成无限放大不失真的学术图表，支持直接嵌入 LaTeX。   |

---
# 参考文章
-  [如何优雅地在Markdown中输入数学公式 - 不爱喝橙子汁的橙子 - 博客园](https://www.cnblogs.com/syqwq/p/15190115.html#%E4%B8%80%E5%9F%BA%E7%A1%80%E9%83%A8%E5%88%86)
