---
date:
  created: 2024-08-10T18:47:57
  updated: 2025-03-21
archive: true
slug: how_to_gitbook
categories:
  - 技术
tags:
  - GitBook
  - Pages
---
# 如何配置 GitBook-cli 环境

/// note | 文档历史说明

本文档最早位于[群文档](https://groupdocs.pages.dev/)，于 <https://github.com/PumpkinJui/groupdocs/commit/2ba4aaa9a36afc288aaf6bfae1559b2551298087> 添加，作为编写参考。后因群文档迁移至 [Docusaurus](https://docusaurus.io/) 而失去其原有作用，特此于 <https://github.com/PumpkinJui/groupdocs/commit/d1d1b43c85600911263a945fa838b4742e744f0b> 迁出。

迁出后，本文档进行了 MkDocs 适配，并对一些问题进行更新。感谢 @鸽子 对此次更新的贡献。

本文档之目的为，在**已有 GitBook 文档项目**的前提下，通过 GitBook-cli 进行预览。文档假设您基本没有使用命令行的经验。

///

## 为什么要有这篇教程

GitBook-cli 是 CloudFlare Pages 构建时可以选择使用的框架之一。它是现在的 [GitBook.com Platform](https://www.gitbook.com) 的前身，随[开发重心转移](https://github.com/GitbookIO/gitbook/blob/legacy/README.md)而被搁置。

> As the efforts of the GitBook team are focused on the GitBook.com platform, the CLI is no longer under active development.

在群文档的建设中，一般需要在推送更改后等待 CF Pages 更新，然后查看是否有 bug，将 bug 修复后再次提交并推送。这样很不方便，而且一次提交能解决的事情，为什么要两次提交解决呢？

后来，群文档将 GitBook-cli 使用的 [Markdown 语法](https://github.com/GitbookIO/gitbook/blob/legacy/docs/syntax/markdown.md)作为归档类文件添加，以期有所改善。但查看文档 (甚至是全英的文档)，怎么能比得上自己用相同的框架打包一次来得快、准确和可靠呢？

因此，作为 <https://github.com/PumpkinJui/groupdocs/issues/21> 的解决方案，我们将在本文中指导您如何安装 GitBook-cli，及如何利用它进行测试。

在下文中，我们就分别在 Termux 平台和 Windows 平台指导您安装它。

<!-- more -->

## 安装 GitBook-cli 环境

### 前期准备工作

/// tab | Termux

#### [Termux](https://termux.dev/cn/) 介绍

> Termux 是一个适用于 Android 的终端模拟器，其环境类似于 Linux 环境。

在 Termux 中运行每一行命令后，运行完成的标志是绿色的运行路径重新出现，后面带有 `$` 和白色的光标。运行路径以 `~` 开头。

首先，**给予 Termux 存储权限**。  
运行 `#!bash termux-setup-storage`，并在弹窗中允许 Termux 访问存储空间。

然后，**设置 Termux 镜像**。  
输入 `#!bash termux-change-repo` 后，按 ++Enter++ 两次，按 ++Down++ 两次，按 ++Space++，按 ++Enter++。  
或者说，选择 `Mirror group` 后选择 `Mirrors in Chinese Mainland`。  
设置后，Termux 会自动进行镜像速度测试，选择速度最快的镜像，检查所有包的更新，并提示是否存在可更新的包。

之后，**安装 Node.js**。  
运行 `#!bash pkg install nodejs`；如有确认，按 ++Y++ 后回车。  
Termux 会自动下载 (get) 包、解压 (unpack) 包并安装 (set up) 包。

///
/// tab | Windows
    select: True

你需要安装 Node.js。  
在 [Node.js 官网](https://nodejs.org/zh-cn/download/prebuilt-installer) 选择使用的系统和架构后点击下载，网站会自动下载安装包。

下载完成后安装，基本上一路 Next 就行了。

按 ++Win+R++，输入 `cmd`，回车。

/// tip | 关于 Windows 上的命令行

Windows 的命令行有 cmd 和 PowerShell 两种，语法不尽相同。本文中默认为 cmd。  

在该环境中，选中文本按右键是复制功能，不选中文本按右键是粘贴功能。

在 cmd 运行每一行命令后，运行完成的标志是运行路径重新出现，后面带有白色的闪烁光标。

///
///

### 安装 GitBook-cli

**从现在起，忽略任何 `deprecated` 警告，不管是哪里报的。那是 GitBook-cli 长期无人维护的锅。**

首先，**设置 npm 镜像**。  
运行 `#!bash npm config set registry https://registry.npmmirror.com`。  
此命令不会返回结果。

然后，**安装 GitBook-cli**。  
运行 `#!bash npm install -g gitbook-cli`。  

/// warning | 参数说明

命令中的 `-g` 不可省略，否则后面会报错：

- Termux：`No command gitbook found` 或 `gitbook: command not found`
- Windows：`'gitbook' 不是内部或外部命令，也不是可运行的程序或批处理文件。`

///

将返回 `added {x} packages in {y}s`，其中 `{x}` 和 `{y}` 为数字。

### 安装 GitBook (Part I)

没想到吧。

> The purpose of the gitbook command is to load and run the version of GitBook you have specified in your book (or the latest one), irrespective of its version.  
  参考翻译：gitbook 命令的目的是加载并运行您在书中指定的 GitBook 版本（或最新版本），无论其版本如何。

运行 `#!bash gitbook help`，会提示 `Installing GitBook x.y.z` (`x.y.z` 为版本号，应为 `3.2.3`)，然后等着。它过一会就该报错了。

### 处理报错

/// tab | Termux

报错信息应为：

```shell-session
/data/data/com.termux/files/usr/lib/node_modules/gitbook-cli/node_modules/npm/node_modules/graceful-fs/polyfills.js:287
      if (cb) cb.apply(this, arguments)
                 ^

TypeError: cb.apply is not a function
    at /data/data/com.termux/files/usr/lib/node_modules/gitbook-cli/node_modules/npm/node_modules/graceful-fs/polyfills.js:287:18
    at FSReqCallback.oncomplete (node:fs:198:5)
```

我们将用一行代码和三步操作解决这个问题。

> 解决方案原文：[gitbook 出现 TypeError: cb.apply is not a function 解决办法](https://www.cnblogs.com/cyxroot/p/13754475.html)

1. `#!bash nano /data/data/com.termux/files/usr/lib/node_modules/gitbook-cli/node_modules/npm/node_modules/graceful-fs/polyfills.js`，回车。  
   可以复制上面的代码；或输入 `nano` 加空格后，直接把报错信息里面的路径复制进去 (注意别把行号也加进去)。  
   如果手打的话，切记路径里面**一共出现了三次 `node_modules`**。这个文件也存在于 `/data/data/com.termux/files/usr/lib/node_modules/gitbook-cli/node_modules/graceful-fs/polyfills.js` (少了 `npm/node_modules`)，但这个文件**不会报错**。
2. ++Ctrl+F++，输入 `statFix`，按 ++Enter++。  
   如果你好奇 ++Ctrl++ 键在哪，键盘上面的两行里面。
3. 之后你会看到三行包含 `statFix` 的代码 (不是 `statFixSync`)。在这三行代码上面的空行加上 `/*`，下面的空行加上 `*/`，以注释掉它们。  
   或者如果你愿意的话，在这三行代码前面都加上 `//`，效果相同。  
   使用键盘上面两行里面的上下左右箭头移动光标。
4. ++Ctrl+O++，++Enter++，++Ctrl+X++。  
   或者，如果你愿意，++Ctrl+X++，++Y++，++Enter++。

///
/// tab | Windows
    select: True

报错信息应为：

```shell-session
%APPDATA%\npm\node_modules\gitbook-cli\node_modules\npm\node_modules\graceful-fs\polyfills.js:287
      if (cb) cb.apply(this, arguments)
                 ^

TypeError: cb.apply is not a function
    at %APPDATA%\npm\node_modules\gitbook-cli\node_modules\npm\node_modules\graceful-fs\polyfills.js:287:18
    at FSReqCallback.oncomplete (node:fs:198:5)
```

我们将用三步操作解决这个问题。

> 解决方案原文：[gitbook 出现 TypeError: cb.apply is not a function 解决办法](https://www.cnblogs.com/cyxroot/p/13754475.html)

1. 复制报错文件的路径，打开报错的文件。（不推荐自行翻找文件夹，有些文件夹可能被隐藏了，另外很容易找错。）
2. 搜索 `statFix`。  
   你会看到三行包含 `statFix` 的代码 (不是 `statFixSync`)。在这三行代码上面的空行加上 `/*`，下面的空行加上 `*/`，以注释掉它们。  
   或者如果你愿意的话，在这三行代码前面都加上 `//`，效果相同。
3. 保存。

/// warning | 关于编辑器

应当使用**除了**记事本外，任何可以编辑**纯文本**的软件打开报错的文件。

推荐使用：

- [Visual Studio Code](https://code.visualstudio.com/Download)
- [Sublime Text](https://www.sublimetext.com/download)
- [Notepad--](https://gitee.com/cxasm/notepad--/releases/latest)
- 甚至各种 Python 编辑器

> 请注意，***不要用 Word 和 Windows 自带的记事本***。Word 保存的不是纯文本文件，而记事本会自作聪明地在文件开始的地方加上几个特殊字符，结果会导致程序运行出现莫名其妙的错误。
>
> ——廖雪峰的 [Git](https://liaoxuefeng.com/books/git/create-repo/) 和 [Python](https://liaoxuefeng.com/books/python/first-program/text-editor/) 教程

///
///

### 安装 GitBook (Part II)

再次运行 `#!bash gitbook help`，仍会提示 `Installing GitBook x.y.z` (`x.y.z` 为版本号)。

耐心等待一段时间。最终将会提示：

/// tab | Termux

```shell-session
gitbook@3.2.3 ../usr/tmp/{tmp-xxxxxxxxxxxxxxxxx}/node_modules/gitbook
├── destroy@1.0.4
├── {若干依赖项……}
└── nunjucks@2.5.2 (asap@2.0.6, yargs@3.32.0, chokidar@1.7.0)
    build [book] [output]       build a book
    {若干帮助文档……}
        --log                   Minimum log level to display (Default is info; Values are debug, info, warn, error, disabled)
```

///
/// tab | Windows
    select: True

```shell-session
gitbook@3.2.3 AppData\Local\Temp\{tmp-xxxxxxxxxxxxxxxx}\node_modules\gitbook
├── escape-html@1.0.3
├── {若干依赖项……}
└── nunjucks@2.5.2 (asap@2.0.6, yargs@3.32.0, chokidar@1.7.0)
    build [book] [output]       build a book
    {若干帮助文档……}
        --log                   Minimum log level to display (Default is info; Values are debug, info, warn, error, disabled)
```

///

这时，GitBook 就已经安装成功了。

## 如何使用 GitBook-cli 环境进行测试

### 使用 `cd` 命令导航到项目所在的目录

/// tab | Termux

`cd` 命令使用方法很简单，只需要在后面加一个空格，再加相对或绝对路径就行了。命令区分大小写。

例如，在 `~` 目录下运行 `#!bash cd storage` (使用相对路径) 或 `#!bash cd ~/storage` (使用绝对路径)，可以导航至 `~/storage` 目录。

内部共享存储空间 (即手机内部存储) 所在目录为 `~/storage/shared`。

///
/// tab | Windows
    select: True

在 cmd 中，`CD` 命令一般配合 `/D` 参数使用，以正确切换盘符。

在 `#!bash CD /D` 后增加一个空格，然后输入相对路径或绝对路径。命令不区分大小写，有时也不严格区分 `\` 与 `/`。

例如，在 `C:\Users\Administrator` 目录下运行 `#!bash CD /D Desktop` (使用相对路径) 或 `#!bash CD /D C:\Users\Administrator\Desktop` (使用绝对路径)，可以导航至 `C:\Users\Administrator\Desktop` 目录。

///

### 开始测试

运行 `#!bash gitbook serve`。将会提示：

```shell-session
$ gitbook serve
Live reload server started on port: 35729
Press CTRL+C to quit ...

info: {x} plugins are installed
info: {x} explicitly listed
info: loading plugin "xxxx"... OK
……
info: loading plugin "xxxx"... OK
info: found {xx} pages
info: found {xx} asset files
info: >> generation finished with success in {x.x}s !

Starting server ...
Serving book on http://localhost:4000
```

在此之后，在本机浏览器访问最后一行给出的 `http://localhost:4000`，即可预览群文档。在命令行 ++Ctrl+C++ 即可关闭此服务。所有被转换成 HTML 的文件都位于 `_book` 目录下。

/// note | 关于 `livereload`

`livereload` 插件本身用于实时更新预览，但似乎因为长期无人维护而无法使用。因此修改后，需要 ++Ctrl+C++ 并重新运行 `#!bash git serve`。

///

## 附：如何在 CF Pages 上使用 GitBook 框架部署

上面那个报错，其实是因为新版的 Node.js 不兼容旧版的 GitBook-cli 所导致的。我们在本地可以通过直接修改的方式来至少让它跑起来，但在云端并不能这么人为干预。那么，应该怎么做呢？

答案是，使用旧版的 Node.js。

在配置时，页面当中有一项「环境变量」。在此处加入新的环境变量，键为 `NODE_VERSION`，值为 `10.24.1`，就可以正确启动了。
