---
date:
  created: 2026-08-31
  updated: 2026-09-03
slug: termux_symlink_hardlink
categories:
  - 技术
---
# Termux 符号链接与硬链接限制及其部分绕过

由于 Android 系统限制，Termux 在创建[符号链接和硬链接](https://sspai.com/post/66834)时总是会遇到各种各样的问题。本来没什么大不了的，但最佳实践和现代化一点的工具很喜欢用这些链接，导致出现各种安装和使用问题。

本文旨在介绍如何绕过 [uv](https://docs.astral.sh/uv) 和 [pnpm](https://pnpm.io/) 的相关限制，顺利使用这些工具进行开发。

---

<!-- more -->

我知道把符号链接放到 Termux 私有 `~` 目录（`~/storage` 除外，下同）可以避免这些问题，但是如果你开发过程中需要给别人分享开发产物，复制这些文件会很耽误事，即使使用了 [`#!bash termux-open`](https://wiki.termux.dev/wiki/Sharing_Data) 也很费劲。此外，如果没有打开 Termux，[MT 管理器](https://mt2.cn/) 就无法访问挂载的本地存储（虽然我有 root 权限可以直接访问应用目录）。最后的话，如果卸载了 Termux，这些数据就会一并抹除。因此在我看来，在 `~` 目录开发的安全性和便捷性不如直接放到内部存储，也就是 `/sdcard` 或者 `~/storage/shared`。最后，硬链接总没办法。那么就不得不面对这些问题了。

## uv 与虚拟环境

在 Python 生态中，虚拟环境是一个很重要的开发功能。如果不想让自己的全局包目录莫名其妙出现上百个包，最好的方法就是创建虚拟环境。但是如果要在内部存储空间进行开发，试图创建虚拟环境时只会得到：

``` shell-session
[Errno 13] Permission denied
```

Excellent!

不知道为什么，Android 不允许在内部存储空间创建符号链接。除此以外其实还有[很多限制](https://wiki.termux.dev/wiki/Internal_and_external_storage)，比如 `#!bash chmod +x`。真是一个悲伤的故事。

但把包都放在全局包目录呢？倒是也没多大问题，但 Termux 在升级 Python 大版本时，原来版本的包就都用不了了，需要重新装一遍。如果装完才意识到这个问题，那就不得不去 `/data/user/0/com.termux/files/usr/lib/python3.1x/site-packages/` 刨原来装过什么包。这里面混杂着手动装的包，还有这些包所依赖的包。最后要么想出来一个方法从这个目录提取所有包的名称重新安装，要么运行很多遍 `#!bash pip install -r requirements.txt`。这样一来，事情就变得很复杂。别问我怎么知道的。

> Due to our infrastructure limits, we do not provide older versions of packages. If you accidentally upgraded to unsuitable Python version and do not have backups to rollback, do not complain!
>
> ⸺[Termux Wiki](https://wiki.termux.dev/wiki/Python)

与此同时，比起 pip，速度和便捷性更胜一筹的是 uv。uv 倒是能用 `#!bash pkg install uv` 直接安装（注意「倒是」），但 uv 引以为傲的虚拟环境也因为上面的问题用不了了，`#!bash uv run` 根本 run 不通。

既然如此，把虚拟环境创建到 `~` 目录，使用时引用不就可以了吗？那我们就不得不享受一下 `#!bash source ~/.local/share/pyv/some_venv/bin/activate` 了。即使给 `~/.local/share/pyv` 创建一个环境变量叫 `#!bash $VENV`，也没有好多少，而且在使用环境变量以后，Tab 键自动补全会显著变慢。

既然如此，有没有什么优雅一点的解决方法呢？

在翻阅 uv 的文档时，我注意到了一个预览功能：

> With the [`centralized-project-envs` preview feature](https://docs.astral.sh/uv/concepts/preview/), uv stores the default project environment in its cache. uv attempts to maintain a .venv directory link to the cached environment so existing activation and editor workflows can continue to use the usual path. If link creation fails, uv attempts to write the cached environment path to .venv instead. If both attempts fail, uv continues using the cached environment directly, but tools relying on .venv may not discover it. Switching interpreters selects separate cached environments and can reuse them later.
>
> ⸺[uv 文档](https://docs.astral.sh/uv/concepts/projects/layout/#centralized-project-environments)

也就是说，如果启用了这个预览功能，虚拟环境就会建立在 `#!bash $XDG_CACHE_HOME/uv` 内，然后可以回退到环境变量写入文件的操作，避免使用符号链接。

因此在 `~/.bashrc` 中写入：

``` bash
export UV_PREVIEW_FEATURES=centralized-project-envs
```

就可以避免上述虚拟环境问题。以及，你肯定需要在[某一级 .gitignore](https://nelson.cloud/.gitignore-isnt-the-only-way-to-ignore-files-in-git/) 里面忽略掉 `/.venv`。

除此以外，因为硬链接也弄不了，哪怕在 `~` 目录下也不行，所以在使用 `#!bash uv add` 时，uv 还会报以下警告：

``` shell-session
warning: Failed to hardlink files; falling back to full copy. This may lead to degraded performance.
         If the cache and target directories are on different filesystems, hardlinking may not be supported.
         If this is intentional, set `export UV_LINK_MODE=copy` or use `--link-mode=copy` to suppress this warning.
```

按说明在 `~/.bashrc` 中写入：

``` bash
export UV_LINK_MODE=copy
```

即可关闭这一提示。

最后，如果需要使用 `#!bash uv tool`，还会遇到一个警告：

``` shell-session
warning: `/data/data/com.termux/files/home/.local/share/../bin` is not on your PATH. To use installed tools, run `export PATH="/data/data/com.termux/files/home/.local/share/../bin:$PATH"` or `uv tool update-shell`.
```

运行 `#!bash uv tool update-shell` 即可。如果你在意 `~/.bashrc` 的整洁，可以去把前缀改成 `~/.local/share`，或者有定义过的话，`#!bash $XDG_DATA_HOME`。路径中间加 `../` 的语法是对的，可以解析。

## pnpm 安装

考虑到 pnpm 12 已经发布，此处按 next-12 举例，且不保证 11 可以按相同的方法成功安装。

pnpm 根本不在 pkg 的仓库里面，所以没法直接安装。官网上给出的两种安装方法一种是用 npx，另一种是独立脚本。听上去 npx 要简单一点，但是：

``` shell-session
$ npx get-pnpm next-12
Sorry! pnpm does not provide a pre-built binary for android.
```

这就没招了，所以还得是用那个独立的脚本。官网给出的命令是这个样子：

``` bash
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=next-12 sh -
```

如果你直接运行这条命令，将会得到又一个：

``` shell-session
Permission denied (os error 13)
```

Awesome!

为了解决这个问题，我和 AI 交流了一下。虽然 AI 以为我是在用 pnpm 安装某个包，但它成功指出把 `package-import-method` 设为 `copy` 就可以避免这一问题，甚至可以通过环境变量临时设置。于是我们只需运行以下命令：

``` bash
export PNPM_CONFIG_PACKAGE_IMPORT_METHOD=copy
export PNPM_VERSION=next-12
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

这里推荐把它存成一个文件，需要用的时候直接 `#!bash bash pnpm_self.sh` 即可。为什么呢？

因为 `#!bash pnpm self-update` 还会报 `ERR_PNPM_BROKEN_PNPM_INSTALL`，升级也得用这个脚本。

最后我们终于要安装模块了，但还是会遇到无穷无尽的 `Permission denied (os error 13)`。为了解决这个问题，需要同时设置全局配置和项目配置。

全局配置就是上面那个 [`package-import-method`](https://pnpm.io/settings/node-modules#packageimportmethod)。运行命令：

``` bash
pnpm config set -g package-import-method copy
```

而项目配置是 [`node-linker`](https://pnpm.io/settings/node-modules#nodelinker)，如果尝试在全局级别添加这个会报出 `ERR_PNPM_CONFIG_SET_UNSUPPORTED_YAML_CONFIG_KEY`，所以只能在项目级别加。运行命令：

``` bash
pnpm config set --location project node-linker hoisted
```

然后再 `#!bash pnpm i` 就不会出现任何问题了。我不清楚如果用 Git 协作的话这个应该怎么办。

好了这篇就这样，希望用 Termux 能用得开心顺手 :)
