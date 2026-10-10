import { ref, onBeforeUnmount } from 'vue'

const EDGE_MARGIN = 8

export function useDraggable(
  storageKey: string,
  getDefaultPos: () => { x: number; y: number },
  getSize?: () => { width: number; height: number }
) {
  const position = ref({ x: 0, y: 0 })
  const isDragging = ref(false)
  const dragOffset = ref({ x: 0, y: 0 })

  // 边界要按元素自身尺寸算：写死偏移量会让宽盒子滑出屏幕外
  const clamp = (x: number, y: number) => {
    const { width, height } = getSize?.() ?? { width: 100, height: 50 }
    return {
      x: Math.max(0, Math.min(x, window.innerWidth - width - EDGE_MARGIN)),
      y: Math.max(0, Math.min(y, window.innerHeight - height - EDGE_MARGIN))
    }
  }

  const reClamp = () => {
    position.value = clamp(position.value.x, position.value.y)
  }

  const initPosition = () => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const savedPos = JSON.parse(saved)
        position.value = clamp(savedPos.x, savedPos.y)
        return
      } catch { /* ignore */ }
    }
    const defaultPos = getDefaultPos()
    position.value = clamp(defaultPos.x, defaultPos.y)
  }

  const onDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return
    if (e.type === 'touchmove') e.preventDefault()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    position.value = clamp(clientX - dragOffset.value.x, clientY - dragOffset.value.y)
  }

  const stopDrag = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
    window.removeEventListener('touchmove', onDrag)
    window.removeEventListener('touchend', stopDrag)
    localStorage.setItem(storageKey, JSON.stringify(position.value))
  }

  const startDrag = (e: MouseEvent | TouchEvent) => {
    isDragging.value = true
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    dragOffset.value = { x: clientX - position.value.x, y: clientY - position.value.y }
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchmove', onDrag, { passive: false })
    window.addEventListener('touchend', stopDrag)
  }

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
    window.removeEventListener('touchmove', onDrag)
    window.removeEventListener('touchend', stopDrag)
  })

  return { position, isDragging, initPosition, startDrag, reClamp }
}
