---
title: "【Git】04 - 远程仓库"
published: 2024-09-16
updated: 2024-11-08
description: ""
category: 学习笔记
tags:
  - 软件工具
  - Git
---

## 重命名远程仓库

```plaintext
git remote rename origin github
```
![](/posts/45839/image-20240916133628463.png)

# 问题

## 一、Hexo推送源文件，安全性报错

![](/posts/45839/image-20240916135838561.png)

解决方案：转到log中指向的链接，选择use for test,

![](/posts/45839/image-20240916135827657.png)

可以看到，修改后，再次push，成功提交到github。

![](/posts/45839/image-20240916140029571.png)
