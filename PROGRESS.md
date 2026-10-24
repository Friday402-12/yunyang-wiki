# 郧中 Wiki · 项目进度

> 快照时间：2026-10-24 21:30
> 当前阶段：**第 5 阶段（绑定域名）进行中**
> 本文档记录从零到上线的完整过程，供交接、复盘、以及未来复制到其他学校时参考。

---

## 一、一句话现状

站点已建成并上线，20 篇文章、7 个栏目可访问；内容后台（含审批流）已部署可用；正在把地址从 `github.io` 切换到 `yunyangwiki.wang`。

---

## 二、关键地址

| 用途 | 地址 |
| --- | --- |
| 线上（当前生效） | https://friday402-12.github.io/yunyang-wiki/ |
| 线上（切换后） | https://yunyangwiki.wang/ |
| 代码仓库 | https://github.com/Friday402-12/yunyang-wiki |
| 内容后台 | 域名 + `/admin/` |
| Actions 构建 | 仓库 → Actions 标签 |
| 本地目录 | `D:\workbuddy\yunyang-wiki` |

---

## 三、已完成的工作（按阶段）

### 阶段 0 · 调研选型

- 拆解参考站点 `wiki.ncepuinfo.cc`：确认其技术栈是 **VitePress 2.0.0-alpha.20 + Vue3 自定义主题**，自研搜索、Cloudflare Worker 图床、GitHub Actions 部署，共 815 次提交 / 72 篇文章。
- 结论：**校园攻略站的流量 90% 来自搜索引擎**，所以必须用静态站（SEO 好、免费、加载快），排除飞书/语雀/Notion 这类前端渲染方案。
- 决策：用 **VitePress 1.6.4 稳定版**而非对方的 2.0 alpha，因为维护团队没有前端能力，稳定性优先。

### 阶段 1 · 搭建站点骨架

- 目录约定：`docs/<栏目名>/<文章名>.md`，中文目录名，便于非技术同学维护。
- **侧边栏自动生成**：构建时扫描目录、读 frontmatter 的 `title` 和 `order` 排序，新增文章零配置。
- **分类页自动聚合**：`catalog.data.ts` 用 `createContentLoader` 收集全部文章，`ArticleList.vue` 支持 `only` / `latest` / `limit` / `exclude` 四种渲染模式。
- **时效提醒**：`ArticleFooter.vue` 注入页脚，超过 365 天自动挂「内容可能过期」黄条；标了 `needsReview: true` 的挂「尚未核实」提示。
- 配色：郧山书院意象的深红（`#8C1F28`），logo 用「山 + 日」简笔图形。

### 阶段 2 · 填充内容

- 7 个栏目、20 篇文章、30 个 Markdown 文件：
  - 走进郧中（4）、校园生活（5）、学习指南（4）、升学之路（2）、社团与活动（2）、常见问题（1）、参与共建（3，含管理类）
- 校史部分做了事实核查：1547 年郧山书院、1902 年郧阳府中学堂、1994 年定名、校训「明德博学，进而不已」——均来自政府公开信息与学校官网。
- **具体数字一律留白**（菜价、作息时刻、部门电话、宿舍人数），只写方法论并标 `needsReview`，避免编造误导。

### 阶段 3 · 内容后台

- 部署 **Sveltia CMS** 到 `/admin/`，7 个 collection 对应 7 个栏目，字段与 frontmatter 严格对应。
- 开启 `publish_mode: editorial_workflow`：**编辑保存只生成草稿，站长点发布才上线**——这就是「他人可写、我批准才生效」的实现。
- 开启 `open_authoring: true`：任何人用 GitHub 账号即可提交，不需要仓库权限，走 fork + PR。
- 配套：角色权限说明页、CODEOWNERS、PR 自检模板。
- 关键调研：**GitHub 至今不支持纯前端 OAuth**（PKCE 已搁置），所以给两条路——① 个人访问令牌登录（零服务器，实测可用）② Cloudflare Worker 中转（体验最好，需配一次）。

### 阶段 4 · 上线

- 仓库公开、Actions 自动构建部署到 GitHub Pages。
- 首次构建失败一次，原因与修复见第五节第 9 条。
- 线上验收：8 个路径全部 200、资源前缀正确、sitemap 正确、手机端单列无溢出、搜索索引 168K、404 页正常。

