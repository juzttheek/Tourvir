import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tourvir.lk',
  output: 'static',
  compressHTML: false,
  integrations: [sitemap()],
  build: {
    assets: '_assets',
    format: 'file',
  },
});
