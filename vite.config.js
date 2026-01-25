import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.js',
    alias: {
      // Mock Phaser SOLO en tests
      'phaser': new URL('./test/__mocks__/phaser.js', import.meta.url).pathname
    }
  }
});
