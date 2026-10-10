<script setup lang="ts">
import { friendLinks } from '@/data/friends'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const confirmNavigation = (url: string) => {
  if (confirm('确定要跳转到该页面吗？')) {
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="container max-w-3xl py-12 space-y-8">
    <section class="animate-fade-in text-center space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">友情链接</h1>
      <p class="text-muted-foreground">与优秀的朋友们互相连接</p>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in" style="animation-delay: 0.1s">
      <Card
        v-for="link in friendLinks"
        :key="link.name"
        class="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
        @click="confirmNavigation(link.url)"
      >
        <CardContent class="flex flex-col items-center gap-3 p-5 text-center">
          <Avatar class="h-14 w-14">
            <AvatarImage :src="link.avatar" :alt="link.name" />
            <AvatarFallback>{{ link.name[0] }}</AvatarFallback>
          </Avatar>
          <div>
            <h3 class="text-sm font-semibold">{{ link.name }}</h3>
            <p class="mt-1 text-xs text-muted-foreground line-clamp-2">{{ link.description }}</p>
          </div>
        </CardContent>
      </Card>
    </section>

    <Separator />

    <section class="animate-fade-in space-y-4" style="animation-delay: 0.2s">
      <h2 class="text-xl font-semibold tracking-tight">申请友链</h2>
      <p class="text-sm text-muted-foreground">欢迎交换友链，请确保你的站点符合以下要求：</p>
      <ul class="space-y-2 text-sm text-muted-foreground">
        <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-primary" />使用 HTTPS 并配置有效证书</li>
        <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-primary" />非商业性质的个人站点</li>
        <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-primary" />站点信息完整（图标、标题、域名）</li>
        <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-primary" />内容健康，设计美观</li>
        <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-primary" />能够稳定访问</li>
      </ul>

      <p class="text-sm text-muted-foreground pt-2">请先将本站添加到你的友链列表：</p>
      <Card>
        <CardContent class="p-4 space-y-1 text-sm">
          <p><span class="font-medium">名称：</span>北尘的小窝</p>
          <p><span class="font-medium">链接：</span><a href="https://www.beichen.icu" target="_blank" class="text-primary underline underline-offset-4">www.beichen.icu</a></p>
          <p><span class="font-medium">图标：</span><a href="https://www.beichen.icu/images/Favicon.webp" target="_blank" class="text-primary underline underline-offset-4">Favicon.webp</a></p>
          <p><span class="font-medium">简介：</span>梦想即是远航！Dream is the voyage!</p>
        </CardContent>
      </Card>
      <p class="text-sm text-muted-foreground">添加完成后，请<router-link to="/socials" class="text-primary underline underline-offset-4">联系我</router-link>进行友链交换。</p>
    </section>
  </div>
</template>
