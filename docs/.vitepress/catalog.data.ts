import { createContentLoader } from 'vitepress'

export interface WikiArticle {
  url: string
  title: string
  description: string
  date: string
  reviewedAt: string
  category: string
  tags: string[]
  authors: string[]
}

declare const data: WikiArticle[]
export { data }

const SECTION_INDEX =
  /^\/(走进郧中|校园生活|学习指南|升学之路|社团与活动|常见问题|参与共建)\/$/

function toArray(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === 'string' ? v : (v as { name?: string })?.name))
      .filter(Boolean) as string[]
  }
  if (typeof value === 'string') return [value]
  return []
}

function toDateStr(value: unknown): string {
  if (!value) return ''
  if (value instanceof Date) {
    const p = (n: number) => String(n).padStart(2, '0')
    return `${value.getFullYear()}-${p(value.getMonth() + 1)}-${p(value.getDate())}`
  }
  return String(value).slice(0, 10)
}

function toText(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

export default createContentLoader('**/*.md', {
  transform(raw): WikiArticle[] {
    return raw
      .filter(({ url, frontmatter }) => {
        if (frontmatter.draft === true) return false
        if (url === '/' || url === '/index.html') return false
        if (SECTION_INDEX.test(url)) return false
        if (url.startsWith('/categories')) return false
        if (url.startsWith('/tags')) return false
        return true
      })
      .map(({ url, frontmatter }) => ({
        url,
        title: toText(frontmatter.title) || '未命名',
        description: toText(frontmatter.description),
        date: toDateStr(frontmatter.date),
        reviewedAt: toDateStr(frontmatter.reviewedAt) || toDateStr(frontmatter.date),
        category: toText(frontmatter.category) || '未分类',
        tags: toArray(frontmatter.tags),
        authors: toArray(frontmatter.author),
      }))
      .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN'))
  },
})
