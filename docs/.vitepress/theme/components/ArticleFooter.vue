<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const authors = computed<string[]>(() => {
  const raw = frontmatter.value.author
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw.map((a: any) => (typeof a === 'string' ? a : a?.name)).filter(Boolean)
  }
  return typeof raw === 'string' ? [raw] : []
})

const reviewedAt = computed(() => {
  const d = frontmatter.value.reviewedAt || frontmatter.value.date
  if (!d) return ''
  if (d instanceof Date) {
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
  }
  return String(d).slice(0, 10)
})

const staleDays = computed(() => {
  if (!reviewedAt.value) return 0
  const t = new Date(reviewedAt.value + 'T00:00:00').getTime()
  if (Number.isNaN(t)) return 0
  return Math.floor((Date.now() - t) / 86400000)
})

const isStale = computed(() => staleDays.value > 365)
const isUnverified = computed(() => frontmatter.value.needsReview === true)

const show = computed(
  () =>
    authors.value.length > 0 ||
    isStale.value ||
    isUnverified.value ||
    Boolean(frontmatter.value.tags),
)

const tags = computed<string[]>(() => {
  const raw = frontmatter.value.tags
  if (!raw) return []
  return Array.isArray(raw) ? raw : [String(raw)]
})
</script>

<template>
  <div v-if="show" class="wiki-article-footer">
    <div v-if="isUnverified" class="wiki-banner wiki-banner-warn">
      <strong>这条内容还没有人核实过。</strong>
      如果你了解真实情况，欢迎在页面上方找到「帮我们改一改」，或到「参与共建」了解投稿方式。
    </div>

    <div v-else-if="isStale" class="wiki-banner wiki-banner-warn">
      <strong>这条内容已经 {{ staleDays }} 天没有更新。</strong>
      食堂、电话、作息、政策这类信息变化很快，请以学校最新通知为准。
    </div>

    <div class="wiki-footer-row">
      <div v-if="authors.length" class="wiki-authors">
        <span class="wiki-label">本文作者</span>
        <span v-for="a in authors" :key="a" class="wiki-author">{{ a }}</span>
      </div>
      <div v-if="reviewedAt" class="wiki-reviewed">
        <span class="wiki-label">最后核实</span>
        <span>{{ reviewedAt }}</span>
      </div>
    </div>

    <div v-if="tags.length" class="wiki-tags">
      <span v-for="t in tags" :key="t" class="wiki-tag"># {{ t }}</span>
    </div>
  </div>
</template>

<style scoped>
.wiki-article-footer {
  margin: 40px 0 0;
  padding-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 13px;
}

.wiki-banner {
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 18px;
  line-height: 1.7;
}

.wiki-banner-warn {
  background: var(--vp-c-warning-soft);
  border-left: 3px solid var(--vp-c-warning-1);
  color: var(--vp-c-text-1);
}

.wiki-footer-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  color: var(--vp-c-text-2);
}

.wiki-authors,
.wiki-reviewed {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wiki-label {
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.wiki-author {
  background: var(--vp-c-default-soft);
  border-radius: 4px;
  padding: 1px 8px;
}

.wiki-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.wiki-tag {
  color: var(--vp-c-brand-1);
  font-size: 12px;
}
</style>
