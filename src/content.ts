// Content script - bridge between extension and page
import { DEFAULT_SHORTCUTS, type KeyboardShortcuts } from './shared/config'

let currentShortcuts: KeyboardShortcuts = { ...DEFAULT_SHORTCUTS }

// Load shortcuts from storage and send to page script
async function loadAndSendShortcuts(): Promise<void> {
  try {
    const result = await chrome.storage.sync.get('shortcuts')
    if (result.shortcuts) {
      currentShortcuts = result.shortcuts
    }
    // Send shortcuts to page script
    window.postMessage({ type: 'GJUN_PLAYER_UPDATE_SHORTCUTS', shortcuts: currentShortcuts }, '*')
  } catch (error) {
    console.error('[Gjun Player] Failed to load shortcuts:', error)
  }
}

// Listen for storage changes
chrome.storage.onChanged.addListener(changes => {
  if (changes.shortcuts?.newValue) {
    currentShortcuts = changes.shortcuts.newValue
    window.postMessage({ type: 'GJUN_PLAYER_UPDATE_SHORTCUTS', shortcuts: currentShortcuts }, '*')
  }
})

// Inject the page script
function injectScript(): void {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('injected.js')
  script.onload = () => {
    script.remove()
    // Send initial shortcuts after script loads
    setTimeout(() => {
      loadAndSendShortcuts()
    }, 100)
  }
  ;(document.head || document.documentElement).appendChild(script)
}

injectScript()
console.log('[Gjun Player] Content script loaded')
