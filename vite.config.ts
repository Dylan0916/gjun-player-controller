import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readdirSync } from 'fs'

// Plugin to copy manifest.json and icons to dist
function copyExtensionAssets() {
  return {
    name: 'copy-extension-assets',
    closeBundle() {
      // Copy manifest.json
      copyFileSync(resolve(__dirname, 'manifest.json'), resolve(__dirname, 'dist/manifest.json'))

      // Copy icons
      const iconsDir = resolve(__dirname, 'public/icons')
      const distIconsDir = resolve(__dirname, 'dist/icons')
      mkdirSync(distIconsDir, { recursive: true })
      for (const file of readdirSync(iconsDir)) {
        copyFileSync(resolve(iconsDir, file), resolve(distIconsDir, file))
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), UnoCSS(), copyExtensionAssets()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
