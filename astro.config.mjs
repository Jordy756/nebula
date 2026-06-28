// @ts-check
import { satteri } from '@astrojs/markdown-satteri';
import { unified } from '@astrojs/markdown-remark';
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
  markdown: {
    processor: satteri({
      features: {
        gfm: true,
        frontmatter: true,
        headingAttributes: true,
        smartPunctuation: true,
        directive: true,
        math: true,
      },
    }),
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'tokyo-night',
        dark: 'tokyo-night',
      },
      wrap: false,
    },
  },
  integrations: [
    mdx({
      processor: unified(),
    }),
    sitemap(),
    pagefind(),
  ],
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
