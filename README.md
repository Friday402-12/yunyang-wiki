# 郧中 Wiki

十堰市郧阳中学学生共建的校园知识库。

- 技术栈：VitePress 1.6（Markdown → 静态网站）
- 托管：GitHub Pages（免费，无流量费）
- 特点：全程网页操作，不需要会 Git 命令
- 内容后台：`你的网址/admin/`，图形化编辑 + 审核流，配置见**第十节**

---

# 一、上线（照着做，30 分钟）

## 第 1 步：注册 GitHub

打开 <https://github.com> → Sign up → 用邮箱注册。

> 记好用户名和密码。用户名会成为你网址的一部分。

## 第 2 步：安装 GitHub Desktop（推荐）

下载 <https://desktop.github.com> → 安装 → 用刚才的账号登录。

> 为什么用这个而不是网页上传？  
> 因为仓库里有两个**隐藏文件夹**（`.github` 和 `.vitepress`），网页拖拽上传时经常漏掉，一旦漏了网站就打不开。GitHub Desktop 不会漏。

## 第 3 步：建一个空仓库

在 GitHub Desktop 里：

1. 菜单 `File` → `New repository`
2. Name 填 `yunyang-wiki`
3. Local path 选一个你找得到的位置（比如「桌面」）
4. **不要**勾选 "Initialize with a README"
5. 点 `Create repository`

## 第 4 步：把项目文件放进去

1. 打开刚才创建的文件夹（里面有 `.git` 文件夹）
2. 把本项目里的**所有文件**复制进去
   - 包括 `docs`、`.github`、`package.json`、`.gitignore`
   - **不要**复制 `node_modules`
3. 回到 GitHub Desktop，左下角填一句说明，比如 `init`
4. 点 `Commit to main`
5. 点右上角 `Publish repository`
6. **务必取消勾选 "Keep this code private"**（私有仓库用 Pages 要付费）

## 第 5 步：开启网站

1. 打开 <https://github.com/你的用户名/yunyang-wiki>
2. 点 `Settings` → 左侧 `Pages`
3. `Source` 选择 **GitHub Actions**（不是 Deploy from a branch）
4. 回到仓库首页，点 `Actions` 标签
5. 等 1–2 分钟，看到绿色对勾就成功了

你的网址是：

```
https://你的用户名.github.io/yunyang-wiki/
```

> 第一次进去可能是 404，等两三分钟刷新一下。构建需要时间。

---

# 二、绑定自己的域名

本站使用的域名：**yunyangwiki.wang**（根域名，不带 www）。

## ⚠️ 顺序很重要

**先配 DNS，再加 CNAME 文件。** 反过来会导致故障：GitHub 一旦发现仓库里有 CNAME 文件，就会立刻把 `github.io` 那个地址 301 跳到你的域名；如果这时域名还解析不了，站点会整个打不开。

正确顺序：**DNS 记录 → 确认能解析 → 推 CNAME 文件 → 在 Pages 设置里填域名**。

## 第 1 步：在域名商后台加解析

登录你买域名的平台（阿里云 / 腾讯云 / 新网等），进入「域名解析」，添加下面这些记录。

### 根域名 yunyangwiki.wang（4 条 A 记录）

| 记录类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

这 4 个是 GitHub Pages 的官方 IP，缺一不可（少一条会导致部分用户打不开）。

### www 子域名（1 条 CNAME）

| 记录类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| CNAME | `www` | `friday402-12.github.io` |

这样 `www.yunyangwiki.wang` 也能访问，会自动跳到根域名。

> 想更稳可以再加 4 条 AAAA（IPv6）记录，值分别是
> `2606:50c0:8000::153`、`2606:50c0:8001::153`、`2606:50c0:8002::153`、`2606:50c0:8003::153`。
> 不加也不影响使用。

## 第 2 步：确认域名已实名认证

国内注册的 `.wang` / `.cn` / `.com` 域名必须完成**实名认证**，否则解析不生效、域名状态会显示 `serverHold`。

去域名控制台看「域名状态」，必须是**正常 / ok**。如果显示「未实名认证」，上传身份证、等 1–3 个工作日。

## 第 3 步：推 CNAME 文件

确认 `yunyangwiki.wang` 能 ping 通之后，在仓库里放一个文件：

```
docs/public/CNAME
```

内容只有一行（不要有空格、不要有 http）：

```
yunyangwiki.wang
```

> 这个文件一推上去，`github.io` 那个地址就会开始跳转到新域名。所以务必等 DNS 通了再推。

## 第 4 步：在 GitHub 里填域名

仓库 → `Settings` → `Pages` → **Custom domain** 填 `yunyangwiki.wang` → `Save`。

等 1–2 分钟，DNS check 通过后，勾选 **`Enforce HTTPS`**（强制 HTTPS）。

> 如果 `Enforce HTTPS` 是灰的，说明证书还在签发，通常等 15 分钟到 24 小时，VitePress 的证书是 GitHub 自动申请的 Let's Encrypt。

## 代码会自动适配

不需要改任何配置：

