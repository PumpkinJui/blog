---
date:
  created: 2026-07-21
  updated: 2026-07-23
slug: sandbox
categories:
  - 技术
---
# Windows Sandbox 与 Defender

明明之前还好好的，最近使用 Windows Sandbox 时却突然遇到了奇怪的 Defender 问题。我博客的技术区显然正在变成草台班子大全。

---

<!-- more -->

在校外，我校使用 aTrust「无感 VPN」访问校内资源。因为我不想让 aTrust 视奸我的全部网络（电脑端用户协议第一条的标题：终端管控说明及提示），我原来一般用 WebVPN。虽然说都是一家人，但最起码 WebVPN 还只是在浏览器内工作，清个数据就没了。

好景不长，五月份学校开始维护 WebVPN，期间暂停使用。虽然说是维护吧，但谁知道是有限期还是无限期。暂且不论将来，至少现在我是没得选了，要用只能上 aTrust。

在学校，我还是能走校内就不走校外，坚决不下载不安装，但放假回家肯定就没戏了。不过我早做过被视奸的准备，因此之前就折腾过沙箱和虚拟机之类的东西。

应[少数派](https://sspai.com/post/78610)推荐，之前试过 [Sandboxie](https://sandboxie-plus.com/)，但可能是我不会用或者 aTrust 做了检测，安装程序要么直接退出，要么卡在最后一点始终装不上去。

后来改用了 [VirtualBox](https://www.virtualbox.org/)，虚拟机装了一个 Windows 10，倒是能用，但经常遇到死机的问题，尤其是在做学校朔日系统的计算机作业时候。再加上它存储空间占用高，一直也不是很满意。

前几天整理开始菜单，突然发现了一个被我遗忘的东西：Windows Sandbox（WSB）。当时在查找沙箱的时候找到了这个东西，也启用了，但折腾了半天一直打不开，就丢在那没管。结果这回一试居然打开了，不知道是不是后台更新更好了，不得不佩服巨硬的神秘代码。如果你需要启用方法，可以看 [Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/security/application-security/application-isolation/windows-sandbox/windows-sandbox-install) 或者 [Windows Latest](https://www.windowslatest.com/2025/10/27/how-i-installed-microsoft-store-in-windows-sandbox-with-powershell-script/)。

本来想的是和虚拟机一样把东西都装进去，结果关机一开发现没了，原来是无状态沙箱。所以做了一个共享文件夹，每次打开沙箱先挂载共享文件夹，然后从共享文件夹里面把程序装上去再用。这个 WSB 里面甚至连 Edge 都没有，还得自己装一个 Firefox，不知道算是好事还是坏事。不过记事本都没有属实是有点汗流浃背了，给沙箱外面传个文本硬是连 `#!bash echo` 都用上了。

没过两天，估计是后台更新又给更坏了，Firefox 还能装上，但是 aTrust 就不行了。点一次没反应，两次就说已经有一个安装程序在运行了，但反正没弹界面。系统通知一直在弹，Windows.Defender.SecurityCenter 发送的。显示的是：「此应用的一部分已被阻止：aTrustInstaller.exe 的某些功能可能无法正常工作，因为我们无法确认谁发布了 System.dll 应用尝试加载。」巨硬你自己读读是人话吗？对巨硬的代码五体投地。

但是在沙箱里面找了半天，也没看见哪里有个安全中心。「了解详细信息」会跳转 Firefox 一个毫无帮助的帮助链接，叫我去安全中心。任务栏托盘也没有安全中心。用系统搜索搜了一下，没看见有安全中心，倒看见有个安全中心设置。点进去有一个打开安全中心，一点出来个「无法打开此『windowsdefender』链接」。至此已成艺术。

于是求助于互联网，找到了[一个社区问题](https://learn.microsoft.com/zh-cn/answers/questions/5813026/win11-25h2-windows-sandbox-windows)，底下给出了一段配置文件。我还是头一次知道 WSB 可以弄配置文件。

``` xml
<Configuration>
  <LogonCommand>
    <Command>reg add "HKLM\SYSTEM\CurrentControlSet\Control\CI\Policy" /v VerifiedAndReputablePolicyState /t REG_DWORD /d 0 /f</Command>
    <Command>CiTool.exe -r</Command>
  </LogonCommand>
</Configuration>
```

保存为 .wsb 文件，双击打开就可以用了。副作用是必须用这个文件打开 WSB，直接点开始菜单原来那个 WSB 是没有用的。不过没关系，直接给开始菜单塞一个快捷方式就完事了。

Windows 11 的开始菜单位于：

- `C:\ProgramData\Microsoft\Windows\Start Menu\Programs`
- `%APPDATA%\Microsoft\Windows\Start Menu\Programs`

看上去这两个路径的区别只是一个全局一个单用户。先给这个 .wsb 文件挑个风水宝地，然后右键发送到-桌面快捷方式，再把快捷方式复制到上面目录。WSB 原来的快捷方式是在 ProgramData 下面的，所以建议和它放到一起。

既然都用上配置文件了，那显然我应该读读它到底还支持什么。在阅读[配置选项](https://learn.microsoft.com/zh-cn/windows/security/application-security/application-isolation/windows-sandbox/windows-sandbox-configure-using-wsb-file)以后，我觉得只有共享文件夹可以加上去，别的基本不用改。所以最后我的文件变成了：

``` xml
<Configuration>
  <MappedFolders>
    <MappedFolder>
      <HostFolder>E:\Profiles\Shared</HostFolder>
    </MappedFolder>
  </MappedFolders>
  <LogonCommand>
    <Command>reg add "HKLM\SYSTEM\CurrentControlSet\Control\CI\Policy" /v VerifiedAndReputablePolicyState /t REG_DWORD /d 0 /f</Command>
    <Command>CiTool.exe -r</Command>
  </LogonCommand>
</Configuration>
```

一开始这个文件夹只是给 VirtualBox 虚拟机用的，和虚拟机放在一起。后来因为沙箱也要用，再加上受到[一篇新文](https://sspai.com/post/111300)的启示开了 SMB 共享，就挪到了 Profiles 下面，和桌面、下载它们放一块，做成了一个共享专用的文件夹，并且固定到了快速访问。

目前用着 WSB 挺顺手的，VirtualBox 留着备用。
