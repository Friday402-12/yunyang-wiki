import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type DefaultTheme, type HeadConfig, type SiteConfig } from 'vitepress'
import { SECTIONS, REPO_SLUG, REPO_URL } from './sections.ts'

const docsRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))

/**
 * 本机没有 git（例如只用 GitHub Desktop 的同学）时，lastUpdated 会让构建直接崩：
 *   build error: spawn git ENOENT
 * 这里先探测一次，没有 git 就关掉「最后更新时间」，本地照样能 build / preview。
 * CI 上有 git，线上仍然显示更新时间。
 */
const HAS_GIT = (() => {
  try {
    return spawnSync('git', ['--version'], { stdio: 'ignore' }).status === 0
  } catch {
    return false
  }
})()

/**
 * 部署路径自动判断，正常情况下你不需要改这里：
 * - 仓库里有 docs/public/CNAME（即绑定了自己的域名）→ 用根路径 '/'
 * - 部署到 xxx.github.io/仓库名 → 自动加上 '/仓库名/'
 * - 本地开发 → '/'
 */
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0]
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]

/** 读 docs/public/CNAME：一旦绑定了自定义域名，站点就走根路径、sitemap 也用这个域名 */
function readCname(): string {
  try {
    const p = join(docsRoot, 'public', 'CNAME')
    if (existsSync(p)) return readFileSync(p, 'utf-8').trim()
  } catch {}
  return ''
}

const CNAME = readCname()
const hasCname = CNAME !== ''

const BASE =
  process.env.VITEPRESS_BASE ??
  (process.env.GITHUB_ACTIONS &&
  repoName &&
  !repoName.endsWith('.github.io') &&
  !hasCname
    ? `/${repoName}/`
    : '/')

/**
 * 站点地址，优先级：
 * 1. 环境变量 SITE_URL（手动指定，最优先）
 * 2. docs/public/CNAME 里的自定义域名
 * 3. GitHub 仓库推导出的 https://用户名.github.io
 * 4. 本地开发 http://localhost:5173
 *
 * ⚠️ ORIGIN 只到域名（不含仓库名），仓库名由 BASE 负责拼，
 *    避免出现 /yunyang-wiki/yunyang-wiki/ 这种双前缀。
 *    SITE 一定以 / 结尾，可以直接拼 sitemap.xml、og.png。
 */
const ORIGIN = (
  process.env.SITE_URL ??
  (hasCname
    ? `https://${CNAME}`
    : owner
      ? `https://${owner}.github.io`
      : 'http://localhost:5173')
).replace(/\/+$/, '')

const SITE = `${ORIGIN}${BASE}`
const IS_LOCAL = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(ORIGIN)

/** 把站内绝对路径补上 base；head 里的 icon / 图片必须用它，否则子路径部署会 404 */
const withBase = (p: string) => `${BASE}${p.replace(/^\/+/, '')}`

/** 用于页面底部「帮我们改一改」的编辑链接 */
const REPO_SLUG_ENV = process.env.GITHUB_REPOSITORY ?? REPO_SLUG

