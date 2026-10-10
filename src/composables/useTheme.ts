import { ref, watch } from 'vue'

const getSystemTheme = (): 'light' | 'dark' => {
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

const theme = ref<'light' | 'dark'>(
  (localStorage.getItem('theme') as 'light' | 'dark') || getSystemTheme()
)

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }, { immediate: true })

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        theme.value = e.matches ? 'dark' : 'light'
      }
    })
  }

  return { theme, toggleTheme }
}
