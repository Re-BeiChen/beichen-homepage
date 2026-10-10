import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

export interface Song {
  name: string
  artist: string
  url: string
  cover: string
  ncmId: string
  lrc: string
}

// meting 返回的歌曲 id 可能直接给出，也可能只藏在 url / lrc 的查询串里
const extractNcmId = (item: any): string => {
  if (item.id) return String(item.id)
  for (const value of [item.url, item.lrc]) {
    if (typeof value !== 'string') continue
    try {
      const id = new URL(value).searchParams.get('id')
      if (id) return id
    } catch { /* 不是绝对 URL，换下一个字段 */ }
  }
  return ''
}

export function useAudioPlayer() {
  const audioRef = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false)
  const playlist = ref<Song[]>([])
  const currentIndex = ref(0)
  const progress = ref(0)
  const volume = ref(0.7)
  const lastVolume = ref(0.7)
  const currentTime = ref(0)

  const currentSong = computed(() => playlist.value[currentIndex.value] || null)

  const fetchPlaylist = async () => {
    try {
      const res = await fetch('https://api.i-meto.com/meting/api?server=netease&type=playlist&id=7650673579')
      const data = await res.json()
      if (Array.isArray(data)) {
        playlist.value = data.map((item: any) => ({
          name: item.title,
          artist: item.author,
          url: item.url,
          cover: item.pic,
          ncmId: extractNcmId(item),
          lrc: item.lrc
        }))
      }
    } catch (err) {
      console.error('Failed to fetch playlist:', err)
    }
  }

  const togglePlay = () => {
    if (!audioRef.value || !currentSong.value) return
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      audioRef.value.play().catch(console.error)
    }
    isPlaying.value = !isPlaying.value
  }

  const playIndex = (index: number) => {
    if (index < 0 || index >= playlist.value.length) return
    currentIndex.value = index
    isPlaying.value = true
    setTimeout(() => audioRef.value?.play().catch(console.error), 50)
  }

  const next = () => playIndex((currentIndex.value + 1) % playlist.value.length)
  const prev = () => playIndex((currentIndex.value - 1 + playlist.value.length) % playlist.value.length)

  const onEnded = () => next()

  const onTimeUpdate = () => {
    if (!audioRef.value) return
    currentTime.value = audioRef.value.currentTime
    if (audioRef.value.duration) {
      progress.value = (audioRef.value.currentTime / audioRef.value.duration) * 100
    }
  }

  const seek = (e: MouseEvent) => {
    if (!audioRef.value || !currentSong.value) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
    if (audioRef.value.duration) {
      audioRef.value.currentTime = audioRef.value.duration * percent
      progress.value = percent * 100
    }
  }

  const onCanPlay = () => {
    if (isPlaying.value) audioRef.value?.play().catch(() => {})
  }

  const onError = () => {
    if (isPlaying.value) setTimeout(next, 1000)
  }

  const toggleMute = () => {
    if (volume.value > 0) {
      lastVolume.value = volume.value
      volume.value = 0
    } else {
      volume.value = lastVolume.value || 0.7
    }
  }

  watch(volume, (v) => {
    if (audioRef.value) audioRef.value.volume = v
  })

  // timeupdate 只有 ~4Hz，逐字歌词的扫过要每帧的进度，所以播放时用 rAF 同步时间
  let timeRaf = 0
  const pumpTime = () => {
    if (!isPlaying.value) return
    if (audioRef.value) currentTime.value = audioRef.value.currentTime
    timeRaf = requestAnimationFrame(pumpTime)
  }
  watch(isPlaying, (playing) => {
    cancelAnimationFrame(timeRaf)
    if (playing) timeRaf = requestAnimationFrame(pumpTime)
  })
  onBeforeUnmount(() => cancelAnimationFrame(timeRaf))

  onMounted(() => {
    fetchPlaylist()
    if (audioRef.value) audioRef.value.volume = volume.value
  })

  return {
    audioRef, isPlaying, playlist, currentIndex, progress, volume,
    currentTime, currentSong,
    togglePlay, playIndex, next, prev, seek, toggleMute,
    onEnded, onTimeUpdate, onCanPlay, onError
  }
}
