# Cloud.gov Public Website

This repo uses Astro to build a static site, ready to be hosted on [Cloud.gov Pages](https://cloud.gov/pages/).

## Local Development

`npm i` to install packages (use the LTS version of NodeJS)

`npm run dev` to copy USWDS assets and start a dev server

View the website at <http://localhost:4321>

`npm run build` to build all assets locally

`npm run federalist` to approximate the build that happens on Pages.

Please review the [Astro developer documentation](https://docs.astro.build/en/getting-started/) if you're going to make code changes.

### Env variables & baseurl
Because Pages preview links deploy to subdirectory paths and not root-level domains, it's important to make sure there's a `FEDERALIST_URL` environment variable provided for production builds other than the final live domain. To build absolute asset paths correctly (like the sitemap and canonical URLs), the build process must provide the entire domain, including protocol (`"https://federalist-12345.sites.pages.cloud.gov/"`) and any containing directories. In production, the build process automatically prefixes relative urls automatically build for federalist previews of any branch other than `main`, using the ENV variables provided by Pages. See https://docs.cloud.gov/pages/developers/env-vars-on-pages-builds

In order to keep links easy whether we're building the site at the root level or within a folder, this layout makes use of the rarely-seen `<base>` [element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/base) to prefix all non-absolute links. This means that page links which direct to `[this website]/foo` are defined without the first slash (`link: 'foo'`) in YAML and output without the first slash in HTML (`<a href="foo"`). 

## Editing Content

The site's content is in YAML or JSON data so that it can be easily edited from the GitHub web interface if you're not running the site locally.

In `/src/data/`, you'll see some data files and a folder titled `pages`. All of the page-specific content is in a `page/[name].yaml` file. Sitewide content is in `sitewide.yaml`. You can edit the link in the header and footer in `header.ts` or `footer.ts` 

The order of the page sections in the HTML is controlled elsewhere. If you need to re-order the sections on a given page, or if you've renamed a key in your page's YAML file, check the `src/pages/` folder for the `.astro` page, and update the order of the components or key name in that file. 

```js
  <Hero {...content.hero} />
  <Tiles {...content.g2g} />
  <CTA {...sitewide.freeSandbox} />
```

The content sections all accept:
  - a `heading` field
  - an `intro` field (parsed as markdown)
  - a `content` field (parsed as markdown)
  - an `outro` field (parsed as markdown)
  - a string of extra `classes` for the containing element
  - an `art` field which adds a pre-defined background illustration
  - a `color` field which applies a pre-defined color theme to this section
  - an `id` field which allows you to specify a unique anchor to this section for in-page linking
  - a `buttons` list, which can show zero, one, or more large buttons, each expecting:
      - a `label` which is the button text in sentence case
      - a `url` which should follow the conventions above (omit the first slash for relative links)
      - a `variant` if you wish to specify a color(`accent-warm`) or style (`outline`)

All of the above are optional, so if you don't want something, just omit it.

Some sections also use lists to show content in colums, lists, or cards. These all follow the same structure as well, within an `items` array:
  - a `heading` field
  - a `text` field (parsed as markdown)
  - an `icon` field which will choose from one of the [USWDS icons](https://designsystem.digital.gov/components/icon/) by name (`add_circle`)
  - a `button` element which has the same `label`, `url`, and `variant` button options above. 
    The Tiles component allow you to specify whether the whole item is clickable, and to what url, using `link`. Do not use both of these together.
    The Topics component will style this "button" as a text link.

### Adding new pages

Add a new `src/pages/[page].astro` file and its corresponding `src/data/pages[page].yaml`. Make sure your new astro file points to the content at your new YAML file. Match your YAML keys to the objects you're passing into the components. 

### Changing URLs

Rename the [page].astro filename to change the path. (Really, it's ok) This is not controlled by the page YAML file. **AND THEN:**

### Deleting pages / Redirects

Please add redirects to `redirects.ts` in the format:

```'/old': '/new',```

**whenever** you delete or rename a page url. (Images and other assets can 404).

### Adding images

There are two places for images:
`src/assets/` is home to the images that are dynamically accessed and inserted into the page HTML at build time. These are minified and hashed by Astro, and their actual paths on the website are not stable. You cannot safely link directly to these assets using `src` or `href`, or in Markdown.

`public/assets/img` is the place for any images that are loaded by the CSS, like background images. These are also assets that do not change (or change infrequently), so their URLs are stable. 


## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.

## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright
> and related rights in the work worldwide are waived through the [CC0 1.0
> Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication.
> By submitting a pull request, you are agreeing to comply with this waiver of
> copyright interest.

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.
