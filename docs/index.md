---
layout: home

hero:
  name: 郧中 Wiki
  text: 在郧中，少走弯路
  tagline: 十堰市郧阳中学学生共建的校园知识库。把散落在群聊里的经验，整理成下一位同学用得上的指南。
  actions:
    - theme: brand
      text: 新生从这里开始
      link: /走进郧中/
    - theme: alt
      text: 浏览全部文章
      link: /categories/

features:
  - title: 走进郧中
    details: 从报到第一天到熟悉校园。校史、报到流程、部门电话，一次说清。
    link: /走进郧中/
    linkText: 开始了解
  - title: 校园生活
    details: 食堂怎么吃、宿舍怎么住、作息怎么排。过日子的事，都在这里。
    link: /校园生活/
    linkText: 看看日常
  - title: 学习指南
    details: 分班、月考、选科、竞赛。三年里最关键的那些岔路口。
    link: /学习指南/
    linkText: 了解学习
  - title: 升学之路
    details: 高考基本盘、强基计划、志愿填报。把复杂的规则讲成人话。
    link: /升学之路/
    linkText: 规划升学
  - title: 社团与活动
    details: 有哪些社团、什么时候招新、校园活动怎么参加。
    link: /社团与活动/
    linkText: 找组织
  - title: 参与共建
    details: 你的一句话，可能帮到素未谋面的学弟学妹。不会技术也能贡献。
    link: /参与共建/
    linkText: 我要投稿
---

<div class="home-wrap">

## 最新收录

<ArticleList :latest="4" />

<div class="home-more">

[查看全部文章 →](/categories/)

</div>

</div>

<style>
.home-wrap {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 64px;
}

.home-wrap h2 {
  font-size: 20px;
  font-weight: 600;
  border-top: none;
  margin-top: 8px;
  padding-top: 0;
}

.home-more {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
}
</style>
