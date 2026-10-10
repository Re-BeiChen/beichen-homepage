<script setup lang="ts">
import { teams, projects } from '@/data/projects'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Github } from 'lucide-vue-next'
</script>

<template>
  <div class="container max-w-2xl py-12 space-y-8">
    <section class="animate-fade-in text-center space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">项目</h1>
      <p class="text-muted-foreground">我参与和创建的作品</p>
    </section>

    <section class="animate-fade-in space-y-4" style="animation-delay: 0.05s">
      <div class="flex items-center gap-2">
        <Github class="h-5 w-5" />
        <h2 class="text-xl font-semibold tracking-tight">GitHub 贡献</h2>
      </div>
      <a href="https://github.com/Re-BeiChen" target="_blank" class="block">
        <Card class="overflow-hidden transition-all hover:shadow-md">
          <CardContent class="p-4">
            <img
              src="https://ghchart.rshah.org/Re-BeiChen"
              alt="GitHub Contribution Calendar"
              class="w-full h-auto rounded-md dark:brightness-[0.85]"
              loading="lazy"
            />
          </CardContent>
        </Card>
      </a>
    </section>

    <Separator />

    <section class="animate-fade-in space-y-4" style="animation-delay: 0.1s">
      <h2 class="text-xl font-semibold tracking-tight">我的团队</h2>
      <p class="text-sm text-muted-foreground">与志同道合的伙伴一起创造</p>
      <div class="space-y-3">
        <a v-for="team in teams" :key="team.name" :href="team.url" target="_blank">
          <Card class="transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent class="flex items-center justify-between p-4">
              <div>
                <p class="text-sm font-semibold">{{ team.name }}</p>
                <p class="text-xs text-muted-foreground mt-0.5">{{ team.description }}</p>
              </div>
              <ExternalLink class="h-4 w-4 shrink-0 text-muted-foreground" />
            </CardContent>
          </Card>
        </a>
      </div>
    </section>

    <Separator />

    <section class="animate-fade-in space-y-4" style="animation-delay: 0.2s">
      <h2 class="text-xl font-semibold tracking-tight">我的项目</h2>
      <p class="text-sm text-muted-foreground">用代码实现想法</p>
      <div class="space-y-3">
        <a v-for="project in projects" :key="project.name" :href="project.url" target="_blank">
          <Card class="transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent class="flex items-center justify-between p-4">
              <div>
                <p class="text-sm font-semibold">{{ project.name }}</p>
                <p class="text-xs text-muted-foreground mt-0.5">{{ project.description }}</p>
              </div>
              <ExternalLink class="h-4 w-4 shrink-0 text-muted-foreground" />
            </CardContent>
          </Card>
        </a>
      </div>
    </section>

    <Separator />

    <p class="text-center text-sm italic text-muted-foreground animate-fade-in" style="animation-delay: 0.3s">
      尽情期待~
    </p>
  </div>
</template>
