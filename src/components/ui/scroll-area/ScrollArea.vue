<script setup lang="ts">
import { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaCorner, type ScrollAreaRootProps } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props extends ScrollAreaRootProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <ScrollAreaRoot :class="cn('relative overflow-hidden', props.class)">
    <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
      <slot />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar
      orientation="vertical"
      class="flex touch-none select-none transition-colors h-full w-2.5 border-l border-l-transparent p-px"
    >
      <ScrollAreaThumb class="relative flex-1 rounded-full bg-border" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
