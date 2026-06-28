import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: [
      'node_modules',
      'dist',
      '.next',
      // Dead structures retained per repo policy; not part of active test suite.
      '__tests__',
      'tests',
      'silence-objects-voice-module',
      'ghost _patterns',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
