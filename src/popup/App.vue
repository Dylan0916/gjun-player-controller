<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DEFAULT_SHORTCUTS, type KeyboardShortcuts } from '../shared/config'

const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta'])

const shortcuts = ref<KeyboardShortcuts>({ ...DEFAULT_SHORTCUTS })
const activeField = ref<keyof KeyboardShortcuts | null>(null)
const isSaved = ref(false)

const shortcutLabels: Record<keyof KeyboardShortcuts, string> = {
  playPause: '播放 / 暫停',
  speedUp: '播放速度變快',
  speedDown: '播放速度變慢',
  forward: '快進',
  backward: '倒退',
  fullscreen: '全螢幕',
}

onMounted(async () => {
  try {
    const result = await chrome.storage.sync.get('shortcuts')
    if (result.shortcuts) {
      shortcuts.value = result.shortcuts as KeyboardShortcuts
    }
  } catch (error) {
    console.error('Failed to load shortcuts:', error)
  }
})

function formatShortcut(shortcut: string): string {
  return shortcut.replace('ArrowRight', '→').replace('ArrowLeft', '←').replace('ArrowUp', '↑').replace('ArrowDown', '↓').replace('Space', '空白鍵').replace('Key', '')
}

function startEditing(field: keyof KeyboardShortcuts): void {
  activeField.value = field
  isSaved.value = false
}

function handleKeydown(event: KeyboardEvent): void {
  // Ignore modifier-only key presses (wait for the actual key)
  if (!activeField.value || MODIFIER_KEYS.has(event.key)) {
    return
  }

  event.preventDefault()
  event.stopPropagation()

  const parts: string[] = []
  if (event.shiftKey) parts.push('Shift')
  if (event.ctrlKey) parts.push('Ctrl')
  if (event.altKey) parts.push('Alt')
  if (event.metaKey) parts.push('Meta')

  if (event.key === ' ') {
    parts.push('Space')
  } else if (event.shiftKey && event.code === 'Period') {
    // Shift + . = > (use event.code for IME compatibility)
    parts.push('>')
  } else if (event.shiftKey && event.code === 'Comma') {
    // Shift + , = < (use event.code for IME compatibility)
    parts.push('<')
  } else if (event.code.startsWith('Key')) {
    parts.push(event.code)
  } else if (event.code.startsWith('Arrow')) {
    parts.push(event.code)
  } else if (event.key.length === 1) {
    parts.push(event.key.toUpperCase())
  }

  if (parts.length > 0) {
    shortcuts.value[activeField.value] = parts.join('+')
    activeField.value = null
  }
}

async function saveShortcuts(): Promise<void> {
  try {
    await chrome.storage.sync.set({ shortcuts: shortcuts.value })
    isSaved.value = true
    setTimeout(() => {
      isSaved.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to save shortcuts:', error)
  }
}

async function resetToDefaults(): Promise<void> {
  shortcuts.value = { ...DEFAULT_SHORTCUTS }
  await saveShortcuts()
}
</script>

<template>
  <div class="min-w-320px p-4 bg-#1a1a2e text-white font-sans" @keydown="handleKeydown">
    <h1 class="text-lg font-bold mb-4 text-center text-#eee">🎬 Player Controller</h1>

    <div class="space-y-2">
      <div v-for="(label, key) in shortcutLabels" :key="key" class="flex items-center justify-between p-2 rounded bg-#252545 hover:bg-#303060 transition-colors">
        <span class="text-sm text-#ccc">{{ label }}</span>
        <button
          class="px-3 py-1 rounded text-sm font-mono transition-all"
          :class="activeField === key ? 'bg-#6366f1 text-white animate-pulse' : 'bg-#3a3a5c text-#aaa hover:bg-#4a4a7c'"
          @click="startEditing(key as keyof KeyboardShortcuts)"
        >
          {{ activeField === key ? '按下按鍵...' : formatShortcut(shortcuts[key as keyof KeyboardShortcuts]) }}
        </button>
      </div>
    </div>

    <div class="mt-4 flex gap-2">
      <button class="flex-1 py-2 rounded font-medium transition-colors" :class="isSaved ? 'bg-#22c55e text-white' : 'bg-#6366f1 text-white hover:bg-#5558e0'" @click="saveShortcuts">
        {{ isSaved ? '✓ 已儲存' : '儲存設定' }}
      </button>
      <button class="px-4 py-2 rounded bg-#374151 text-#ccc hover:bg-#4b5563 transition-colors" @click="resetToDefaults">重設</button>
    </div>
  </div>
</template>
