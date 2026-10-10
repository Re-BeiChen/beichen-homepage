<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  MoreHorizontal, ListMusic, Type
} from 'lucide-vue-next'
import type { Song } from '@/composables/useAudioPlayer'

const props = defineProps<{
  currentSong: Song | null
  isPlaying: boolean
  progress: number
  volume: number
  showLyrics: boolean
}>()

const emit = defineEmits<{
  'toggle-play': []
  'prev': []
  'next': []
  'seek': [e: MouseEvent]
  'volume-change': [v: number]
  'toggle-mute': []
  'toggle-lyrics': []
  'toggle-playlist': []
}>()

const showMore = ref(false)
const showVolume = ref(false)
const moreRef = ref<HTMLElement | null>(null)

const handleClickOutside = (e: Event) => {
  if (showMore.value && moreRef.value && !moreRef.value.contains(e.target as Node)) {
    showMore.value = false
  }
}

onMounted(() => window.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => window.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="flex items-center gap-3 rounded-full border bg-card/95 backdrop-blur px-3 py-2 shadow-lg max-w-[420px]">
    <button class="relative h-10 w-10 shrink-0 cursor-pointer" @click="emit('toggle-play')">
      <img
        v-if="currentSong?.cover"
        :src="currentSong.cover"
        class="h-10 w-10 rounded-full object-cover border animate-spin-slow"
        :style="{ animationPlayState: isPlaying ? 'running' : 'paused' }"
      />
      <div v-else class="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <ListMusic class="h-4 w-4 text-muted-foreground" />
      </div>
    </button>

    <div class="flex flex-1 flex-col gap-1 min-w-0">
      <div class="flex items-center justify-between">
        <div class="min-w-0 mr-2">
          <p class="truncate text-xs font-medium leading-tight">{{ currentSong?.name || 'Loading...' }}</p>
          <p class="truncate text-[10px] text-muted-foreground leading-tight">{{ currentSong?.artist }}</p>
        </div>

        <div class="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" class="h-7 w-7" @click="emit('prev')">
            <SkipBack class="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" class="h-7 w-7" @click="emit('toggle-play')">
            <Pause v-if="isPlaying" class="h-3.5 w-3.5" />
            <Play v-else class="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" class="h-7 w-7" @click="emit('next')">
            <SkipForward class="h-3.5 w-3.5" />
          </Button>

          <div class="relative" @mouseenter="showVolume = true" @mouseleave="showVolume = false">
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 pb-2">
              <Transition name="pop">
                <div v-if="showVolume" class="rounded-lg border bg-popover p-2 shadow-md">
                  <input
                    type="range" min="0" max="1" step="0.01"
                    :value="volume"
                    class="h-24 w-1 cursor-pointer appearance-none bg-muted rounded-full [writing-mode:vertical-lr] [direction:rtl]"
                    @input="emit('volume-change', parseFloat(($event.target as HTMLInputElement).value))"
                  />
                </div>
              </Transition>
            </div>
            <Button variant="ghost" size="icon" class="h-7 w-7" @click="emit('toggle-mute')">
              <Volume2 v-if="volume > 0" class="h-3.5 w-3.5" />
              <VolumeX v-else class="h-3.5 w-3.5" />
            </Button>
          </div>

          <div class="relative" ref="moreRef">
            <Button variant="ghost" size="icon" class="h-7 w-7" :class="showMore ? 'text-primary' : ''" @click="showMore = !showMore">
              <MoreHorizontal class="h-3.5 w-3.5" />
            </Button>
            <Transition name="pop">
              <div
                v-if="showMore"
                class="absolute bottom-full right-0 mb-2 w-40 rounded-lg border bg-popover p-1 shadow-md"
              >
              <button
                class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-accent transition-colors"
                @click="emit('toggle-lyrics'); showMore = false"
              >
                <Type class="h-3 w-3" />
                <span class="flex-1 text-left">桌面歌词</span>
                <span class="relative h-4 w-7 rounded-full transition-colors duration-200" :class="showLyrics ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'">
                  <span class="absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform duration-200 ease-out" :class="showLyrics ? 'translate-x-3' : 'translate-x-0'" />
                </span>
              </button>
              <button
                class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-accent transition-colors"
                @click="emit('toggle-playlist'); showMore = false"
              >
                <ListMusic class="h-3 w-3" />
                <span>播放列表</span>
              </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <div class="h-1 w-full cursor-pointer rounded-full bg-muted" @click="emit('seek', $event)">
        <div class="h-full rounded-full bg-primary transition-[width] duration-[250ms] ease-linear" :style="{ width: progress + '%' }" />
      </div>
    </div>
  </div>
</template>
