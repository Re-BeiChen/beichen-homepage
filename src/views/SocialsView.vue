<script setup lang="ts">
import { socialLinks } from '@/data/socials'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, MessageCircle, MessageSquare, Send, Music, Tv } from 'lucide-vue-next'

const iconMap: Record<string, any> = {
  'mail': Mail,
  'message-circle': MessageCircle,
  'message-square': MessageSquare,
  'send': Send,
  'music': Music,
  'tv': Tv
}
</script>

<template>
  <div class="container max-w-2xl py-12 space-y-8">
    <section class="animate-fade-in text-center space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">我的社交平台</h1>
      <p class="text-muted-foreground">在这些地方找到我</p>
    </section>

    <section class="space-y-3 animate-fade-in" style="animation-delay: 0.1s">
      <Card
        v-for="(item, index) in socialLinks"
        :key="index"
        class="transition-all hover:shadow-sm hover:-translate-y-0.5 animate-slide-in-right"
        :style="{ animationDelay: (index * 0.08) + 's' }"
      >
        <CardContent class="flex items-center gap-4 p-4">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <component :is="iconMap[item.icon]" class="h-4.5 w-4.5" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium">{{ item.label }}</p>
            <a
              :href="item.url"
              :target="item.external ? '_blank' : undefined"
              class="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
            >
              {{ item.text }}
            </a>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
