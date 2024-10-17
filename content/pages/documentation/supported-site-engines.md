---
title: Supported Site Engines
permalink: /pages/documentation/supported-site-engines/


---

## Current Support
- [Hugo](https://gohugo.io/)
- Node.js - Runs a [Node](https://nodejs.org) script
- Static - Hosts the files in your repository without modifying them, useful for exports from content management systems or web development tools.
- [Jekyll](http://jekyllrb.com)

## Requirements
For all engines **except Static** Pages will serve whatever is in the `_site` folder so you should either:
- configure the generator to produce output in the `_site` folder OR
- create a symlink from `_site` to whatever folder will contain the generator's output

### Node
A Node script can be run to generate a site OR as a preliminary step to generating one with Jekyll or Hugo. To use a Node script as the generator, choose **Node.js** as the **Site Engine** in the Advanced Settings configuration for your site.

For more details on using Node see [node on cloud.gov Pages]({{site.baseurl}}/pages/documentation/node-on-pages).

## Jekyll Resources
Pages can generate any Jekyll website, which lets you build custom websites hosted on Pages. For documentation on getting started with Jekyll, see [jekyllrb.com](http://jekyllrb.com/).

For an example of a Jekyll site optimized for Pages, see our [templates]({{site.baseurl}}/pages/documentation/templates/).

### Jekyll build features

Pages provides features beyond just generating Jekyll sites. The steps below outline how to set up custom websites that best take advantage of these features.

### Configuration

Pages adds a `site.branch` attribute to your global site object with the value of the current branch name. You can access this value in your templates and content and use it to style builds based on the working branch.

### Metadata defaults

If you [specify front-matter defaults](http://jekyllrb.com/docs/configuration/#front-matter-defaults) in your Jekyll site configuration, Pages will pre-fill the front-matter of a new post with these defaults.

### Base URLs

To handle routing sites for previews, Pages automatically sets a `baseurl` path for your site. This essentially nests your site in a subdirectory under the `pages.cloud.gov` domain, such as `sites.pages.cloud.gov/preview/18f/hub/new-draft`, where `/preview/18f/hub` is the `baseurl`.

All links to other pages or resources on the site require a `baseurl` prefix. If you're designing a custom template to work with Pages, make sure all references to relative links include `site.baseurl` prefixes, including trailing slashes, as follows:

Link: `{% raw %}[About Us]({{site.baseurl}}/about-us){% endraw %}`

Image: `{% raw %}![18F]({{site.baseurl}}/uploads/18f-logo.png' | url }}){% endraw %}`

### Conditionally set robots

To instruct search engines not to index the `preview` builds of your site, try adding the following code within your site's `<head>` tags which are most likely found in your template's head.html or meta.html file:
{% raw %}
```markdown
{% unless site.branch == "main" %}
  <meta name="robots" content="noindex, nofollow">
{% endunless %}
```
{% endraw %}
***Note:*** This code sample assumes the live version of your site's code is maintained in the `main` branch of your site's code repository.

For all versions of your site that aren't built from `main`, the source code of the site will contain the code above.

### Jekyll Plugins

Jekyll has a plugin system for adding custom features to the build process of your website. Use-cases for plugins include automatically generating new pages or templates, fetching data or content from external resources, and CCS or JavaScript compilation. [Learn more about Jekyll plugins](http://jekyllrb.com/docs/plugins/).

Pages supports Jekyll plugins, enabling any plugins in a site's `_plugins` directory. If the site includes a `Gemfile`, Pages will also run `bundle install && bundle exec jekyll build` to install required Ruby gems and generate the site with those libraries available for use in plugins. You can also use a `Gemfile` to change the version of Jekyll used to build the site.

Several dependencies are already available for use in the building environment. These include `ruby`, `python`, and `node.js`. You can write plugins that take advantage of these without needing a `Gemfile`.

To see the exact configuration of the build environment, see the [build environment `Dockerfile`](https://github.com/cloud-gov/pages-build-container/blob/main/Dockerfile).

**Note:** using `Gemfile` may considerably slow down the generation of your website, depending on how long the `bundle install` step takes to complete.

## Hugo Resources (experimental)

Pages can also generate websites with [Hugo](http://gohugo.io/), the Go-based site generator. See the [Hugo Docs](https://gohugo.io/documentation/) for getting started with Hugo.

### Hugo version

When building a Pages site using Hugo, the desired version of Hugo for building your site must be specified in a `.hugo-version` file located in your repository's root directory.
>Sample .hugo-version file contents:
```markdown
0.48.0
```
>For an extended Hugo version:
```markdown
extended_0.48.0
```
