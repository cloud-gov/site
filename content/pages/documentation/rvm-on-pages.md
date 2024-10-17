---
title: RVM on Pages
permalink: /pages/documentation/rvm-on-pages/


---

Pages uses [RVM](https://rvm.io/) to select which ruby version to use to build a Pages site.

## Default Ruby version
By default, the build will use Ruby version 3.1.4.

## Specifying a Ruby version

Prior to building a site, the build will check for a file named `.ruby-version`. If one is found, it will use RVM to install and use the version specified there.

For example, if you wish to use Ruby version 3.2.2 to build a site, add a new file named `.ruby-version` to your repository. The `.ruby-version` file should be at the top-level directory. The contents of that file should be "`3.2.2`".

The minimum allowed version for Ruby is 3.0.6
