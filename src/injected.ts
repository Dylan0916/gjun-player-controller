// Script injected into the page context to access window functions
import { DEFAULT_SHORTCUTS, PLAYBACK_RATES, type KeyboardShortcuts, type PlaybackRate } from './shared/config'

let currentShortcuts: KeyboardShortcuts = { ...DEFAULT_SHORTCUTS }
let currentRateIndex = PLAYBACK_RATES.indexOf(1)
let isPlaying = false

// Create or update speed overlay element
function updateSpeedOverlay(rate: number): void {
  let overlay = document.getElementById('gjun-speed-overlay')

  if (!overlay) {
    overlay = document.createElement('div')
    overlay.id = 'gjun-speed-overlay'
    overlay.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 18px;
      font-weight: 600;
      z-index: 999999;
      pointer-events: none;
    `
    document.body.appendChild(overlay)
  }

  overlay.textContent = `${rate}x`
}

function eventToShortcutKey(event: KeyboardEvent): string {
  const parts: string[] = []
  if (event.shiftKey) parts.push('Shift')
  if (event.ctrlKey) parts.push('Ctrl')
  if (event.altKey) parts.push('Alt')
  if (event.metaKey) parts.push('Meta')

  if (event.key === ' ') {
    parts.push('Space')
  } else if (event.key === '>') {
    parts.push('>')
  } else if (event.key === '<') {
    parts.push('<')
  } else if (event.code.startsWith('Key')) {
    parts.push(event.code)
  } else if (event.code.startsWith('Arrow')) {
    parts.push(event.code)
  }

  return parts.join('+')
}

function changePlaybackRate(increase: boolean): void {
  if (increase && currentRateIndex < PLAYBACK_RATES.length - 1) {
    currentRateIndex++
  } else if (!increase && currentRateIndex > 0) {
    currentRateIndex--
  }

  const newRate = PLAYBACK_RATES[currentRateIndex] as PlaybackRate
  // @ts-expect-error - mvRate is defined in the page
  if (typeof window.mvRate === 'function') {
    const settingsDiv = document.querySelector(`#settings div[onclick*="mvRate(${newRate}"]`) as HTMLElement | null
    // @ts-expect-error - mvRate is defined in the page
    window.mvRate(newRate, settingsDiv)
    updateSpeedOverlay(newRate)
    console.log(`[Gjun Player] Playback rate: ${newRate}x`)
  }
}

function togglePlayPause(): void {
  if (isPlaying) {
    // @ts-expect-error - Pause is defined in the page
    if (typeof window.Pause === 'function') {
      // @ts-expect-error - Pause is defined in the page
      window.Pause()
      isPlaying = false
      console.log('[Gjun Player] Paused')
    }
  } else {
    // @ts-expect-error - Play is defined in the page
    if (typeof window.Play === 'function') {
      // @ts-expect-error - Play is defined in the page
      window.Play()
      isPlaying = true
      console.log('[Gjun Player] Playing')
    }
  }
}

function handleKeydown(event: KeyboardEvent): void {
  const target = event.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return
  }

  const shortcutKey = eventToShortcutKey(event)

  switch (shortcutKey) {
    case currentShortcuts.playPause:
      event.preventDefault()
      togglePlayPause()
      break
    case currentShortcuts.speedUp:
      event.preventDefault()
      changePlaybackRate(true)
      break
    case currentShortcuts.speedDown:
      event.preventDefault()
      changePlaybackRate(false)
      break
    case currentShortcuts.forward:
      event.preventDefault()
      // @ts-expect-error - Forward is defined in the page
      if (typeof window.Forward === 'function') {
        // @ts-expect-error - Forward is defined in the page
        window.Forward()
        console.log('[Gjun Player] Forward')
      }
      break
    case currentShortcuts.backward:
      event.preventDefault()
      // @ts-expect-error - Backward is defined in the page
      if (typeof window.Backward === 'function') {
        // @ts-expect-error - Backward is defined in the page
        window.Backward()
        console.log('[Gjun Player] Backward')
      }
      break
    case currentShortcuts.fullscreen:
      event.preventDefault()
      // @ts-expect-error - FullScreen is defined in the page
      if (typeof window.FullScreen === 'function') {
        // @ts-expect-error - FullScreen is defined in the page
        window.FullScreen()
        console.log('[Gjun Player] Fullscreen toggle')
      }
      break
  }
}

// Listen for shortcut updates from content script
window.addEventListener('message', event => {
  if (event.data?.type === 'GJUN_PLAYER_UPDATE_SHORTCUTS') {
    currentShortcuts = event.data.shortcuts
    console.log('[Gjun Player] Shortcuts updated:', currentShortcuts)
  }
})

document.addEventListener('keydown', handleKeydown)
console.log('[Gjun Player] Page script loaded with shortcuts:', currentShortcuts)
