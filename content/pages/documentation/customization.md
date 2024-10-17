---
title: Customizing Your Site
permalink: /pages/documentation/customization/
---

## Customizing your site

{% capture content %}
This page describes some more advanced features of Pages and introduces [Jekyll](https://jekyllrb.com/), one of the technologies behind Pages.
{% endcapture %}
{% include "pages/components/alert--note.html" content: content %}

You may have realized that Pages is based on several technologies. One of the most important is [Jekyll](https://jekyllrb.com/), a site generator. Pages uses Jekyll to build your site, so anything you can do with Jekyll, you can do with Pages.  If you understand how Jekyll works, you can customize all aspects of your entire site.

The Pages templates are all configured to use a theme which houses all the HTML, CSS, and other web assets for your site. You can override everything on a per-file basis by including your own version of the file in your repo. Learn more about [Jekyll themes](https://jekyllrb.com/docs/themes/).

## Layouts and includes

Instead of complete HTML files, Jekyll uses the [Liquid templating language](https://jekyllrb.com/docs/templates/) to compile multiple layouts and includes. A layout is a container for your page that typically contains the most common elements across your pages, like the site header and footer. The layout is specified in the page’s front matter. Includes are HTML snippets or partials that allow you to reuse them across your site. A common include could be a UI component or a side navigation that is reused across the site. Learn more about [Jekyll includes](https://jekyllrb.com/docs/includes/).

## Assets

Assets are things like images, PDFs, CSS, and JavaScript files that are served with your site. The theme will house many of them. These can also be overridden
in your repo by including your own version under the same file path.

## Sass

You can use CSS with Jekyll just like any other static asset. However, one of Jekyll’s most powerful features is how it uses Sass to make writing CSS easier.
Sass files use the `scss` file extension. Your main scss file should live under the `assets/` directory. Learn more about [Sass](https://sass-lang.com/).

{% capture content %}
When you include an scss file under the assets/ directory, Jekyll will only process it as Sass if you include the front matter marker (three dashes `---`).
{% endcapture %}
{% include "pages/components/alert--note.html" content: content %}

{% capture content %}
Sass files under \_sass/ can be imported by using the `@import` syntax in your main scss file. You can use this to organize individual UI component styles with
individual scss files, and then import them from an `assets/site.scss` file.
{% endcapture %}
{% include "pages/components/alert--best-practice.html" content: content %}

## U.S. Web Design System

The [U.S. Web Design System](https://designsystem.digital.gov/) (USWDS) is
a design system for the federal government backed by user research to design and build fast, accessible, mobile-friendly government websites.

The USWDS is written in Sass, which is compiled by Jekyll to CSS. It is designed to be configurable, so you can make customizations by overriding variables or
including additional CSS rules. Learn more about [customizing the U.S. Web Design System](https://designsystem.digital.gov/documentation/getting-started/developers/phase-three-customize/).

## Advanced customization

The Pages themes are meant to keep things simpler for you, the site owner. To do this, the theme makes some assumptions on your behalf. Think of Pages themes as training wheels or guide rails. If you are making a lot of customizations and overrides, the theme might be more burdensome than it is helpful. That is okay! At this point, you probably want to remove the theme and take full control over your website by copying all the theme files into your repo and removing the theme from \_config.yml and your Gemfile. This process is described in Jekyll’s documentation on [converting to a regular theme](https://jekyllrb.com/docs/themes/#converting-gem-based-themes-to-regular-themes).

Pages would also like to learn more about how the theme is or is not working for you. Please [email us](mailto:{{ site.support_email }}) describing your experience so we can learn from you. Thank you!

## Custom 404 pages
If a user navigates to a page on your site that does not exist, they will see a “404 Page” (webspeak for a page that doesn’t exist). Pages provides a default 404 Page (shown below), but you may prefer something that looks and feels like it is part of your site.

_***NOTE:**_ Only one custom 404 page can be set for the site's preview, demo, and live site deployments that do not have a custom domain
associated with them. We automatically set the 404 to the live site's deployment path so all other branch deployments will send 404 requests to the live site's 404. If you are adding a custom domain to a branch deployment for a demo site, we can add the custom 404 page. See [Custom domain 404 page](#custom-domain-404-page).

## Pages default 404 page
![Default 404 Page]({{ '/img/pages/default-404.png' | url }})

In order to use a custom 404 Page, name your 404 Page "404.html" and make sure it is at the root of and included in the resources that are deployed. Jekyll sites should also have the file in the root of the project with the front matter data value set to `permalink: /404.html`, see [the docs for reference](https://jekyllrb.com/tutorials/custom-404-page/). 

### Custom domain 404 page
If you have a custom domain for a demo site or need to direct 404 errors to a file not named "404.html" to support single page applications (SPA), let #cg-pages or pages-support@cloud.gov know that you would like to use a custom 404 page for your custom domain, and we will handle the rest.

## security.txt

Pages supports the proposed [security.txt](https://securitytxt.org/) standard.  Simply create and place the **security.txt** file within the **.well-known** directory created at the root of your repository.  Visit the [security.txt](https://securitytxt.org/) website, for more information on this proposed standard.
```shell
[repository root]/.well-known/security.txt
```