### 阶段 5 · 绑定域名（进行中）

- 域名：`yunyangwiki.wang`（根域名，不带 www）。
- 代码侧已适配（已验证）：检测到 `CNAME` 文件后，资源路径自动从 `/yunyang-wiki/` 切到 `/`，sitemap 域名自动切到新域名。
- 待完成：DNS 解析 → 实名认证确认 → 推 CNAME 文件 → Pages 填域名 → 强制 HTTPS。

---

## 四、可复用的标准流程

如果要在别的学校复刻这套东西，按这 8 步走：

1. **建仓库**：GitHub Desktop 发布，必须 Public（私有仓库用 Pages 要付费）
2. **开 Pages**：Settings → Pages → Source 选 **GitHub Actions**（这步不做，首次构建必失败）
3. **推代码**：GitHub Desktop → Push origin，Actions 自动构建
4. **配后台**：改 `admin/config.yml` 的 `repo`，生成令牌登录（Contents + Pull requests 读写）
5. **加 DNS**：根域名 4 条 A 记录 + www 一条 CNAME
6. **推 CNAME**：确认 DNS 通了**之后**再推，否则站点会短暂打不开
7. **填域名**：Pages → Custom domain → 等证书 → 勾 Enforce HTTPS
8. **交搜索引擎**：提交 sitemap（一定在域名定下来之后做）

> 顺序不能乱：第 2 步漏了必失败，第 5、6 步顺序反了会掉线。

---

## 五、踩过的坑（10 条，最有价值的部分）

| # | 现象 | 原因 | 修法 | 状态 |
| --- | --- | --- | --- | --- |
| 1 | 构建报 `(b.date\|\|"").localeCompare is not a function` | gray-matter 把 YAML 的 `date` 解析成 **Date 对象**，不是字符串 | 归一化成字符串；且必须用 `getFullYear/getMonth/getDate` 本地取值，**不能用 `toISOString()`**（GMT+8 下会少一天） | 已修 |
| 2 | 手机端卡片文字被切掉、页面横向溢出 | 卡片在 `.vp-doc` 内，长中文把 grid 撑出容器 | 容器和卡片加 `min-width: 0`，列宽用 `minmax(min(100%, 250px), 1fr)` | 已修 |
| 3 | 窄屏截图看起来严重溢出 | **Windows 会把 Edge 无头窗口宽度钳制到 492px**，`--window-size=390` 只是裁切，不是真溢出 | 放一个打印 `innerWidth` 的探测页确认真实视口 | 认知修正 |
| 4 | Hero 标题出现单字孤行 | `hero.text` 实际可用宽度约 470px（≈8 个汉字），改 CSS `max-width` 不生效 | 直接缩短文案 | 已修 |
| 5 | 本地看文章页 404 | `python -m http.server` 不支持 cleanUrls | 用 `npm run preview` 或 `npm run dev` | 已规避 |
| 6 | 页面上露出 `**` 星号、加粗失效 | **CommonMark 的 CJK 强调规则**：`**加粗。**紧接正文` 中闭合 `**` 前是中文标点、后接文字，不满足 right-flanking | 把标点移到星号外面：`**加粗**。紧接正文`。已全局修 5 处，并写进投稿指南 | 已修 |
| 7 | 重建后预览服务崩溃（ENOENT 哈希资源） | 重建会替换带哈希的 JS，正在服务的进程读不到旧文件 | 重建前先停服务，或重建后重启 | 已规避 |
| 8 | 首页 `<title>` 变成「郧中 Wiki · 郧中 Wiki」 | `titleTemplate` 会给无独立标题的首页再套一次后缀 | 首页 frontmatter 加 `title: xxx` + `titleTemplate: false` | 已修 |
| 9 | 首次部署 Actions 报 `Get Pages site failed` | 仓库没启用 Pages | Settings → Pages → Source 选 GitHub Actions，再 Re-run。**无法自动化**：官方 `configure-pages` 的 `enablement` 参数要求非 `GITHUB_TOKEN` 的令牌 | 已修 |
| 10 | （预防）加 CNAME 后站点打不开 | GitHub 一发现 CNAME 就把 `github.io` 301 跳到新域名，DNS 未通时全站不可达 | 顺序必须「先 DNS，后 CNAME」 | 已规避 |

