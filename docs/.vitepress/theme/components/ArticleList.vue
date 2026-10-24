<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as articles } from '../../catalog.data'

const props = defineProps<{
  only?: string
  limit?: number
  latest?: number
  exclude?: string[]
}>()

const pool = computed(() =>
  props.exclude?.length
    ? articles.filter((a) => !props.exclude!.includes(a.category))
    : articles,
)

const ORDER = [
  '走进郧中',
  '校园生活',
  '学习指南',
  '升学之路',
  '社团与活动',
  '常见问题',
  '参与共建',
]

function rank(name: string) {
  const i = ORDER.indexOf(name)
  return i < 0 ? 99 : i
}

const groups = computed(() => {
  if (props.latest) return []

  const base = props.only
    ? pool.value.filter((a) => a.category === props.only)
    : pool.value

  const map = new Map<string, typeof articles>()
  for (const a of base) {
    const key = a.category || '未分类'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(a)
  }

  const result = [...map.entries()]
    .sort((x, y) => rank(x[0]) - rank(y[0]))
    .map(([name, items]) => ({
      name,
      items: props.limit ? items.slice(0, props.limit) : items,
      total: items.length,
    }))

  return result
})

const latestItems = computed(() =>
  props.latest ? pool.value.slice(0, props.latest) : [],
)

function fmt(date: string) {
  if (!date) return ''
  return date.slice(0, 10).replace(/-/g, '.')
}
</script>

<template>
  <div class="wiki-catalog">
    <div v-if="latestItems.length" class="wiki-cards">
      <a
        v-for="a in latestItems"
        :key="a.url"
        class="wiki-card"
        :href="withBase(a.url)"
      >
        <div class="wiki-card-title">{{ a.title }}</div>
        <p v-if="a.description" class="wiki-card-desc">{{ a.description }}</p>
        <div class="wiki-card-meta">
          <span v-if="a.category" class="wiki-cat">{{ a.category }}</span>
          <span v-if="a.date" class="wiki-date">{{ fmt(a.date) }}</span>
        </div>
      </a>
    </div>

    <section v-for="g in groups" :key="g.name" class="wiki-group">
      <h2 :id="'cat-' + g.name" class="wiki-group-title">
        {{ g.name }}
        <span class="wiki-count">{{ g.total }}</span>
      </h2>
      <div class="wiki-cards">
        <a
          v-for="a in g.items"
          :key="a.url"
          class="wiki-card"
          :href="withBase(a.url)"
        >
          <div class="wiki-card-title">{{ a.title }}</div>
          <p v-if="a.description" class="wiki-card-desc">{{ a.description }}</p>
          <div class="wiki-card-meta">
            <span v-if="a.date" class="wiki-date">{{ fmt(a.date) }}</span>
            <span v-for="t in a.tags.slice(0, 2)" :key="t" class="wiki-tag">
              {{ t }}
            </span>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.wiki-catalog {
  margin-top: 8px;
  min-width: 0;
}

.wiki-group {
  margin-bottom: 40px;
}

.wiki-group-title {
  font-size: 18px;
  font-weight: 600;
  border-top: none;
  padding-top: 0;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.wiki-count {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-radius: 999px;
  padding: 1px 8px;
}

.wiki-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr));
  gap: 12px;
  min-width: 0;
}

.wiki-card {
  display: block;
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 14px 16px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s, transform 0.2s;
  text-decoration: none !important;
}

.wiki-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.wiki-card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  overflow-wrap: break-word;
}

.wiki-card-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 6px 0 0;
  line-height: 1.6;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.wiki-card-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.wiki-tag {
  background: var(--vp-c-default-soft);
  border-radius: 4px;
  padding: 1px 6px;
}

.wiki-cat {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}
</style>
