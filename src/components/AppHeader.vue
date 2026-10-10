<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Home, Globe, Link, Users, Heart, FolderGit2, Activity } from 'lucide-vue-next'

const route = useRoute()
const { theme, toggleTheme } = useTheme()

const navItems = [
  { label: '首页', icon: Home, to: '/' },
  { label: '博客', icon: Globe, href: 'https://blog.beichen.icu/' },
  { label: '友链', icon: Link, to: '/links' },
  { label: '社交平台', icon: Users, to: '/socials' },
  { label: '打赏', icon: Heart, to: '/donate' },
  { label: '项目', icon: FolderGit2, to: '/projects' },
  { label: '监测站', icon: Activity, href: 'https://status.beichen.icu' }
]
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-14 items-center justify-between">
      <router-link to="/" class="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
        北尘的主页🏠
      </router-link>

      <nav class="flex items-center gap-1 overflow-x-auto scrollbar-none">
        <template v-for="item in navItems" :key="item.label">
          <a
            v-if="item.href"
            :href="item.href"
            target="_blank"
            class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <component :is="item.icon" class="h-3.5 w-3.5 hidden sm:block" />
            {{ item.label }}
          </a>
          <router-link
            v-else
            :to="item.to!"
            class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            :class="route.path === item.to
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
          >
            <component :is="item.icon" class="h-3.5 w-3.5 hidden sm:block" />
            {{ item.label }}
          </router-link>
        </template>

        <Button variant="ghost" size="icon" class="ml-1 h-8 w-8" @click="toggleTheme">
          <Sun v-if="theme === 'dark'" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </Button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.scrollbar-none {
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