- 检测到 `docs/public/CNAME` 存在 → 网站走根路径 `/`（不再是 `/yunyang-wiki/`）
- sitemap 的域名自动用 CNAME 里的域名
- 页面底部的编辑链接自动指向正确仓库

---

# 三、还需要手动改的地方

**大部分配置已经是自动的，不需要改：**

| 项目 | 怎么来的 |
| --- | --- |
| 站点地址（sitemap） | 有 CNAME 就用 CNAME 的域名，没有就用 GitHub Pages 地址 |
| 资源路径 `base` | 有 CNAME 走 `/`，没有走 `/仓库名/` |
| 页面底部「帮我们改一改」 | 自动拼出当前仓库地址 |
| 侧边栏、分类页、搜索索引 | 扫目录自动生成 |

**真正需要你改的只剩这些：**

| 位置 | 改什么 | 什么时候改 |
| --- | --- | --- |
| `docs/public/admin/config.yml` 第 6 行 | `repo:` 改成你的 `用户名/仓库名` | 启用内容后台时 |
| `docs/.vitepress/config.mts` 的 `nav` | 顶部导航文字 | 想调整栏目时 |
| `docs/.vitepress/config.mts` 的 `footer` | 页脚声明 | 想改文案时 |
| `.github/CODEOWNERS` | 去掉最后一行的 `#` 并把 `your-name` 换成你的用户名 | 想让 PR 自动指派给你时 |

---

# 四、日常维护

## 加一篇文章

1. 打开 `docs/校园生活/` 这类目录
2. 新建一个 `.md` 文件，文件名就是网址，比如 `晚自习.md`
3. 复制下面这段，改掉内容：

```markdown
---
title: 文章标题
order: 10
date: 2026-09-01
reviewedAt: 2026-09-01
category: 校园生活
author:
  - name: 你的名字
description: 一句话摘要，会显示在卡片上
tags:
  - 标签1
  - 标签2
---

# 文章标题

正文写在这里。

## 小标题

- 列表第一项
- 列表第二项
```

1. 保存 → GitHub Desktop 里点 `Commit` → 点 `Push`
2. 等 1 分钟，网站自动更新

> 不需要改任何配置文件。目录、侧边栏、分类页、搜索索引都会自动更新。

## 改一篇文章

直接编辑对应的 `.md` 文件，改完 Commit + Push。

## 让文章"暂时不显示"

在 frontmatter 里加一行 `draft: true`。

## 标记"内容待核实"

加一行 `needsReview: true`，页面会自动挂黄色提示条。

---

# 五、非技术人员怎么投稿

打开网站 → 「参与共建」→「在线投稿工具」。

填表单 → 下载 `.md` 文件 → 发给管理员 → 管理员丢进对应目录。

**不需要注册、不需要会 Markdown、不需要懂 Git。**

---

# 六、本地预览（只有管理员需要）

装了 Node.js（<https://nodejs.org>，选 LTS 版本）之后：

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

Windows 用户也可以直接双击 `preview.bat`。

改文件会自动刷新，适合调试样式。

---

# 七、改样式

- **颜色**：`docs/.vitepress/theme/styles/custom.css` 顶部的 `--vp-c-brand-1`
- **首页**：`docs/index.md` 的 hero 部分
- **字体大小、行距**：同一个 CSS 文件

改坏了不要紧，GitHub 上有历史记录，随时能回退。

---

# 八、常见问题

**Q：Actions 报错 `Get Pages site failed` / `配置 Pages` 这一步失败？**

这是**最常遇到的第一个错误**，几乎每个新仓库都会撞一次。原因不是代码，而是仓库还没启用 Pages。

修复（30 秒）：

1. 打开 `https://github.com/你的用户名/仓库名/settings/pages`
2. 在 **Build and deployment** → **Source** 里选 **GitHub Actions**（不要选 Deploy from a branch）
3. 回到 `Actions` 标签页 → 点开失败的那次运行 → 右上角 **Re-run all jobs**

> 这一步无法自动化。GitHub 官方的 `configure-pages` 虽然有个 `enablement` 参数能自动开 Pages，但官方明确要求「必须使用非 GITHUB_TOKEN 的令牌」，默认令牌不生效，所以只能手动点一次。

**Q：Actions 里显示红色叉号怎么办？**  
点进去看是哪一步失败。除了上面说的 Pages 未启用，另一种常见原因是 `.github/workflows/deploy.yml` 没上传成功（网页拖拽上传容易漏隐藏文件夹）。

**Q：网站打开是白屏 / 没有样式？**  
多半是 `base` 路径问题。如果你绑了自定义域名，要确保 `docs/public/CNAME` 文件存在。代码会自动处理，但 CNAME 文件必须真的存在。

**Q：改完文章网站没更新？**

- 检查 Actions 标签页是否有新的构建
- 强制刷新浏览器（Ctrl + F5）
- 等 1–2 分钟

**Q：图片放哪里？**  
小图可以放 `docs/public/images/`，用 `/images/xxx.png` 引用。图片多了建议用图床（腾讯云 COS、Cloudflare R2），否则仓库会变得很慢。

