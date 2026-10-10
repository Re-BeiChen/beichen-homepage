<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useIntro } from '@/composables/useIntro'

const { finishIntro } = useIntro()

const introVisible = ref(false)
const introLifted = ref(false)
const introDone = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    introVisible.value = true
  })
  setTimeout(() => {
    introLifted.value = true
  }, 800)
  setTimeout(() => {
    introDone.value = true
    finishIntro()
  }, 1500)
})
</script>

<template>
  <div class="container max-w-2xl py-12 space-y-10">
    <section
      class="space-y-2 origin-left"
      :style="{
        transform: introLifted ? 'none' : 'translateY(calc(50vh - 120px)) scale(1.6)',
        opacity: introVisible ? 1 : 0,
        transition: 'transform 1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
      }"
    >
      <h1 class="text-3xl font-bold tracking-tight">你好，我是北尘</h1>
      <p class="text-muted-foreground">一个热爱创造的高中生</p>
      <p class="text-sm italic text-muted-foreground/80 pt-1">Dream is the voyage!</p>
    </section>

    <template v-if="introDone">
      <Separator class="animate-fade-in" />

      <section class="space-y-4 animate-fade-in" style="animation-delay: 0.1s">
        <h2 class="text-xl font-semibold tracking-tight">关于</h2>
        <div class="space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p>17 岁 / 高中生 / 江苏 · 南京</p>
          <p>性格老实，好相处，欢迎交友。</p>
          <p>名字来源？记不太清了，我就这一个网名，或许你就在那个莫名其妙的网站看到我了呢（❌）</p>
          <p>大概是 24 年 1 月份几个朋友开始玩开发了我也就跟风 develop 了（❌），不过很菜，当时就是想搞搞博客啥的，所以没咋认真学。</p>
          <p>目前随自己抽奖箱般的大脑时不时蹦出来一个想法然后做到一半开启咕咕咕（❌）</p>
        </div>
        <div class="flex flex-wrap gap-2 pt-1">
          <Badge variant="secondary">Web 开发</Badge>
          <Badge variant="secondary">Minecraft</Badge>
          <Badge variant="secondary">服务器运维</Badge>
          <Badge variant="secondary">Vue.js</Badge>
        </div>
      </section>

      <Separator class="animate-fade-in" style="animation-delay: 0.2s" />

      <section class="space-y-4 animate-fade-in" style="animation-delay: 0.2s">
        <h2 class="text-xl font-semibold tracking-tight">涉猎</h2>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li class="flex items-start gap-2">
            <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span><span class="text-foreground">Minecraft</span>：就是通过 MC 才认识的朋友</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span><span class="text-foreground">绘画</span>：一点，就一点，素描倒是画过不过也好久没画了</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span><span class="text-foreground">瓦、三角洲、王者</span>：最近在打的，很菜 🤗</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span><span class="text-foreground">记录生活</span>：<span class="line-through">堕落中</span></span>
          </li>
        </ul>
      </section>

      <Separator class="animate-fade-in" style="animation-delay: 0.3s" />

      <section class="space-y-4 animate-fade-in" style="animation-delay: 0.3s">
        <h2 class="text-xl font-semibold tracking-tight">正在使用的项目</h2>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-primary" />
            <a href="https://www.openfrp.net/" target="_blank" class="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity">OpenFRP</a>
            内网穿透解决方案
          </li>
          <li class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-primary" />
            PCL2 Minecraft 启动器
          </li>
          <li class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-primary" />
            HTML / CSS / JavaScript
          </li>
          <li class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-primary" />
            Vue.js / Vite
          </li>
        </ul>
      </section>

      <Separator class="animate-fade-in" style="animation-delay: 0.4s" />

      <section class="space-y-4 animate-fade-in" style="animation-delay: 0.5s">
        <h2 class="text-xl font-semibold tracking-tight">致谢</h2>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-primary" />
            GitHub 代码托管
          </li>
          <li class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-primary" />
            Cloudflare CDN 加速
          </li>
          <li class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-primary" />
            所有支持我的朋友们
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>
