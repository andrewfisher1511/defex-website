// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Canonical / future production domain. The site deploys to a *.pages.dev
// preview tonight; canonical + sitemap intentionally reference the future
// domain per spec §9.
const SITE = 'https://defex.engineering';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Keep image processing fully local (no remote patterns).
    domains: [],
    remotePatterns: [],
  },
});
