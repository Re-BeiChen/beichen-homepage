<script setup lang="ts">
import { X, Play } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import type { Song } from '@/composables/useAudioPlayer'

defineProps<{
  playlist: Song[]
  currentIndex: number
}>()

const emit = defineEmits<{
  select: [index: number]
  close: []
}>()
</script>

<template>
  <div class="absolute bottom-16 left-0 w-72 rounded-xl border bg-popover shadow-xl overflow-hidden origin-bottom-left" @wheel.stop>
    <div class="flex items-center justify-between border-b px-4 py-3">
      <span class="text-sm font-semibold">Playlist ({{ playlist.length }})</span>
      <Button variant="ghost" size="icon" class="h-6 w-6" @click="emit('close')">
        <X class="h-3.5 w-3.5" />
      </Button>
    </div>
    <div class="playlist-scroll max-h-80 overflow-y-auto overscroll-contain">
      <ul>
        <li
          v-for="(song, index) in playlist"
          :key="index"
          class="flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-accent"
          :class="{ 'bg-accent': index === currentIndex }"
          @click="emit('select', index)"
        >
          <span class="w-5 text-center text-xs text-muted-foreground">
            <Play v-if="index === currentIndex" class="inline h-3 w-3 text-primary" />
            <template v-else>{{ index + 1 }}</template>
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-medium" :class="index === currentIndex && 'text-primary'">{{ song.name }}</p>
            <p class="truncate text-[10px] text-muted-foreground">{{ song.artist }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.playlist-scroll {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}
.playlist-scroll::-webkit-scrollbar {
  width: 5px;
}
.playlist-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.playlist-scroll::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 999px;
}
.playlist-scroll::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
