# 郧中 Wiki · 项目进度

> 更新时间：2026-10-24
> 线上地址：<https://friday402-12.github.io/yunyang-wiki/>
> 当前阶段：**绑定自定义域名（就差阿里云后台那几条记录）**

---

## 0. 现在要做的唯一一件事

**进度（2026-10-24 22:40）—— 域名已上线**

- ✅ 4 条 A 记录 + 1 条 www 的 CNAME 均已生效（权威 DNS、DNSPod、阿里公共 DNS 全部返回正确结果）
- ✅ `https://yunyangwiki.wang/` 正常；`http://` 已自动 301 跳到 https
- ✅ `github.io/yunyang-wiki/` 已 301 跳到新域名
- ✅ 全站验收通过：7 个栏目、4 篇抽查文章、robots、sitemap、og、favicon、404、`/admin/` 全部正常
- ⏳ **唯一遗留：证书里还没有 `www`**。GitHub 会在 DNS 变更后自动重签（最长 24 小时）
  → 去 Pages 页点一次 **Check again** 可以催一下
  → 在这之前 `https://www.yunyangwiki.wang` 会报证书不匹配，**对外发链接先发裸域名**

**下一步：回到内容。** 域名这条线已经走完了，剩下的都是内容活（见第 6 节）。

代码这边**不需要再改**：域名、favicon、分享卡片、robots、后台地址都会跟着真实域名自动切换。

---

## 1. 一句话现状

- 站点已上线可用：**1 篇经过核对的正文（校史与校训）+ 3 篇参与共建说明**，其余 17 篇泛化文章已于 2026-10-24 全部撤下
- 内容后台可用：`网址 + /admin/`，`editorial_workflow` 模式（编辑保存 → 只有站长点发布才上线）
- 投稿闭环已打通：任何人都能通过 GitHub Issue 表单投稿/纠错，不需要仓库权限
- 代码侧零配置：加了 `docs/public/CNAME` 之后，站点会自动从 `/yunyang-wiki/` 切到根路径

---

## 2. 域名解析（阿里云后台那个弹窗）

### 2.1 根域名 `yunyangwiki.wang` → 4 条 A 记录

截图里的「快速添加解析」弹窗，按这个填：

1. 业务需求保持选中 **「将网站域名解析到服务器 IPv4 地址」**
2. 「请选择网站域名」**只勾 `yunyangwiki.wang`（对应 @）**，www 这次先别勾
3. 「请输入网站的 IP」框里粘这 4 行（一行一个）：

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

4. 点 **确定**。列表里会出现 **4 条 A 记录**，主机记录都是 `@`、记录值各不相同

> 这 4 个是 GitHub Pages 的官方 IP，**缺一条会导致部分地区打不开**。不要加你自己的服务器 IP。

### 2.2 `www` 子域名 → 1 条 CNAME（不是 A 记录）

弹窗做不了 CNAME，回到「解析设置」页点 **添加记录**：

| 字段 | 填什么 |
| --- | --- |
| 记录类型 | `CNAME` |
| 主机记录 | `www` |
| 记录值 | `friday402-12.github.io` |
| TTL | 默认（10 分钟） |

> 为什么 www 用 CNAME 不用 A：指到 `friday402-12.github.io`，GitHub 才能给 `www.yunyangwiki.wang` 也签发 HTTPS 证书，并自动跳回根域名。

### 2.3 验证（等 1–10 分钟）

命令行（Windows 也能用）：

```
nslookup yunyangwiki.wang 223.5.5.5
```

看到 `185.199.10x.153` 就说明解析生效了。

或者直接把 `http://yunyangwiki.wang` 粘进浏览器：
- 打开是 **GitHub 404 页面** → DNS 已生效，只是仓库还没认这个域名，这是**正常状态**，继续 2.4
- 打不开 / 超时 → DNS 还没生效，再等等

### 2.4 通了以后（顺序不能反）

1. ~~在仓库里新建文件 **`docs/public/CNAME`**~~ ✅ **已完成**（内容一行 `yunyangwiki.wang`，无扩展名）

