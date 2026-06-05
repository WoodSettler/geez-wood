import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Keystatic 后台只在本地 `astro dev` 时启用 (argv 含 'dev')。
// `astro build` (生产 / Cloudflare) 保持纯静态: 不打包后台、不需 adapter、不暴露 /keystatic。
const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site: 'https://woodsettler.com',
  output: isDev ? 'hybrid' : 'static',
  integrations: [
    sitemap(),
    ...(isDev ? [react(), keystatic()] : []),
  ],
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
