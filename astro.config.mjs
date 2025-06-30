// @ts-check
import { defineConfig } from 'astro/config';
import { redirects } from './redirects'
import mdx from '@astrojs/mdx';
import copy from 'rollup-plugin-copy';


import sitemap from '@astrojs/sitemap';


// https://astro.build/config

console.log('BASEURL:', process.env.BASEURL);

console.log('SITE_PREFIX:', process.env.SITE_PREFIX);

export default defineConfig({
  outDir: '_site',
  // where siteurl matches a custom domain
  // site: `https://${siteurl}`
  site: process.env.BASEURL
    ? `https://federalist-f689d682-d20c-4d0b-af7b-c1a42fcd49f5.sites.pages.cloud.gov${process.env.BASEURL}`
    : 'http://localhost:4321',
  base: process.env.BASEURL || '',
  redirects: redirects,
  integrations: [mdx(), sitemap()],
  vite: {
    ssr: {
      noExternal: ['@uswds/uswds'],
    },

    resolve: {
      // Help Vite resolve SCSS imports
      alias: {
        '~uswds': '/node_modules/@uswds/uswds'
      }
    },
    build: {
      target: 'esnext', // ensures modern browser output for native custom elements
    },
    // plugins: [
    //   copy({
    //     targets: [
    //       {
    //         src: 'node_modules/@uswds/uswds/dist/img/sprite.svg',
    //         dest: 'public/assets/uswds/img'
    //       },
    //     ],
    //     hook: 'buildStart',
    //     copyOnce: true,
    //   }),
    // ],
  }
});