function readMeta(file: string, fallback: string) {
  const meta = { title: fallback, order: 999 }
  try {
    const raw = readFileSync(file, 'utf-8')
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!fm) return meta
    const block = fm[1]
    const t = block.match(/^title:\s*(.+)$/m)
    if (t) meta.title = t[1].trim().replace(/^['"]|['"]$/g, '')
    const o = block.match(/^order:\s*(\d+)$/m)
    if (o) meta.order = Number(o[1])
  } catch {}
  return meta
}

function buildSidebar(): DefaultTheme.Sidebar {
  const map: Record<string, DefaultTheme.SidebarItem[]> = {}

  for (const section of SECTIONS) {
    const abs = join(docsRoot, section.dir)
    if (!existsSync(abs)) continue

    const items: DefaultTheme.SidebarItem[] = [
      { text: `${section.text} · 全部`, link: `/${section.dir}/` },
    ]

    const entries = readdirSync(abs)
      .filter((f) => f.endsWith('.md') && f !== 'index.md')
      .map((file) => {
        const slug = file.replace(/\.md$/, '')
        return { slug, ...readMeta(join(abs, file), slug) }
      })
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh-CN'))

    for (const e of entries) {
      items.push({ text: e.title, link: `/${section.dir}/${e.slug}` })
    }

    map[`/${section.dir}/`] = items
  }

  return map
}

/**
 * 中文分词：MiniSearch 默认只按空白和标点切词，
 * 「食堂怎么吃」会变成一个整 token，搜「怎么吃」永远搜不到。
 * 这里把连续中文切成二元组（食堂 / 堂怎 / 怎么 / 么吃），单字保留。
 */
function cjkTokenize(text: string): string[] {
  const out: string[] = []
  for (const seg of String(text).split(/([\u4e00-\u9fff]+)/)) {
    if (!seg) continue
    if (/^[\u4e00-\u9fff]+$/.test(seg)) {
      if (seg.length === 1) {
        out.push(seg)
        continue
      }
      for (let i = 0; i < seg.length - 1; i++) out.push(seg.slice(i, i + 2))
    } else {
      for (const t of seg.split(/[\s\p{P}\p{Z}]+/u)) if (t) out.push(t.toLowerCase())
    }
  }
  return out
}

/**
 * 后台 config.yml 里的 site_url / logo_url 必须和实际部署地址一致，
 * 否则 Sveltia 的 OAuth 回跳与 logo 都会指向不存在的域名。
 * 以前靠人肉维护，换域名必翻车；现在构建结束时自动改写。
 */
function patchAdminConfig(outDir: string) {
  const file = join(outDir, 'admin', 'config.yml')
  if (!existsSync(file)) return
  const displayUrl = SITE.replace(/^https?:\/\//, '').replace(/\/+$/, '')
  const next = readFileSync(file, 'utf-8')
    .replace(/^site_url:.*$/m, `site_url: ${SITE}`)
    .replace(/^display_url:.*$/m, `display_url: ${displayUrl}`)
    .replace(/^logo_url:.*$/m, `logo_url: ${SITE}logo.svg`)
  writeFileSync(file, next, 'utf-8')
}

export default defineConfig({
  base: BASE,
  lang: 'zh-CN',
  title: '郧中 Wiki',
  titleTemplate: ':title · 郧中 Wiki',
  description:
    '十堰市郧阳中学学生共建的校园知识库。把散落在群聊里的经验，整理成下一位同学用得上的指南。',
  cleanUrls: true,
  lastUpdated: HAS_GIT,
  srcExclude: ['**/README.md'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: withBase('logo.svg') }],
    ['link', { rel: 'apple-touch-icon', href: withBase('logo.svg') }],
    ['meta', { name: 'theme-color', content: '#8C1F28' }],
    ['meta', { name: 'author', content: '郧中 Wiki 共建小组' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '郧中 Wiki' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:image', content: `${SITE}og.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
  ],

  // 本地构建不生成带 localhost 的 sitemap
  sitemap: IS_LOCAL ? false : { hostname: SITE },

  markdown: {
    image: { lazyLoading: true },
  },

  /** 每页补 canonical 与 og 信息，分享到微信群/QQ 时才有标题和摘要 */
  transformHead({ pageData, title, description }) {
    const rel = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '')
    if (rel === '404') return []

    const canonical = encodeURI(`${SITE}${rel}`)
    const tags: HeadConfig[] = [
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:title', content: title }],
    ]
    if (description) {
      tags.push(['meta', { property: 'og:description', content: description }])
    }
    return tags
  },

  /** 构建结束后生成 robots.txt，并把后台配置里的地址对齐到真实域名 */
  buildEnd(siteConfig: SiteConfig) {
    const robots = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin/',
      '',
      `Sitemap: ${SITE}sitemap.xml`,
      '',
    ].join('\n')
    writeFileSync(join(siteConfig.outDir, 'robots.txt'), robots, 'utf-8')
    patchAdminConfig(siteConfig.outDir)
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '郧中 Wiki',

    nav: [
      { text: '全部文章', link: '/categories/' },
      ...SECTIONS.filter((s) => s.dir !== '参与共建').map((s) => ({
        text: s.text,
        link: `/${s.dir}/`,
      })),
      {
        text: '参与共建',
        items: [
          { text: '为什么需要你', link: '/参与共建/' },
          { text: '投稿指南', link: '/参与共建/投稿指南' },
          { text: '在线投稿工具', link: '/参与共建/投稿工具' },
          { text: '编辑团队与权限', link: '/参与共建/编辑团队' },
          { text: '内容后台（编辑用）', link: '/admin/', target: '_blank' },
        ],
      },
    ],

    sidebar: buildSidebar(),

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: cjkTokenize,
          },
        },
        translations: {
          button: { buttonText: '搜索文章', buttonAriaLabel: '搜索文章' },
          modal: {
            noResultsText: '没有找到相关内容，换个说法试试',
            resetButtonTitle: '清空',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新', formatOptions: { dateStyle: 'medium' } },

    editLink: {
      pattern: `https://github.com/${REPO_SLUG_ENV}/edit/main/docs/:path`,
      text: '发现错误？帮我们改一改',
    },

    footer: {
      message:
        `本站由郧中校友与学生自发维护，<strong>与学校官方无关</strong>，内容仅供参考，请以学校正式通知为准。` +
        `<br/>除特别注明外，内容采用 CC BY-NC-SA 4.0 协议共享。` +
        `<br/><a href="${REPO_URL}/issues/new?template=content-issue.yml" target="_blank" rel="noopener">发现错误、信息过时，或有想补充的 → 点这里告诉我们</a>`,
      copyright: 'Built with care by 郧中人',
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '外观',
  },
})
