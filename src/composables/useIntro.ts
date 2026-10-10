import { ref } from 'vue'

export const introActive = ref(window.location.pathname === '/')

export function useIntro() {
  const finishIntro = () => {
    introActive.value = false
  }
  return { introActive, finishIntro }
}
