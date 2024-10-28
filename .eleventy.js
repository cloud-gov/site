const {DateTime} = require('luxon');
const fs = require('fs');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginNavigation = require('@11ty/eleventy-navigation');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const {markdownItTable} = require('markdown-it-table');
const yaml = require("js-yaml");
const svgSprite = require("eleventy-plugin-svg-sprite");
const {imageShortcode, imageWithClassShortcode} = require('./config');
const pluginTOC = require('eleventy-plugin-toc')
const pluginMermaid = require("@kevingimbel/eleventy-plugin-mermaid");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const inspect = require("util").inspect;
const striptags = require("striptags");

module.exports = function (config) {
  // Set pathPrefix for site
  let pathPrefix = '/';

  // Copy USWDS init JS so we can load it in HEAD to prevent banner flashing
  config.addPassthroughCopy({
    'admin': 'admin',
    '_assets': 'assets',
    '_img': 'img',
    'resources': 'resources',
    'favicon.ico': 'favicon.ico',
    './node_modules/PrismJS/themes/prism-coldark-dark.css': 'assets/styles/prism-atom-dark.css',
    './node_modules/@uswds/uswds/dist/js/uswds-init.js': 'assets/js/uswds-init.js',
    './node_modules/@uswds/uswds/dist/img/sprite.svg': 'img/sprite.svg',
    './node_modules/anchor-js/anchor.min.js': 'assets/js/anchor.min.js'
  });

  config.addFilter("striptags", (content) => {
    return striptags(content);
  });

  // Add plugins.html
  config.addPlugin(pluginRss);
  config.addPlugin(pluginNavigation);

  //// SVG Sprite Plugin for USWDS USWDS icons
  config.addPlugin(svgSprite, {
    path: "./node_modules/@uswds/uswds/dist/img/uswds-icons",
    svgSpriteShortcode: 'uswds_icons_sprite',
    svgShortcode: 'uswds_icons'
  });

  //// SVG Sprite Plugin for USWDS USA icons
  config.addPlugin(svgSprite, {
    path: "./node_modules/@uswds/uswds/dist/img/usa-icons",
    svgSpriteShortcode: 'usa_icons_sprite',
    svgShortcode: 'usa_icons'
  });

  config.addPlugin(pluginTOC, {
    tags: ['h2']
  });

  // Allow yaml to be used in the _data dir
  config.addDataExtension("yaml", contents => yaml.load(contents));

  config.addFilter("debug", (content) => `<pre><code>${inspect(content)}</code></pre>`)

  config.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat(
      'LLLL d, yyyy'
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  config.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  config.addFilter('head', (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  config.addFilter('min', (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1
    );
  }

  config.addFilter('filterTagList', filterTagList);

  // Create an array of all tags
  config.addCollection('tagList', function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return filterTagList([...tagSet]);
  });

  config.addPlugin(syntaxHighlight, {
    highlight: function (str, lang) {
      if (lang === "mermaid") {
        // Bypass syntax highlighting for mermaid code blocks
        return `<pre class="mermaid cg-diagrams">${str}</pre>`;
      }

      // Use the default syntax highlighting for other languages
      const hljs = require("highlight.js");
      if (hljs.getLanguage(lang)) {
        return `<pre><code class="language-${lang}">${hljs.highlight(str, {language: lang}).value}</code></pre>`;
      }

      // Fallback: Return the code without highlighting if no valid language
      return `<pre><code>${str}</code></pre>`;
    }
  });
  config.addPlugin(pluginMermaid, {
    html_tag: 'div',
    extra_classes: 'cg-diagrams',
    mermaid_config: {
      theme: 'base'
    }
  });

  function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: 'after',
      class: 'direct-link',
      symbol: '',
      level: [1, 2, 3, 4],
    }),
    slugify: config.getFilter('slug'),
  }).use(markdownItTable);
  config.addFilter("markdown", (content) => {
    return markdownLibrary.render(content);
  });
  markdownLibrary.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const href = tokens[idx].attrGet("href");
    if (href && href.startsWith("http")) {
      tokens[idx].attrPush(["target", "_blank"]);
      tokens[idx].attrPush(["rel", "noopener noreferrer"]);
    }
    return self.renderToken(tokens, idx, options);
  };
  markdownLibrary.renderer.rules.code_inline = (tokens, idx, {langPrefix = ''}) => {
    const token = tokens[idx];
    return `<code class="${langPrefix}plaintext">${htmlEntities(token.content)}</code>&nbsp;`;
  };
  config.setLibrary('md', markdownLibrary);

  // Override Browsersync defaults (used only with --serve)
  config.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('_site/404/index.html');

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, {'Content-Type': 'text/html; charset=UTF-8'});
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false,
  });

  // Set image shortcodes
  config.addLiquidShortcode('image', imageShortcode);
  config.addLiquidShortcode('image_with_class', imageWithClassShortcode);
  config.addLiquidShortcode("uswds_icon", function (name) {
    return `
    <svg class="usa-icon" aria-hidden="true" role="img">
      <use xlink:href="#svg-${name}"></use>
    </svg>`;
  });

  // If BASEURL env variable exists, update pathPrefix to the BASEURL
  if (process.env.BASEURL) {
    pathPrefix = process.env.BASEURL
  }

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ['md', 'njk', 'html', 'liquid'],

    // Pre-process *.md files with: (default: `liquid`)
    // Other template engines are available
    // See https://www.11ty.dev/docs/languages/ for other engines.
    markdownTemplateEngine: 'liquid',

    // Pre-process *.html files with: (default: `liquid`)
    // Other template engines are available
    // See https://www.11ty.dev/docs/languages/ for other engines.
    htmlTemplateEngine: 'liquid',

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: pathPrefix,
    // -----------------------------------------------------------------

    // These are all optional (defaults are shown):
    dir: {
      input: 'content',
      pathPrefix: '/',
      includes: '../_includes',
      data: '../_data',
      output: '_site',
    },
  };
};
