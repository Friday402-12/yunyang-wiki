/**
 * 全站唯一一份栏目清单。
 *
 * 顶部导航、侧边栏、分类聚合、投稿表单、Issue 反馈链接都从这里读，
 * 新增或调整栏目只需要改这个文件（以前要同时改 5 个地方，漏一个就静默出错）。
 *
 * ⚠️ 这个文件同时被 Node（构建配置）和浏览器（Vue 组件）引用，
 *    所以只能写纯常量，不要在这里 import node:fs 或读取 process.env。
 */

export interface Section {
  /** 目录名，同时也是 URL 路径，例如 校园生活 */
  dir: string
  /** 导航里显示的文案 */
  text: string
  /** 一句话定位，用于分类页标题与投稿表单提示 */
  hint: string
}

export const SECTIONS: Section[] = [
  { dir: '走进郧中', text: '走进郧中', hint: '报到、校史、校园布局、部门与联系方式' },
  { dir: '校园生活', text: '校园生活', hint: '食堂、宿舍、作息、交通、校园卡' },
  { dir: '学习指南', text: '学习指南', hint: '分班、月考、选科、竞赛、学习方法' },
  { dir: '升学之路', text: '升学之路', hint: '高考基本盘、强基计划、志愿填报' },
  { dir: '社团与活动', text: '社团与活动', hint: '社团招新、活动日历、怎么选' },
  { dir: '常见问题', text: '常见问题', hint: '新生三十问，以及高频疑问' },
  { dir: '参与共建', text: '参与共建', hint: '投稿方式、编辑守则与权限说明' },
]

/** 栏目目录名列表，顺序即展示顺序 */
export const SECTION_DIRS: string[] = SECTIONS.map((s) => s.dir)

/** 侧边栏 / 卡片分组的排序顺序 */
export const SECTION_ORDER: string[] = SECTION_DIRS

/** 按目录名取栏目信息 */
export function getSection(dir: string): Section | undefined {
  return SECTIONS.find((s) => s.dir === dir)
}

/**
 * 仓库地址：用于「帮我们改一改」「这条信息有误」这类直达链接。
 * 换仓库或换学校时改这一行即可。
 */
export const REPO_SLUG = 'friday402-12/yunyang-wiki'
export const REPO_URL = `https://github.com/${REPO_SLUG}`
export const ISSUE_TEMPLATE = 'content-issue.yml'
export const ISSUE_NEW_URL = `${REPO_URL}/issues/new?template=${ISSUE_TEMPLATE}`