---

## 六、当前待办

| 事项 | 谁做 | 阻塞点 |
| --- | --- | --- |
| 推送域名适配提交 `968de63` | 站长 | 无 |
| 加 5 条 DNS 记录 | 站长（域名商后台） | 需要 `.wang` 实名认证通过 |
| 确认 DNS 生效 | 我可代查 | 等上一步 |
| 推 CNAME 文件 | 站长 | 等 DNS 生效 |
| Pages 填域名 + 强制 HTTPS | 站长 | 等上一步 |
| 生成令牌登录后台 | 站长 | 5 分钟，随时可做 |

---

## 七、下一步计划

1. **完成域名切换**（当前）
2. **提交搜索引擎**：域名定下来之后提交 sitemap 到必应/百度，接 IndexNow 主动推送
3. **补内容**：优先补「校园地图」「食堂窗口」「作息时刻表」这类高搜索量、目前留白的页
4. **招募编辑**：3–5 人分区负责制，跑通「编辑提交 → 站长审核」的闭环
5. **入学季前**（每年 8 月）内容必须齐备——这是校园 Wiki 唯一确定的流量窗口

---

## 八、关键文件地图

```
yunyang-wiki/
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.mts          导航、侧边栏自动生成、域名与路径自动推导
│  │  ├─ catalog.data.ts     收集全部文章，供列表组件使用
│  │  └─ theme/
│  │     ├─ index.ts         注入页脚组件
│  │     ├─ components/      ArticleList / ArticleFooter / SubmitForm
│  │     └─ styles/          配色与排版
│  ├─ public/
│  │  ├─ admin/              内容后台（index.html + config.yml）
│  │  ├─ uploads/            后台上传的图片
│  │  └─ CNAME               ← 域名确认后才加
│  └─ <7 个栏目>/*.md        内容
├─ .github/
│  ├─ workflows/deploy.yml   PR 构建检查 + main 自动部署
│  ├─ CODEOWNERS             PR 自动指派（默认注释，需手动启用）
│  └─ PULL_REQUEST_TEMPLATE.md
├─ README.md                 上线与运维手册（站长看）
└─ PROGRESS.md               本文档（进度与复盘）
```

**当前规模**：50 个跟踪文件、30 个 Markdown、约 1000 行代码、构建出 32 个页面。

---

## 九、常用命令

```bash
npm install        # 首次
npm run dev        # 本地开发，http://localhost:5173，改完自动刷新
npm run build      # 构建到 docs/.vitepress/dist
npm run preview    # 预览构建产物（支持 cleanUrls，别用 python -m http.server）
```

Windows 下也可直接双击 `preview.bat`。

---

## 十、提交历史

| 提交 | 时间 | 说明 |
| --- | --- | --- |
| `1cd4709` | 10-24 19:01 | 初始化：站点 + 后台 + 自动部署（49 文件） |
| `8a81f04` | 10-24 19:02 | 统一换行符，保证 .bat 可双击 |
| `5ec074a` | 10-24 19:39 | 补充 Pages 未启用的排查说明 |
| `72ac453` | 10-24 19:51 | 修正首页标题重复、推荐位排序 |
| `968de63` | 10-24 20:08 | 支持自定义域名，sitemap 与路径自动适配 |

---

## 十一、给未来接手的人

- **别删 `.github` 和 `.vitepress` 这两个隐藏目录**，网页拖拽上传时最容易漏，漏了站点直接打不开。
- **改了 `config.yml` 一定记得改 `repo`**，否则后台登录后会提示仓库不存在。
- **令牌等于仓库钥匙**：设 90 天有效期，有人退出团队立刻作废。
- localStorage 里的令牌会一直有效，公共电脑上用完记得退出。
- 内容最大的风险不是没人写，而是**没人维护导致信息过期**。页面上的黄条就是在提醒这件事，看到就去核实一下。
- 站长毕业前一定要**转移仓库所有权或指定共同维护者**，否则站会烂掉——这是所有校园 Wiki 的共同死法。
