---
date:
  created: 2025-03-22
  updated: 2025-04-05
archive: true
slug: pages_fetching_solution
categories:
  - 技术
tags:
  - gitbook
  - mkdocs
  - docusaurus
---
# 如何使 CloudFlare Pages 显示文档的创建和修改时间

CloudFlare Pages 有一个问题，就是没有设定 fetch 深度的选项。默认只会到最新一次提交，于是所有时间都变成了构建当天的日期。

光是时间不对也就算了。MkDocs 的 RSS 插件甚至还会报错 `#!python IndexError`！

怎么解决呢？我在 RSS 插件的 issues 列表里找到了办法。

<!-- more -->

[Cloudflare Pages fetch-depth](https://github.com/timvink/mkdocs-git-revision-date-localized-plugin/issues/123#issuecomment-2513449963) 这里面说，

> My solution was to add `#!bash git fetch --unshallow` to the build command under build configuration on Cloudflare pages. So my full build command is `#!bash git fetch --unshallow && mkdocs build`.

就这么简单。把 `#!bash mkdocs build` 改成 `#!bash git fetch --unshallow && mkdocs build`，就能用了。

原理是什么呢？既然你自动化流程只会 fetch 到最新一次提交，我就再手动 fetch 一遍整个 commit 列表，然后再构建。

不可谓不高明。这也再次印证了命令行[功能强大、组合灵活](https://sspai.com/post/78249)的优势。
