<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import { TooltipProvider } from '@/components/ui/tooltip'
import { introActive } from '@/composables/useIntro'
</script>

<template>
  <TooltipProvider>
    <div class="flex min-h-screen flex-col">
      <AppHeader />
      <main class="flex-1">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <Transition name="rise">
        <AppFooter v-show="!introActive" />
      </Transition>
      <Transition name="rise">
        <MusicPlayer v-show="!introActive" />
      </Transition>
    </div>
  </TooltipProvider>
</template>

<style>
.page-enter-active {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.page-leave-active {
  transition:
    opacity 0.18s ease-in,
    transform 0.18s ease-in;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.rise-enter-active {
  transition:
    opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.rise-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
</style>