2. 提交并推送 → 等 Actions 变绿（此时站点地址会从 `github.io/yunyang-wiki/` 切到根域名）
3. 仓库 → **Settings → Pages → Custom domain** 填 `yunyangwiki.wang` → Save
4. 等 DNS check 通过（几分钟）→ 勾上 **Enforce HTTPS**
5. 浏览器打开 `https://yunyangwiki.wang/` 验证

> ⚠️ **顺序不能反**：GitHub 一旦发现仓库里有 CNAME 文件，会立刻把 `friday402-12.github.io/yunyang-wiki/` 301 跳到新域名。如果那时 DNS 还不通，**全站会直接打不开**，而且是别人打不开、你自己测试也可能看不出原因。

> 如果 `Enforce HTTPS` 是灰的：证书还在签发，等 15 分钟到 24 小时，GitHub 走 Let's Encrypt 自动签。

---

## 3. 网址速查

| 用途 | 地址 |
| --- | --- |
| 现在能用的 | <https://friday402-12.github.io/yunyang-wiki/> |
| 域名通了以后 | <https://yunyangwiki.wang/> |
| 内容后台 | 网址 + `/admin/` |
| 代码仓库 | <https://github.com/Friday402-12/yunyang-wiki> |
| 投稿 / 纠错 | 仓库 Issues（网站上每页底部、404 页、投稿页都有入口） |

---

## 4. 日常维护

### 加一篇文章

1. 打开 `docs/校园生活/` 这类目录，新建 `文章名.md`（文件名就是网址）
2. 复制这段改掉内容：

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
---

# 文章标题

