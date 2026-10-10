import { ref, watch, type Ref, type ComputedRef } from 'vue'
import type { Song } from './useAudioPlayer'

export interface LyricWord {
  text: string
  begin: number
  end: number
}

interface LyricLine {
  time: number
  text: string
  words: LyricWord[]
}

// AMLL 歌词库（amll-ttml-db）的 ncm-lyrics 目录，按网易云歌曲 id 索引。
// raw.githubusercontent 在当前网络下不可达，所以走 CDN 与国内镜像，逐个回退
const AMLL_TTML_SOURCES = [
  (id: string) => `https://cdn.jsdelivr.net/gh/amll-dev/amll-ttml-db@main/ncm-lyrics/${id}.ttml`,
  (id: string) => `https://amll-ttml-db.gbclstudio.cn/ncm-lyrics/${id}.ttml`
]

const TTM_ROLE_NS = 'http://www.w3.org/ns/ttml#metadata'
const LRC_TIME = /\[(\d{2}):(\d{2})(?:[.:](\d{2,3}))?\]/
const LRC_TIME_ALL = /\[\d{2}:\d{2}(?:[.:]\d{2,3})?\]/g
const NO_WORDS: LyricWord[] = []

// TTML 的时间两种写法混用：纯秒（6.703）和时钟格式（2:39.306 / 1:02:39.306）
const parseTime = (value: string | null): number | null => {
  if (!value) return null
  const raw = value.trim().replace(/s$/, '')
  const seconds = raw.includes(':')
    ? raw.split(':').reduce((acc, part) => acc * 60 + Number(part), 0)
    : Number(raw)
  return Number.isFinite(seconds) ? seconds : null
}

const getRole = (el: Element): string =>
  el.getAttribute('ttm:role') ?? el.getAttributeNS(TTM_ROLE_NS, 'role') ?? ''

// 逐词时间挂在 <p> 内的 <span begin end> 上。x-bg / x-translation / x-roman 是
// 和声、翻译、音译，和主歌词同级出现，整棵子树跳过，否则会拼进正文
const collectWords = (paragraph: Element): LyricWord[] => {
  const words: LyricWord[] = []
  const lineBegin = parseTime(paragraph.getAttribute('begin')) ?? 0
  const lineEnd = parseTime(paragraph.getAttribute('end')) ?? lineBegin

  const appendText = (text: string) => {
    if (!text) return
    const last = words[words.length - 1]
    if (last) last.text += text
    else words.push({ text, begin: lineBegin, end: lineEnd })
  }

  const visit = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      appendText(node.nodeValue || '')
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return
    const el = node as Element
    if (getRole(el).startsWith('x-')) return
    if (el.localName === 'br') {
      appendText(' ')
      return
    }

    const begin = parseTime(el.getAttribute('begin'))
    if (el.localName === 'span' && begin !== null) {
      words.push({ text: '', begin, end: parseTime(el.getAttribute('end')) ?? begin })
      for (const child of Array.from(el.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) appendText(child.nodeValue || '')
        else visit(child)
      }
      return
    }
    for (const child of Array.from(el.childNodes)) visit(child)
  }

  for (const child of Array.from(paragraph.childNodes)) visit(child)
  return words.filter((word) => word.text.trim())
}

const parseTTML = (source: string): LyricLine[] => {
  if (!source) return []
  const doc = new DOMParser().parseFromString(source, 'application/xml')
  if (doc.getElementsByTagName('parsererror').length) return []

  const result: LyricLine[] = []
  for (const paragraph of Array.from(doc.getElementsByTagNameNS('*', 'p'))) {
    const time = parseTime(paragraph.getAttribute('begin'))
    if (time === null) continue
    const words = collectWords(paragraph)
    const text = words.map((word) => word.text).join('').replace(/\s+/g, ' ').trim()
    if (text) result.push({ time, text, words })
  }
  return result.sort((a, b) => a.time - b.time)
}

