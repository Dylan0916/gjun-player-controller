import { build } from 'bun'

// Build content scripts as IIFE (standalone bundles)
await build({
  entrypoints: ['./src/content.ts', './src/injected.ts'],
  outdir: './dist',
  format: 'iife',
  minify: true,
  target: 'browser',
})

console.log('Content scripts built successfully!')
