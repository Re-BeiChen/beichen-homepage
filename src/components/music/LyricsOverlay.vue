<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useDraggable } from '@/composables/useDraggable'
import type { LyricWord } from '@/composables/useLyrics'

const props = defineProps<{
  currentLyric: string
  nextLyric: string
  currentWords: LyricWord[]
  activeWordIndex: number
  activeWordProgress: number
  settings: { fontSize: number; color: string }
}>()

const emit = defineEmits<{ 'update:settings': [v: { fontSize: number; color: string }] }>()

// 把 #rgb / #rrggbb 转成带透明度的 rgba()，用于未唱部分的颜色
const withAlpha = (color: string, alpha: number): string => {
  const hex = color.replace('#', '')
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
  if (full.length !== 6) return color
  const value = parseInt(full, 16)
  if (Number.isNaN(value)) return color
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`
}

const wordClass = (index: number) => {
  if (index < props.activeWordIndex) return 'is-sung'
  if (index === props.activeWordIndex) return 'is-singing'
  return 'is-idle'
}

// 当前字的填充：已唱部分用本色，剩下的是半透明本色，交界处留一段柔化带，
// 扫过去才是 AMLL 那种过渡而不是一条硬边
const singingStyle = computed(() => {
  const edge = 12
  const stop = props.activeWordProgress * 100
  const dim = withAlpha(props.settings.color, 0.3)
  return {
    backgroundImage: `linear-gradient(90deg, ${props.settings.color} 0% ${Math.max(stop - edge, 0)}%, ${dim} ${Math.min(stop + edge, 100)}% 100%)`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  }
})

// 光晕跟着已唱部分走——drop-shadow 作用在元素最终渲染出的像素上，
// 所以半透明的未唱部分只会留下很淡的一层
const glowStyle = computed(() => ({
  filter: `drop-shadow(0 0 ${Math.round(props.settings.fontSize * 0.28)}px ${withAlpha(props.settings.color, 0.5)})`
}))

const boxRef = ref<HTMLElement | null>(null)

const getBoxSize = () => {
  const rect = boxRef.value?.getBoundingClientRect()
  return rect ? { width: rect.width, height: rect.height } : { width: 100, height: 50 }
}

const { position, initPosition, startDrag, reClamp } = useDraggable(
  'lyrics-position',
  () =>
    window.innerWidth < 768
      ? { x: 20, y: window.innerHeight - 200 }
      : { x: window.innerWidth - 400, y: 80 },
  getBoxSize
)

let boxSizeObserver: ResizeObserver | null = null

const showMenu = ref(false)
const menuPos = ref({ x: 0, y: 0 })

const handleContextMenu = (e: MouseEvent) => {
  e.stopPropagation()
  showMenu.value = true
  let x = e.clientX, y = e.clientY
  if (x + 220 > window.innerWidth) x = window.innerWidth - 230
  if (y + 180 > window.innerHeight) y = window.innerHeight - 190
  menuPos.value = { x, y }
}

const handleClickOutside = (e: Event) => {
  if (showMenu.value && !(e.target as HTMLElement).closest('.lyrics-settings-menu')) {
    showMenu.value = false
  }
}

onMounted(() => {
  initPosition()
  window.addEventListener('click', handleClickOutside)
  // 歌词换行数或字号变化都会改变盒子尺寸，尺寸一变就重新贴边
  if (boxRef.value) {
    boxSizeObserver = new ResizeObserver(reClamp)
    boxSizeObserver.observe(boxRef.value)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
  boxSizeObserver?.disconnect()
})
</script>

<template>
  <div
    ref="boxRef"
    class="fixed z-[9998] w-max max-w-[min(20rem,calc(100vw-2rem))] cursor-grab select-none touch-none rounded-2xl border bg-background/80 px-6 py-3 text-center backdrop-blur-lg shadow-xl active:cursor-grabbing dark:bg-black/50 break-words"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @contextmenu.prevent="handleContextMenu"
  >
    <template v-if="currentLyric || nextLyric">
      <p
        class="font-semibold leading-snug"
        :style="[{ fontSize: settings.fontSize + 'px', color: settings.color }, glowStyle]"
      >
        <template v-if="currentWords.length">
          <span
            v-for="(word, index) in currentWords"
            :key="index"
            class="lyric-word"
            :class="wordClass(index)"
            :style="index === activeWordIndex ? singingStyle : null"
          >{{ word.text }}</span>
        </template>
        <template v-else>{{ currentLyric || '...' }}</template>
      </p>
      <p
        v-if="nextLyric"
        class="mt-1 font-medium opacity-60"
        :style="{ fontSize: settings.fontSize * 0.75 + 'px', color: settings.color }"
      >
        {{ nextLyric }}
      </p>
    </template>
    <p v-else class="text-sm text-muted-foreground">Waiting for lyrics...</p>
  </div>

  <Teleport to="body">
    <div
      v-if="showMenu"
      class="lyrics-settings-menu fixed z-[10000] w-56 rounded-xl border bg-popover p-4 shadow-2xl"
      :style="{ top: menuPos.y + 'px', left: menuPos.x + 'px' }"
      @mousedown.stop
      @click.stop
    >
      <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">歌词设置</p>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium">字号</label>
          <div class="flex items-center gap-2">
            <input
              type="range" min="16" max="64"
              :value="settings.fontSize"
              class="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
              @input="emit('update:settings', { ...settings, fontSize: parseInt(($event.target as HTMLInputElement).value) })"
            />
            <span class="w-9 text-right text-xs tabular-nums text-muted-foreground">{{ settings.fontSize }}px</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium">颜色</label>
          <div class="flex items-center gap-2">
            <input
              type="color"
              :value="settings.color"
              class="h-7 w-7 cursor-pointer rounded-md border border-input p-0.5"
              @input="emit('update:settings', { ...settings, color: ($event.target as HTMLInputElement).value })"
            />
            <span class="text-xs text-muted-foreground">{{ settings.color }}</span>
          </div>
        </div>
        <p class="text-[10px] text-muted-foreground pt-1 border-t">右键歌词区域可打开此菜单</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* 未唱的字压暗而不是换色，这样设置里换任何颜色都不用跟着改 */
.lyric-word.is-idle {
  opacity: 0.3;
}

.lyric-word.is-sung,
.lyric-word.is-singing {
  opacity: 1;
}
</style>
