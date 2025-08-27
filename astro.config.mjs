// @ts-check
import { defineConfig } from 'astro/config';
import { redirects } from './redirects'
import mdx from '@astrojs/mdx';
import copy from 'rollup-plugin-copy';
import yaml from '@rollup/plugin-yaml';


import sitemap from '@astrojs/sitemap';


// https://astro.build/config

console.log('BASEURL:', process.env.BASEURL);
console.log('SITE_PREFIX:', process.env.SITE_PREFIX);
console.log('FEDERALIST_URL:', process.env.FEDERALIST_URL);
console.log('OWNER:', process.env.OWNER);
console.log('REPOSITORY:', process.env.REPOSITORY);
console.log('BRANCH:', process.env.BRANCH);

// generate site url based on branch for production builds
let siteUrl = process.env.BASEURL ? process.env.BASEURL : 'http://localhost:4321';
if (process.env?.BRANCH === "main") {
  siteUrl = "https://cloud.gov";
} else if (process.env?.BRANCH) {
  siteUrl = `${process.env.FEDERALIST_URL}/preview/${process.env.OWNER}/${process.env.REPOSITORY}/${process.env.BRANCH}`
}
console.log("Final site URL", siteUrl)
export default defineConfig({
  outDir: '_site',
  // where siteurl matches a custom domain
  // site: `https://${siteurl}`
  site: siteUrl,
  base: process.env.BASEURL ? process.env.BASEURL + '/' : '/',
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
    plugins: [
      yaml(),
      copy({
        targets: [
          { src: 'src/data/credits.json', dest: 'public/data' },
          { src: 'src/data/workshop.json', dest: 'public/data' }
        ],
        hook: 'buildStart'
      })
    ],
  }
});