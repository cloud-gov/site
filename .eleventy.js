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
const path = require("path");
const matter = require('gray-matter');


// Helper function to synchronously determine if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function loadConfig(filePath) {
  try {
    const resolvedPath = path.resolve(filePath);
    return require(resolvedPath);
  } catch (error) {
    return false;
  }
}

// Helper function to retrieve all files in a folder by a given type
function getFilesByTypes(directoryPath, fileTypes) {
  const files = fs.readdirSync(directoryPath);
  const matchingFiles = [];
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isFile() && fileTypes.includes(path.extname(file).toLowerCase())) {
      matchingFiles.push(file);
    }
  }
  return matchingFiles;
}

// Retrieves front matter data from content files synchronously. General purpose function, but specifically used for dynamic sidenav generation
function getFrontMatterSync(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(fileContent);
    return {
      data: parsed.data,  // Front matter as an object
      content: parsed.content,  // Content without front matter
    };
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    return null;
  }
}

// Returns page metadata from 11ty
function getPageData(filePath) {
  const pageData = {}; // Default structure

  // Try to resolve Eleventy page metadata (if available)
  try {
    const eleventyPage = require(filePath); // Simulate page loading
    if (eleventyPage) {
      pageData.url = eleventyPage.url;
      pageData.fileSlug = eleventyPage.fileSlug;
      pageData.outputPath = eleventyPage.outputPath;
    }
  } catch (error) {
    console.warn(`Could not load 11ty page data for: ${filePath}`, error);
  }

  return pageData;
}


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

  // Strips HTML content. Good for general use if needed, but specifically used on paginated areas for description content.
  config.addFilter("striptags", (content) => {
    return striptags(content);
  });

  // Prepare content for table of contents, at time of writing used on the docs.html layout
  config.addFilter("prepTOCContent", (content) => {
    const toc = config.getFilter("toc");
    const striptags = config.getFilter("striptags");
    return striptags(toc(content));
  });

  // Determine if the table of contents should be shown, at time of writing used on the docs.html layout
  config.addFilter("shouldShowTOC", (content, showToc) => {
    return !!showToc && content !== "" && content !== '<ol id="toc" class="section-nav"></ol>';
  });

  // Add plugins
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

  config.addFilter('getSideNav', (collections=[], sidenavIdentifier="") => {
    const sideNav = collections.find(x => x.sidenav === sidenavIdentifier);
    return !!sideNav?.categories ? sideNav.categories.sort((a, b) => {
      return a.weight - b.weight;
    }) : [];
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

  /**
   * Create sidenavigation appropriate to folder structure
   * An empty ".SIDENAV" file in a folder indicates the presence of a sidenav.
   *  - 11ty will parse the folder. Example: content/docs/.SIDENAV
   *  - This file can be empty. It just indicates the existence of navigation
   * A ".SIDENAVCATEGORY" file describes information about the top level category.
   *  - Example: content/docs/apps/.SIDENAVCATEGORY
   *  - module.exports = {
   *      name: "Compliance",
   *      icon: "fa-check-square-o"
   *    }
   *   In your file front matter, to opt in to be included in a menu:
   *   sidenav: true,
   *   sidenavIdentifier: "docs",
   */

  config.addCollection("sideNavigation", function (collectionApi) {
    const basePath = "content";
    const mainFolders = fs
      .readdirSync(basePath, {withFileTypes: true})
      .filter((dirent) => {
        const folderPath = path.join(basePath, dirent.name);
        return (
          dirent.isDirectory() &&
          fileExists(path.join(folderPath, ".SIDENAV"))
        );
      });

    const result = [];
    for (const folder of mainFolders) {
      const folderPath = path.join(basePath, folder.name);
      const sidenavConfigPath = path.join(folderPath, ".SIDENAV");
      const sidenavConfig = loadConfig(sidenavConfigPath);

      if (sidenavConfig) {
        const collection = {
          sidenav: folder.name
        };
        const categories = [];

        const subfolders = fs
          .readdirSync(folderPath, {withFileTypes: true})
          .filter((subdir) => subdir.isDirectory());

        for (const subfolder of subfolders) {
          const subfolderPath = path.join(folderPath, subfolder.name);
          const categoryConfig = loadConfig(
            path.join(subfolderPath, ".SIDENAVCATEGORY")
          );

          if (categoryConfig) {
            const {name, icon} = categoryConfig;
            const contentFiles = getFilesByTypes(subfolderPath, [
              ".html",
              ".md",
              ".liquid",
            ]);

            const children = contentFiles
              .map((file) => {
                const filePath = `${subfolderPath}/${file}`;
                const frontMatter = getFrontMatterSync(filePath)?.data;

                if (frontMatter?.showInSidenav) {
                  // Find corresponding page using the collection API
                  const page = collectionApi.getAll().find((entry) =>
                    entry.inputPath.endsWith(filePath)
                  );

                  return {
                    ...frontMatter,
                    url: page.url
                  };
                }
                return null;
              })
              .filter(Boolean);
            categories.push({
              name,
              weight: categoryConfig.weight,
              id: subfolder.name,
              icon,
              children,
            });
          }
        }
        result.push({
          ...collection,
          categories,
        });
      }
    }
    return result;
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
    linkify: true,
    typographer: true
  })
    .use(function (md) {
      // Override the default link rendering rule to add target and rel attributes
      const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };
      md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const hrefAttr = token.attrs ? token.attrs.find(attr => attr[0] === 'href') : null;
        if (hrefAttr && /^https?:\/\//.test(hrefAttr[1])) {
          token.attrSet('target', '_blank');
          token.attrSet('class', 'usa-link--external');
          token.attrSet('rel', 'noopener noreferrer');
        }
        return defaultRender(tokens, idx, options, env, self);
      };
      md.renderer.rules.code_inline = (tokens, idx, {langPrefix = ''}) => {
        const token = tokens[idx];
        return `<code class="${langPrefix}plaintext">${htmlEntities(token.content)}</code>&nbsp;`;
      };
    })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: 'after',
        class: 'direct-link',
        symbol: '',
        level: [1, 2, 3, 4],
      }),
      slugify: config.getFilter('slug'),
    })
    .use(markdownItTable);

  config.addFilter("markdown", (content) => {
    return markdownLibrary.render(content);
  });
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
