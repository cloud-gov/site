---
title: Bundler on Pages
permalink: /pages/documentation/bundler-on-pages/


---


Pages uses [Bundler](https://bundler.io/) to manage your Pages site's dependencies.  By default, Pages runs Bundler version 1.

## Specifying a Bundler version

Prior to building a site, the build will check for a file named `.bundler-version`. If one is found, it will use the Bundler version specified to install the gems and versions declared for you site.

For example, if you wish to use Bundler version 2.0.1 to build a site, add a new file named `.bundler-version` to your repository. The `.bundler-version` file should be at the top-level directory. The contents of that file should be "`2.0.1`".
