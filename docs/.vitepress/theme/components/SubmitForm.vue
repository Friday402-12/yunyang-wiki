<script setup lang="ts">
import { computed, ref } from 'vue'
import { SECTIONS } from '../../sections.ts'

const CATEGORIES = SECTIONS.map((s) => s.dir)

const title = ref('')
const category = ref(CATEGORIES[0])
const tags = ref('')
const author = ref('')
const description = ref('')
const body = ref('')
const copied = ref(false)

function today() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const slug = computed(() => {
  const t = title.value.trim()
  return t ? t.replace(/[\\/:*?"<>|\s]+/g, '-').slice(0, 40) : '未命名'
})

const tagList = computed(() =>
  tags.value
    .split(/[,，、\s]+/)
    .map((t) => t.trim())
    .filter(Boolean),
)

const output = computed(() => {
  const lines = [
    '---',
    `title: ${title.value.trim() || '（请填写标题）'}`,
    `order: 99`,
    `date: ${today()}`,
    `reviewedAt: ${today()}`,
    `category: ${category.value}`,
    `author:`,
    `  - name: ${author.value.trim() || '匿名同学'}`,
  ]
  if (description.value.trim()) {
    lines.push(`description: ${description.value.trim()}`)
  }
  if (tagList.value.length) {
    lines.push('tags:')
    for (const t of tagList.value) lines.push(`  - ${t}`)
  }
  lines.push('---', '', body.value.trim() || '（在这里写正文）', '')
  return lines.join('\n')
})

async function copyAll() {
  try {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    copied.value = false
  }
}

function download() {
  const blob = new Blob([output.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slug.value}.md`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="sf">
    <div class="sf-note">
      在这个页面把内容填好，下方会自动生成规范格式的文件。点「下载」拿到
      <code>.md</code> 文件，连同图片一起发给 Wiki 小组即可，你不需要会任何技术。
    </div>

    <div class="sf-grid">
      <label class="sf-field sf-full">
        <span>标题 <em>必填</em></span>
        <input v-model="title" type="text" placeholder="例如：教学楼各层教室分布" />
      </label>

      <label class="sf-field">
        <span>分类 <em>必填</em></span>
        <select v-model="category">
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>

      <label class="sf-field">
        <span>你的署名</span>
        <input v-model="author" type="text" placeholder="真名、昵称或「2024级某同学」" />
      </label>

      <label class="sf-field sf-full">
        <span>一句话摘要 <em>会显示在卡片上</em></span>
        <input
          v-model="description"
          type="text"
          placeholder="例如：从高一到高三，每层楼有哪些教室、办公室和卫生间"
        />
      </label>

      <label class="sf-field sf-full">
        <span>标签 <em>用逗号分隔，最多 3 个</em></span>
        <input v-model="tags" type="text" placeholder="新生, 教室, 地图" />
      </label>

      <label class="sf-field sf-full">
        <span>正文 <em>支持 Markdown，也可以直接写大白话</em></span>
        <textarea
          v-model="body"
          rows="12"
          placeholder="把你知道的写清楚就行。小标题用 ## 开头，列表用 - 开头。"
        ></textarea>
      </label>
    </div>

    <div class="sf-actions">
      <button class="sf-btn sf-primary" type="button" @click="copyAll">
        {{ copied ? '已复制 ✓' : '复制全文' }}
      </button>
      <button class="sf-btn" type="button" @click="download">下载 .md 文件</button>
      <span class="sf-file">建议文件名：{{ slug }}.md</span>
    </div>

    <details class="sf-preview">
      <summary>看看生成的文件长什么样</summary>
      <pre>{{ output }}</pre>
    </details>
  </div>
</template>

<style scoped>
.sf-note {
  border-left: 3px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  border-radius: 0 8px 8px 0;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 24px;
}

.sf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.sf-full {
  grid-column: 1 / -1;
}

.sf-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sf-field > span {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.sf-field em {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-left: 4px;
}

.sf-field input,
.sf-field select,
.sf-field textarea {
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 9px 12px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.sf-field input:focus,
.sf-field select:focus,
.sf-field textarea:focus {
  border-color: var(--vp-c-brand-1);
}

.sf-field textarea {
  resize: vertical;
  line-height: 1.7;
}

.sf-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.sf-btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.sf-btn:hover {
  border-color: var(--vp-c-brand-1);
}

.sf-primary {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

.sf-primary:hover {
  background: var(--vp-c-brand-2);
}

.sf-file {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.sf-preview {
  margin-top: 20px;
  font-size: 13px;
}

.sf-preview summary {
  cursor: pointer;
  color: var(--vp-c-text-2);
  padding: 6px 0;
}

.sf-preview pre {
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
  padding: 14px;
  overflow-x: auto;
  font-size: 12.5px;
  line-height: 1.65;
}

@media (max-width: 640px) {
  .sf-grid {
    grid-template-columns: 1fr;
  }
}
</style>
