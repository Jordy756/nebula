// @ts-check
// import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import pagefind from 'astro-pagefind';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [
    mdx({
      gfm: true,
    }),
    sitemap(),
    pagefind(),
  ],
  markdown: {
    // processor: satteri({
    //   features: { directive: true },
    // }),
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: false,
    },
  },
  fonts: [
    {
      name: 'Host Grotesk',
      cssVariable: '--font-host-grotesk',
      provider: fontProviders.google(),
      display: 'swap',
      subsets: ['latin'],
      styles: ['normal'],
      weights: [300, 400, 600],
      formats: ['woff2'],
      unicodeRange: ['U+0000-00FF'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.google(),
      display: 'swap',
      subsets: ['latin'],
      styles: ['normal'],
      weights: [400, 500],
      formats: ['woff2'],
      unicodeRange: ['U+0000-00FF'],
      fallbacks: ['monospace'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
