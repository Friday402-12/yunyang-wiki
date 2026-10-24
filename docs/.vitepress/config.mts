import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type DefaultTheme } from 'vitepress'

const docsRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))

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
 * 站点地址自动推导，优先级：
 * 1. 环境变量 SITE_URL
 * 2. docs/public/CNAME 里的自定义域名
 * 3. GitHub 仓库推导出的 https://用户名.github.io/仓库名/
 */
const SITE =
  process.env.SITE_URL ??
  (hasCname
    ? `https://${CNAME}`
    : owner && repoName
      ? repoName.endsWith('.github.io')
        ? `https://${owner}.github.io/`
        : `https://${owner}.github.io/${repoName}/`
      : 'https://yunyangwiki.wang')

/** 用于页面底部「帮我们改一改」的编辑链接 */
const REPO_SLUG =
  process.env.GITHUB_REPOSITORY ?? 'friday402-12/yunyang-wiki'

const SECTIONS = [
  { dir: '走进郧中', text: '走进郧中' },
  { dir: '校园生活', text: '校园生活' },
  { dir: '学习指南', text: '学习指南' },
  { dir: '升学之路', text: '升学之路' },
  { dir: '社团与活动', text: '社团与活动' },
  { dir: '常见问题', text: '常见问题' },
  { dir: '参与共建', text: '参与共建' },
]

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

export default defineConfig({
  base: BASE,
  lang: 'zh-CN',
  title: '郧中 Wiki',
  titleTemplate: ':title · 郧中 Wiki',
  description:
    '十堰市郧阳中学学生共建的校园知识库。把散落在群聊里的经验，整理成下一位同学用得上的指南。',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['**/README.md'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#8C1F28' }],
    ['meta', { name: 'author', content: '郧中 Wiki 共建小组' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '郧中 Wiki' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
  ],

  sitemap: { hostname: SITE },

  markdown: {
    image: { lazyLoading: true },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '郧中 Wiki',

    nav: [
      { text: '全部文章', link: '/categories/' },
      { text: '走进郧中', link: '/走进郧中/' },
      { text: '校园生活', link: '/校园生活/' },
      { text: '学习指南', link: '/学习指南/' },
      { text: '升学之路', link: '/升学之路/' },
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
      pattern: `https://github.com/${REPO_SLUG}/edit/main/docs/:path`,
      text: '发现错误？帮我们改一改',
    },

    footer: {
      message:
        '本站由郧中校友与学生自发维护，<strong>与学校官方无关</strong>，内容仅供参考，请以学校正式通知为准。<br/>除特别注明外，内容采用 CC BY-NC-SA 4.0 协议共享。',
      copyright: 'Built with care by 郧中人',
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '外观',
  },
})
