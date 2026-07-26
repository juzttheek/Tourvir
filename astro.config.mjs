import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  compressHTML: false,
  build: {
    assets: '_assets',
    format: 'file',
  },
});
