<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'

const donateMethods = [
  { src: '/images/QQpay.png', label: 'QQ支付' },
  { src: '/images/ZFB.jpg', label: '支付宝' },
  { src: '/images/VX.png', label: '微信支付' }
]
</script>

<template>
  <div class="container max-w-2xl py-12 space-y-8">
    <section class="animate-fade-in text-center space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">支持我</h1>
      <p class="text-muted-foreground">如果你喜欢我的内容，可以请我喝杯咖啡</p>
    </section>

    <section class="flex flex-wrap justify-center gap-6 animate-fade-in" style="animation-delay: 0.1s">
      <a
        v-for="method in donateMethods"
        :key="method.label"
        :href="method.src"
        target="_blank"
      >
        <Card class="transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden">
          <CardContent class="p-3">
            <img :src="method.src" :alt="method.label" class="h-56 w-56 object-cover rounded-md" />
            <p class="mt-3 text-center text-sm font-medium">{{ method.label }}</p>
          </CardContent>
        </Card>
      </a>
    </section>
  </div>
</template>