// 网易云自己的歌词是行级 LRC，没有逐词时间
const parseLRC = (source: string): LyricLine[] => {
  if (!source) return []
  const result: LyricLine[] = []
  for (const line of source.split('\n')) {
    const match = LRC_TIME.exec(line)
    if (!match) continue
    const msText = match[3] || '0'
    const ms = msText.length === 2 ? parseInt(msText) * 10 : parseInt(msText)
    const time = parseInt(match[1]) * 60 + parseInt(match[2]) + ms / 1000
    // 一行可能挂多个时间戳（副歌重复），全部剥掉才不会漏进正文
    const text = line.replace(LRC_TIME_ALL, '').trim()
    if (text) result.push({ time, text, words: [] })
  }
  return result.sort((a, b) => a.time - b.time)
}

const trySources = async (
  urls: string[],
  parse: (source: string) => LyricLine[]
): Promise<LyricLine[]> => {
  for (const url of urls) {
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const parsed = parse(await res.text())
      if (parsed.length) return parsed
    } catch { /* 这个源不可用，换下一个 */ }
  }
  return []
}

export function useLyrics(currentSong: ComputedRef<Song | null>, currentTime: Ref<number>) {
  const lyrics = ref<LyricLine[]>([])
  const currentLyric = ref('')
  const nextLyric = ref('')
  const currentWords = ref<LyricWord[]>(NO_WORDS)
  const activeWordIndex = ref(-1)
  const activeWordProgress = ref(0)
  let lyricIndex = -1

  const applyTime = (ct: number) => {
    if (!lyrics.value.length) return

    let activeIndex = -1
    for (let i = 0; i < lyrics.value.length; i++) {
      if (ct >= lyrics.value[i].time) activeIndex = i
      else break
    }
    if (activeIndex !== lyricIndex) {
      lyricIndex = activeIndex
      if (activeIndex === -1) {
        currentLyric.value = ''
        nextLyric.value = ''
      } else {
        currentLyric.value = lyrics.value[activeIndex].text
        nextLyric.value = activeIndex + 1 < lyrics.value.length ? lyrics.value[activeIndex + 1].text : ''
      }
    }

    // 逐词进度每帧都要算，所以不能跟着上面的行切换一起提前返回
    const words = activeIndex === -1 ? NO_WORDS : lyrics.value[activeIndex].words
    if (currentWords.value !== words) currentWords.value = words

    let wordIndex = -1
    for (let i = 0; i < words.length; i++) {
      if (ct >= words[i].begin) wordIndex = i
      else break
    }
    activeWordIndex.value = wordIndex
    const word = wordIndex === -1 ? null : words[wordIndex]
    if (!word) {
      activeWordProgress.value = 0
    } else {
      // 只防除零：词时长普遍只有零点几秒，不能拿 1 秒去做下限
      const duration = word.end - word.begin
      activeWordProgress.value = duration > 0
        ? Math.min(Math.max((ct - word.begin) / duration, 0), 1)
        : 1
    }
  }

  const clearLyrics = () => {
    lyrics.value = []
    currentLyric.value = ''
    nextLyric.value = ''
    currentWords.value = NO_WORDS
    activeWordIndex.value = -1
    activeWordProgress.value = 0
    lyricIndex = -1
  }

  const fetchLyrics = async (song: Song) => {
    clearLyrics()

    // 优先 AMLL 的逐词库；库里没收录这首歌，再退回网易云自己的行级歌词
    let loaded: LyricLine[] = []
    if (song.ncmId) {
      loaded = await trySources(AMLL_TTML_SOURCES.map((build) => build(song.ncmId)), parseTTML)
    }
    if (!loaded.length && song.lrc) {
      loaded = await trySources([song.lrc], parseLRC)
    }
    if (!loaded.length) {
      console.warn(`没找到歌词：ncmId ${song.ncmId}`)
      return
    }

    lyrics.value = loaded
    // currentTime 在 0 秒时没有"变化"，watch 不会触发，首句会一直不显示，
    // 所以加载完成后主动按当前进度定位一次
    applyTime(currentTime.value)
  }

  watch(currentSong, (song) => {
    if (song) fetchLyrics(song)
    else clearLyrics()
  }, { immediate: true })

  watch(currentTime, applyTime)

  return { currentLyric, nextLyric, currentWords, activeWordIndex, activeWordProgress }
}