正文写在这里。
```

3. 提交推送，1 分钟后自动上线

> 侧边栏、分类页、搜索索引都会自动更新，**不需要改任何配置文件**。
> 加一个文章不会动导航；想加的是**整个栏目**，才需要改 `docs/.vitepress/sections.ts`（只改这一个文件就够）。

### 改样式 / 文案

| 想改什么 | 改哪里 |
| --- | --- |
| 主色（深红） | `docs/.vitepress/theme/styles/custom.css` 顶部 `--vp-c-brand-1` |
| 首页大标题与按钮 | `docs/index.md` 的 `hero` 部分 |
| 页脚免责声明 | `docs/.vitepress/config.mts` 的 `footer` |
| 栏目清单 / 顺序 | `docs/.vitepress/sections.ts` |
| 分享卡片图片 | 改 `tools/make-og.py` 里的文案，然后 `python tools/make-og.py` |

### 谁都能投稿（不需要账号权限）

- 网站上「参与共建 → 在线投稿工具」填表 → 点「打开投稿 / 纠错表单」→ 变成一个 GitHub Issue
- 站长在仓库 Issues 里看到、回复、整理进文章
- 不会用 GitHub 的同学：下载 `.md` 发给群里转交，效果一样

### 后台三种角色

| 角色 | 能做什么 | 需要什么 |
| --- | --- | --- |
| 站长 | 发布、驳回、改配置 | 仓库所有者 |
| 编辑 | 写稿、改稿、保存为「待审核」 | GitHub 账号 + 令牌或 OAuth |
| 投稿者 | 提 Issue / 交文件 | 什么都不需要 |

---

## 5. 已完成的工作

### 阶段 0–4（摘要）

- 选型 VitePress 1.6.4（稳定版，不跟 2.0 alpha）
- 骨架：中文目录名、侧边栏自动生成、分类页自动聚合、时效提醒组件
- 内容：7 个栏目 21 篇正文，约 2.1 万字；校史部分核对过政府/学校官网公开信息
- 后台：Sveltia CMS + 审批流 + fork/PR 投稿
- 上线：GitHub Actions → GitHub Pages，7 条路径全部 200

### 2026-10-24 第二轮优化（10 项）

| 问题 | 怎么修的 |
| --- | --- |
| 线上 favicon 404 | `head` 里改成 `${BASE}logo.svg`（原来写死 `/logo.svg`，子路径部署必 404） |
| 域名三处写死且没解析 | 改成构建时推导：`SITE_URL` → `CNAME` → 仓库名 → localhost |
| 顶栏缺「社团与活动」「常见问题」 | 导航改为从 `sections.ts` 生成，现 8 项 |
| 没有 robots.txt、没有分享图 | 构建生成 robots；新增 `og.png` + 每页 `og:*` / `canonical` |
| 后台拉 unpkg latest | 锁到 jsDelivr + 版本 `0.251.0` |
| **中文搜索等于不可用** | MiniSearch 默认按空白/标点切词，改为中文二元组分词 |
| 窄屏表格撑破页面 | 恢复 VitePress 默认的横向滚动（原来被 CSS 覆盖成 `display:table`） |
| **本机 `npm run build` 报错** | 机器没 git 时 `spawn git ENOENT`；改成探测到 git 才启用最后更新时间 |
| 71% 页面挂「没人核实过」 | 文案改为「细节还没有逐条核实」，保留核实入口 |
| 贡献闭环断裂 | 新增 GitHub Issue 表单，页脚/文章页脚/投稿页/404 都有入口 |

结构性改动：新增 `docs/.vitepress/sections.ts`（栏目唯一来源，以前加栏目要改 5 个文件）。

### 第三次调整（同日）：把泛化的内容全部撤下

**触发原因**：审读时发现 21 篇正文里，有 20 篇是「放在任何学校都成立」的通用建议——
「错峰吃饭」「荤素搭配」「错题本怎么用」「各校不同，通常 4–8 人」。全站搜出 53 处对冲表述，
仅「新生三十问」一篇就占 12 处。这类内容看着完整，实际一句可用的信息都没有。

**处理**：

- 删除 **17 篇**：食堂、宿舍、作息与课表、校园卡与网络、交通与周边、选科、分班与考试、
  竞赛与强基、学习方法、高考基本盘、志愿填报、社团怎么选、校园活动日历、新生三十问、
  校园速览、报到流程、常见部门与联系方式
- 保留 **`校史与校训`**（有史料来源、可核对）+ **参与共建 3 篇**（投稿指南 / 投稿工具 / 编辑团队，站点说明书）
- 空栏目**不留白**：`ArticleList` 新增空状态，每个栏目写清「这里缺什么」并给投稿入口
- 首页、分类页、各栏目首页、投稿指南同步改写
- 投稿指南新增一条判断标准：**「这段话换到任何一所学校还成立吗？」成立就别写**

> 删掉的文件都在 git 历史里，需要时 `git show <commit>:docs/校园生活/食堂.md` 就能取回。


### 验证方式（改代码请照做）

1. **模拟 CI 跑真实构建**：`GITHUB_ACTIONS=true GITHUB_REPOSITORY=Friday402-12/yunyang-wiki`，再 `vitepress build docs`，约 3 秒；VitePress 自带死链检查，链接写错会直接失败
2. **对产物断点检查**：favicon 前缀、og 标签、canonical、robots、后台 config 改写、中文 404、导航、sitemap 共 21 项
3. **搜索分词实测**：默认分词搜「怎么吃」0 命中，二元组分词命中

---

## 6. 现在还缺什么（这才是重点）

站点已清空到只剩 1 篇正文，接下来的全部工作就是**把具体的东西写回来**：

| 栏目 | 现在最该有的第一篇 |
| --- | --- |
| 校园生活 | 食堂楼层与窗口（几点人最少）、宿舍熄灯与门禁、作息时刻表 |
| 走进郧中 | 报到那天从校门到宿舍的完整路线（配图最好） |
| 学习指南 | 分班按什么考、月考怎么算、选科什么时候截止 |
| 升学之路 | 本校近几年各分数段去向、强基/专项怎么报名 |
| 社团与活动 | 一份真实社团名单：谁在带、哪天招新、每周占多少时间 |
| 常见问题 | 一条条写「几号楼、几层、几点、找谁、带什么材料」 |

写之前先过一遍：**这段话换到任何一所学校还成立吗？** 成立就别写。

另外两件工程侧的事（不急）：

- 国内访问实测（GitHub Pages 在移动网络下不稳定，先测再决定要不要迁）
- 接一个统计，看哪篇真的被看得最多

---

## 7. 踩过的坑（精简版）

| 现象 | 原因 | 解法 |
| --- | --- | --- |
| 构建报 `localeCompare is not a function` | YAML 的 `date` 被解析成 Date 对象 | 归一化成字符串；用 `getFullYear/getMonth/getDate`，**不能用 `toISOString()`**（GMT+8 会少一天） |
| 手机上卡片文字被切、页面横向溢出 | 长中文把 grid 撑出容器 | 容器和卡片加 `min-width: 0`，列宽 `minmax(min(100%, 250px), 1fr)` |
| 页面上露出 `**` 星号 | CommonMark 的 CJK 强调规则：`**加粗。**紧接正文` 不满足 right-flanking | 把标点移到星号外：`**加粗**。紧接正文` |
| 首页标题变成「郧中 Wiki · 郧中 Wiki」 | `titleTemplate` 又套了一次 | 首页 frontmatter 加 `title` + `titleTemplate: false` |
| 首次部署报 `Get Pages site failed` | 仓库没启用 Pages | Settings → Pages → Source 选 GitHub Actions，再 Re-run（无法自动化） |
| 本地预览文章页 404 | `python -m http.server` 不支持 cleanUrls | 用 `npm run dev` 或 `npm run preview` |
| 重建后预览服务崩溃 | 重建替换了带哈希的 JS | 重建前先停服务 |
| 本机 `npm run build` 报 `spawn git ENOENT` | 机器没装 git | 已自动检测并关闭最后更新时间 |

---

## 8. 文件地图

```
yunyang-wiki/
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.mts          标题、域名推导、导航生成、SEO、robots、后台地址对齐
│  │  ├─ sections.ts         ★ 栏目清单（导航/侧边栏/分类页/投稿表单的唯一来源）
│  │  ├─ catalog.data.ts     收集全部文章给列表组件用
│  │  └─ theme/              配色、卡片列表、文章页脚、投稿表单
│  ├─ public/
│  │  ├─ admin/              内容后台（index.html + config.yml）
│  │  ├─ uploads/            后台上传的图片
│  │  ├─ og.png              分享缩略图
│  │  └─ CNAME               ← 域名确认后才加
│  ├─ 404.md                 中文 404 页
│  └─ <7 个栏目>/*.md        内容
├─ tools/make-og.py          重新生成分享卡片
├─ .github/
│  ├─ workflows/deploy.yml   自动构建部署
│  └─ ISSUE_TEMPLATE/        投稿 / 纠错表单
├─ README.md                 上线与运维手册
└─ PROGRESS.md               本文件
```

当前规模：14 个 Markdown、构建出 15 个页面、搜索索引 108 KB（内容清空后会随文章增加回升）。

---

## 9. 常用命令

```bash
npm install        # 首次
npm run dev        # 本地开发 http://localhost:5173
npm run build      # 构建并检查死链（推送前跑一次）
npm run preview    # 预览构建产物
```

Windows 也可直接双击 `preview.bat`。

---

## 10. 给接手的人

- **别删 `.github` 和 `.vitepress` 两个隐藏目录**，网页拖拽上传最容易漏，漏了站点直接打不开
- **令牌等于仓库钥匙**：设 90 天有效期，有人退出立刻作废；公共电脑用完记得退出
- **改域名只需要动 DNS 和 CNAME 文件**，代码会自动适配；但顺序一定是「先 DNS，后 CNAME」
- 内容最大的风险不是没人写，而是**没人维护导致信息过期**。页面上的黄条就是在提醒这件事
- 站长毕业前一定要**转移仓库所有权或指定共同维护者**——这是所有校园 Wiki 的共同死法
