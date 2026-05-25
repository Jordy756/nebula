// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  fonts: [
    {
      name: 'Host Grotesk',
      cssVariable: '--font-host-grotesk',
      provider: fontProviders.google(),
      display: 'swap',
      subsets: ['latin'],
      styles: ['normal'],
      weights: [300],
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
      weights: [400, 700],
      formats: ['woff2'],
      unicodeRange: ['U+0000-00FF'],
      fallbacks: ['monospace'],
    },
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'github-dark-default' },
  },
  integrations: [mdx()],
});
