<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { useLyrics } from '@/composables/useLyrics'
import { useTheme } from '@/composables/useTheme'
import LyricsOverlay from './music/LyricsOverlay.vue'
import PlayerWidget from './music/PlayerWidget.vue'
import PlaylistPanel from './music/PlaylistPanel.vue'

const { theme } = useTheme()

const {
  audioRef, isPlaying, playlist, currentIndex, progress, volume,
  currentTime, currentSong,
  togglePlay, playIndex, next, prev, seek, toggleMute,
  onEnded, onTimeUpdate, onCanPlay, onError
} = useAudioPlayer()

const { currentLyric, nextLyric, currentWords, activeWordIndex, activeWordProgress } = useLyrics(currentSong, currentTime)

const showPlaylist = ref(false)
const showLyrics = ref(true)
const lyricsSettings = ref({ fontSize: 24, color: '' })

const getThemeColor = () => theme.value === 'dark' ? '#ffffff' : '#1a1a1a'

watch(lyricsSettings, (val) => {
  localStorage.setItem('lyrics-settings', JSON.stringify(val))
}, { deep: true })

watch(theme, () => {
  if (!lyricsSettings.value.color) {
    lyricsSettings.value = { ...lyricsSettings.value }
  }
})

const toggleLyrics = () => {
  showLyrics.value = !showLyrics.value
  localStorage.setItem('lyrics-visible', String(showLyrics.value))
}

onMounted(() => {
  const saved = localStorage.getItem('lyrics-settings')
  if (saved) { try { lyricsSettings.value = JSON.parse(saved) } catch {} }
  const vis = localStorage.getItem('lyrics-visible')
  if (vis !== null) showLyrics.value = vis === 'true'
})
</script>

<template>
  <div class="fixed bottom-6 left-6 z-[9999]">
    <audio
      ref="audioRef"
      :src="currentSong?.url"
      preload="auto"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
      @canplay="onCanPlay"
      @error="onError"
    />

    <LyricsOverlay
      v-if="showLyrics"
      :current-lyric="currentLyric"
      :next-lyric="nextLyric"
      :current-words="currentWords"
      :active-word-index="activeWordIndex"
      :active-word-progress="activeWordProgress"
      :settings="{ fontSize: lyricsSettings.fontSize, color: lyricsSettings.color || getThemeColor() }"
      @update:settings="lyricsSettings = $event"
    />

    <PlayerWidget
      :current-song="currentSong"
      :is-playing="isPlaying"
      :progress="progress"
      :volume="volume"
      :show-lyrics="showLyrics"
      @toggle-play="togglePlay"
      @prev="prev"
      @next="next"
      @seek="seek"
      @volume-change="volume = $event"
      @toggle-mute="toggleMute"
      @toggle-lyrics="toggleLyrics"
      @toggle-playlist="showPlaylist = !showPlaylist"
    />

    <Transition name="pop">
      <PlaylistPanel
        v-if="showPlaylist"
        :playlist="playlist"
        :current-index="currentIndex"
        @select="playIndex"
        @close="showPlaylist = false"
      />
    </Transition>
  </div>
</template>
