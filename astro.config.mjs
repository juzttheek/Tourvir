import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { serializeSitemapItem, SITE_ORIGIN } from './scripts/lib/seo-contract.mjs';

export default defineConfig({
  site: SITE_ORIGIN,
  output: 'static',
  compressHTML: false,
  integrations: [sitemap({ serialize: serializeSitemapItem })],
  build: {
    assets: '_assets',
    format: 'file',
  },
});
