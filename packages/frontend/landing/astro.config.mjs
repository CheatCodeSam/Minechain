import { defineConfig } from 'astro/config';

export default defineConfig({
  outDir: '../../../dist/packages/frontend/landing',
  vite: {
    cacheDir: '../../../node_modules/.vite/frontend-landing',
  }
});