**Q：会被学校找麻烦吗？**  
页脚已注明"非官方、与学校无关"。注意三条底线：不写他人隐私、不写对具体老师的负面评价、不上传教材试卷。详见「参与共建」页面。

**Q：以后要换成别的框架吗？**  
所有内容都是标准 Markdown 文件，换成任何系统都能直接迁移。不会锁死。

---

# 九、目录结构

```
yunyang-wiki/
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.mts          网站配置（导航、标题、域名）
│  │  ├─ catalog.data.ts     自动收集所有文章
│  │  └─ theme/
│  │     ├─ index.ts
│  │     ├─ components/      卡片列表、作者栏、投稿表单
│  │     └─ styles/          配色
│  ├─ public/                图片、logo、CNAME
│  │  ├─ admin/              内容后台（index.html + config.yml）
│  │  └─ uploads/            后台传的图片存这里
│  ├─ index.md               首页
│  ├─ categories/index.md    全部文章页
│  ├─ 走进郧中/w│  ├─ 校园生活/
│  ├─ 学习指南/
│  ├─ 升学之路/
│  ├─ 社团与活动/
│  ├─ 常见问题/
│  └─ 参与共建/
├─ .github/workflows/deploy.yml   自动部署
├─ package.json
└─ preview.bat
```

---

# 十、开通内容后台（强烈建议，20 分钟）

网站自带一个图形化后台，地址是 `你的网址/admin/`。同学在里面像写公众号一样填标题、选栏目、传图片、写正文，**保存后不会直接上线，会进入「待审核」，你点了发布才生效**。

这就是「加管理员 + 我批准才能改」的完整实现，不需要数据库、不需要服务器。

## 第 1 步：填两个值

打开 `docs/public/admin/config.yml`，改前两处：

```yaml
backend:
  name: github
  repo: 你的用户名/yunyang-wiki   # ← 改这里
  branch: main

site_url: https://你的网址        # ← 改这里
```

## 第 2 步：给编辑开权限（两种方式，选一种）

### 方式 A：令牌登录 —— 不用配任何服务器（推荐给 3–5 人的小团队）

每个编辑自己操作一次：

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. **Generate new token** → Repository access 选 **Only select repositories** → 勾选本站仓库
3. 权限设两项：**Contents** = Read and write，**Pull requests** = Read and write
4. 复制生成的 `github_pat_...`
5. 打开 `你的网址/admin/` → 点 **Sign In with Token** → 粘贴

**编辑就能用了。** 你什么都不用配。

### 方式 B：GitHub 账号一键登录 —— 体验最好，但要部署一个中转

只有这种方式需要额外步骤。原因：GitHub 不开放纯前端授权，必须有一个中转帮你换取访问凭证。

1. 打开 <https://github.com/sveltia/sveltia-cms-auth>，点 **Deploy to Cloudflare**（免费账号即可）
2. 部署完拿到地址，形如 `https://sveltia-cms-auth.xxx.workers.dev`
3. 在 GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL 填你的网址
   - Authorization callback URL 填 `https://sveltia-cms-auth.xxx.workers.dev/callback`
4. 拿到 Client ID 和 Client Secret，填进 Cloudflare Worker 的环境变量
5. 回到 `config.yml`，把 `# base_url:` 那一行的注释去掉，填上你的 Worker 地址

配好之后，编辑点「用 GitHub 登录」就能进，不用碰令牌。

## 第 3 步：验证

1. 打开 `你的网址/admin/`，登录
2. 左边应该看到 7 个栏目
3. 随便新建一篇，点 **Save**（不是 Publish）
4. 去 GitHub 仓库的 **Pull requests**，应该能看到一条待审核的草稿
5. 在后台点 **Publish**，或者去 GitHub 点 **Merge**
6. 等一分钟，网站上就有了

## 你要知道的三个规则

| 事情 | 结果 |
| --- | --- |
| 编辑点 Save | 只生成草稿，**线上没变化** |
| 编辑点 Publish（有权限的人） | 直接合并进主线，自动部署 |
| 你点了 Merge | 同上 |

> 想更严格，去 GitHub 仓库 **Settings → Branches** 给 `main` 加保护规则，勾选 **Require a pull request before merging**。这样连你自己也必须走 PR。

## 没开权限的人能改吗

能。配置里 `open_authoring: true` 已经打开：任何人用自己的 GitHub 账号登录后台，改完提交时，系统会自动复制一份到他名下并开一个合并请求。**你不 Merge，内容永远不上线。**

## 安全提醒

- 令牌等于密码，泄露等于仓库被接管。**设 90 天有效期**，人走了立刻作废
- 后台页面不会被搜索引擎收录，但地址不是秘密，**真正的门是 GitHub 授权**
- 图片会进仓库，单张压到 500KB 以内；图片多了改用图床，否则仓库会越来越慢

详细的角色说明、审核标准、编辑守则，写在网站里的「参与共建 → 编辑团队与权限」那一页，可以直接发给编辑看。

---

# 十一、内容协议

除特别注明外，本站内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh) 协议共享：允许转载，需署名、不得商用、需以相同方式共享。

本站为**非官方**学生项目，与十堰市郧阳中学无隶属关系。
