---
layout: home
title: 郧中 Wiki · 郧阳中学校园知识库
titleTemplate: false

hero:
  name: 郧中 Wiki
  text: 在郧中，少走弯路
  tagline: 十堰市郧阳中学学生共建的校园知识库。只写别的学校写不出来的那一部分。
  actions:
    - theme: brand
      text: 先看校史
      link: /走进郧中/
    - theme: alt
      text: 浏览全部文章
      link: /categories/

features:
  - title: 走进郧中
    details: 校史与校训已核对整理。报到流程、部门联系方式正在重新核实。
    link: /走进郧中/
    linkText: 先看校史
  - title: 校园生活
    details: 食堂、宿舍、作息、交通——还在等真正在郧中过日子的人来写。
    link: /校园生活/
    linkText: 正在征集
  - title: 学习指南
    details: 分班、月考、选科、竞赛——等具体到本校节奏的经验。
    link: /学习指南/
    linkText: 正在征集
  - title: 升学之路
    details: 通用规则网上都有，缺的是本校这几年的真实数据。
    link: /升学之路/
    linkText: 正在征集
  - title: 社团与活动
    details: 缺一份真实的社团名单：谁在带、哪天招新、每周占多少时间。
    link: /社团与活动/
    linkText: 正在征集
  - title: 参与共建
    details: 你的一句话，可能帮到素未谋面的学弟学妹。不会技术也能贡献。
    link: /参与共建/
    linkText: 我要投稿
---

<div class="home-wrap">

## 最新收录

<ArticleList :latest="4" :exclude="['参与共建']" />

::: info 为什么只剩这么几篇
之前那批「食堂怎么吃」「错题本怎么用」的文章，因为**放在哪所学校都成立**，已经全部撤下。

现在只保留核对过的内容，其余栏目等真实的校园信息——**宁可少，不要错。**
:::

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
