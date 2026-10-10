<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
</script>

<template>
  <footer class="w-full border-t bg-background">
    <div class="container flex flex-col items-center gap-2 py-8 text-center">
      <p class="text-sm text-muted-foreground">
        © 2023 - Now
        <a href="/" class="font-medium text-foreground hover:underline">北尘</a>
        · 保留所有权利
      </p>
      <p class="text-xs text-muted-foreground">
        <a href="https://icp.gov.moe/?keyword=20243001" class="hover:text-foreground transition-colors">萌ICP备20243001号</a>
        ·
        <a href="https://beian.miit.gov.cn/" target="_blank" class="hover:text-foreground transition-colors">苏ICP备2025206224号-2</a>
      </p>
      <p class="text-xs text-muted-foreground">Built with Vue 3 + Vite + shadcn-vue</p>
    </div>
  </footer>
</template>
