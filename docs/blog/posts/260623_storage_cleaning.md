---
date:
  created: 2026-06-23
  updated: 2026-06-24
slug: storage_cleaning
categories:
  - 技术
---
# 所以到底应该怎么清理 C 盘

来都来了，顺便写一点我总结的空间清理通用策略吧。

---

<!-- more -->

## 移动大文件夹

大多数情况下，硬盘空间都是被少数几个大文件夹填满的。

常见的通用大文件夹包括：

- `C:\Program Files` 和 `C:\Program Files (x86)`。这两个目录是装软件用的，安装软件时可以直接把盘符换到 D，也就是 `D:\Program Files` 这样。
- `%APPDATA%`。也是装软件的，但是这个涉及到 Windows 的多用户设计，一般动不了。
- `%LOCALAPPDATA%`。一般是软件数据一类。
- `%USERPROFILE%` 下面的桌面、下载、文档三个目录。这个可以在对应文件夹的属性页面选择「位置」选项卡，挪到其他盘。当然也可以养成不在这些文件夹存东西的好习惯。

常见的应用专属大文件夹包括：

- 微信数据，默认位于 `%USERPROFILE%\Documents\xwechat_files`。可以在微信的设置页面里面修改，选中的目录会在里面新建一个 `xwechat_files` 文件夹，再放数据文件。
- QQ 数据，默认位于 `%USERPROFILE%\Documents\Tencent Files`。和上面同理。
- WPS 备份数据，默认位于 `%LOCALAPPDATA%\Kingsoft\WPS Office`，这个目录打开是一些软件版本号，选一个最新的进去，再进入 `backupcenter`。这个也别挪了，没啥用直接删了吧。备份可以在 WPS 首页右上角调调设置，具体不太清楚。有条件去装 [Microsoft](https://otp.landian.vip/) [Office](https://massgrave.dev/)。
- Steam 游戏数据，通常在第一次下载时会让你选，然后生成一个 `steamapps` 目录。可以看一下放在哪个盘了，以及不玩的游戏该删删。

如果上面这些查了都没问题，可以考虑看一下空间占用分布。慢一点也不太准的是看每个目录的属性页面（选中以后 ++Alt+Enter++），看占用空间有多少；快一点也更直观的是上软件，比如 [TreeSize](https://www.jam-software.com/treesize) 和 [Wiztree](https://www.diskanalyzer.com/)。

## 避免流氓软件

有时候在某某下载站一步棋下错，全家就都进电脑里面了，俗称捆绑安装。常见的是看图软件、压缩软件和浏览器，毕竟使用频率很高。之前回附中帮忙，给好几个老师清理，都发现了大量此类软件。

此外，在有病毒时，360 是最好的安全卫士；没有病毒时，360 就是最大的流氓软件。比如说，装了一个 360 压缩，紧跟着就会一个弹窗，把卫士也捎回家，诸如此类。因此应当避免 360 系产品，包括但不限于（打开 360 官网）安全卫士、杀毒、压缩、看图、壁纸、安全浏览器、极速浏览器、安全云盘、搜索、纳米搜索、清理、C 盘扩容、驱动大师，诸如此类。

有些人认为看几个广告、收集一些隐私数据就能换来免费的服务，是一件很好的事情。我个人难以认同这种想法。当然，我出手或许会比一些人更阔绰一些，但我无意说服每个人都应该为软件付费。或许只是消费理念和在意的东西不一样罢了。但一定需要注意的是，正是这样的想法，促成了 360 这类软件的形成。

我能给出避免流氓软件的建议，包括以下几点：

- 减少使用国产软件。倒不是我不爱国，但从上面 WPS 和 360 的例子里面，我们已经窥见了国产软件的通病。能换的尽量换一下，例如用 MS Office 替换 WPS，用 Edge/Chrome/Firefox 替换某某安全浏览器，诸如此类。
- 从可信渠道下载软件。不要和下载站的高速下载低速下载多少个通道较劲，从官网下载。你可能想问官网长什么样子，至少它会比较短，大概率会和开发者或者软件名字有一点关系，搜索结果旁边没有广告标识，以及没有奇怪的三级域名。有能力的可以配置包管理器，例如 WinGet、[Scoop](https://scoop.sh/) 和 [Chocolatey](https://chocolatey.org/)。实在搞不了，找个软件商店也成，后面再说。
- 定期检查软件列表。Windows 11 ++Win+I++ 打开设置，选应用 → 安装的应用；没有这个选项卡可以去控制面板 → 程序 → 程序和功能 → 卸载或更改程序。

另外还有一些最佳实践。

杀毒的话，基本上[火绒](https://huorong.cn/)就够用了，可以拦截捆绑安装，以及它还带了一个可以禁用的软件商店。

解压的话，[7-Zip](https://7-zip.org/) 是极简方案（[中文页面的官网](https://sparanoid.com/lab/7z/)，但可能有点显得简陋了。那样可以用 [Bandizip](https://www.bandisoft.com/bandizip/)，嫌广告又不想付费可以看[破解版](https://www.423down.com/9735.html)。  
如果有压缩 RAR 的需求就没得选了，只能用 [RARLab](https://www.rarlab.com/) 的 [WinRAR](https://www.rarlab.com/)，还有[国内特供版](https://www.winrar.com.cn/)，区别在于国际版有弹窗提醒试用期（实际上可以一直试用），而国内版有弹窗广告。

看图就 Windows 自带就够了，别整那些乱七八糟的。顺便说一句，百度网盘会[篡改](https://www.landian.news/archives/110368.html)这个。

浏览器御三家，[Microsoft Edge](https://www.microsoft.com/zh-cn/edge)、[Google Chrome](https://www.google.cn/chrome/)、[Mozilla Firefox](https://www.firefox.com/zh-CN/)。我个人喜欢 Firefox。

## 其他小妙招

火绒垃圾清理可以跑一下，也许能清出来点东西。Windows 自己的存储感知也可以自动优化空间使用。

以及，重买解决 100% 的问题。如果硬盘实在太小，还是趁早换一台电脑吧。插个存储条也成，如果能改装的话，注意别贪便宜。

希望您的 C 盘剩余空间充足，电脑运行速度良好。
