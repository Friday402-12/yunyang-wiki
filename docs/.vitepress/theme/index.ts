import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ArticleList from './components/ArticleList.vue'
import ArticleFooter from './components/ArticleFooter.vue'
import SubmitForm from './components/SubmitForm.vue'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-footer-before': () => h(ArticleFooter),
    })
  },
  enhanceApp({ app }) {
    app.component('ArticleList', ArticleList)
    app.component('SubmitForm', SubmitForm)
  },
} satisfies Theme
