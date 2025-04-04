---
date:
  created: 2025-03-29
  updated: 2025-04-05
archive: true
slug: pages_access_policy
categories:
  - 技术
tags:
  - Pages
---
# 如何关闭 Cloudflare Pages 的 Access Policy 功能

Access Policy 这个功能又容易一不小心打开，又难关掉。想要在 dashboard 关，必须得开通一个方案，而免费方案还必须要银行卡才能开通，一切都显得非常荒谬。

它甚至会把我自己拦在我自己网站的预览分支外面！我点了发送以后，从来没收到过那个所谓的「验证码」！

所幸，在群文档预览分支功能被 Access Policy 陷害了两三个月之后，社区又一次为我提供了解决方案。

<!-- more -->

[How can I disable the Access policy of Cloudflare Pages?](https://community.cloudflare.com/t/how-can-i-disable-the-access-policy-of-cloudflare-pages/292358/11) 用 API 解决了这个问题。

首先，需要确定几个参数。按 Python 的 f-string 风格，后文我使用 `{}` 引用这些参数。

- `account_string`：可以在 dashboard 的链接文本中找到，`https://dash.cloudflare.com/{account_string}`。我的是 32 位。
- `email`：Cloudflare 账户使用的邮箱，格式为 `email@example.com`。
- `key`：在 [API Tokens](https://dash.cloudflare.com/profile/api-tokens) 页面找 Global API Key，点 View，重输密码再过 CAPTCHA 以后复制。我的是 37 位。

然后，我们把上面这些东西都拼进下面这条命令中：

```bash
curl -X GET "https://api.cloudflare.com/client/v4/accounts/{account_string}/access/apps" \
     -H "X-Auth-Email: {email}" \
     -H "X-Auth-Key: {key}" \
     -H "Content-Type: application/json"
```

用命令行执行，会返回一个结果。找到其中需要关 Access Policy 的那个项目，复制 `id`。

然后再来拼下面这条命令：

```bash
curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/{account_string}/access/apps/{id}" \
     -H "X-Auth-Email: {email}" \
     -H "X-Auth-Key: {key}" \
     -H "Content-Type: application/json"
```

同样放进命令行执行。如果看到了 `#!json "success": true`，就大功告成了。

太麻烦了。但凡这玩意能跟 Web Analytics 一样，在 Pages 设置页面弄个关闭按钮……
