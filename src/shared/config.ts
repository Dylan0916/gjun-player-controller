// Default keyboard shortcuts configuration
export interface KeyboardShortcuts {
  playPause: string
  speedUp: string
  speedDown: string
  forward: string
  backward: string
  fullscreen: string
}

export const DEFAULT_SHORTCUTS: KeyboardShortcuts = {
  playPause: 'Space',
  speedUp: 'Shift+>',
  speedDown: 'Shift+<',
  forward: 'ArrowRight',
  backward: 'ArrowLeft',
  fullscreen: 'KeyF',
}

// Available playback rates
export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const
export type PlaybackRate = (typeof PLAYBACK_RATES)[number]
