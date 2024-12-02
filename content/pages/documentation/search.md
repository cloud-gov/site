---
title: Search on Pages Sites
permalink: /pages/documentation/search/


---

It's easy to add search functionality to a site.

We recommend using [Search.gov][], a free site search and search analytics service for federal web sites. You will need to [register](https://search.usa.gov/signup) for Search.gov and follow their [instructions](https://search.gov/get-started/searchgov-for-cloudgov-pages.html) to integrate this service with your Pages site. For full details, visit [Search.gov][]. 

If you'd prefer another solution, you can configure a tool like [lunrjs](https://lunrjs.com/) that creates a search function run using the client browser. An example of this is at the [18F blog](https://18f.gsa.gov/blog/). This avoids any dependency on another service, but the search results are not as robust.

[Search.gov]: https://search.gov/

### Crawl/Index Pages sites

Pages automatically handles search engine visibility for preview URLs via the Pages proxy. For traffic  served through a preview site, the Pages proxy automatically serves the appropriate HTTP robots header, `robots:none`. Preview URLs are not crawlable or indexable by design. Only webpages on the production domain are served with the  `robots: all` directive, indicating to crawlers and bots such as search.gov to index the site and enable search capabilities. 


If you want to disable crawling and indexing for specific pages of your production site, you can include the `noindex/nofollow` meta tag in the head of those pages, or include those folders in your robots.txt, if your site generates one.

<table class="usa-table usa-table--borderless">
  <caption>
    Manage Search Visibility
  </caption>
  <thead>
    <tr>
      <th scope="col"><strong>Method to manage robot behavior</strong></th>
      <th scope="col"><strong>How to <u>prevent</u> indexing/crawling</strong></th>
      <th scope="col"><strong>How to <u>allow</u> indexing/crawling</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row"><strong>robots.txt in your Pages site</strong><br><br>Discourages robots from crawling the page or pages listed. Webpages that aren’t crawled generally can’t be indexed.</th>
      <td>
      <code style="background-color: #f5f5f5; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">User-agent: *
  disallow: /directory
  </code>
      </td>
      <td>N/A, crawling is allowed by default</td>
    </tr>
    <tr>
      <th scope="row"><strong>X-Robots-Tag HTTP header (served by Pages via the Pages proxy)</strong><br><br>Encourages or discourages robots to read and index the content on this page or use it to find more links to crawl
      </th>
      <td>
      <code style="background-color: #f5f5f5; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">robots: none</code><br><br>(this is automatically served to  visitors of all Pages preview builds)
      </td>
      <td>
      <code style="background-color: #f5f5f5; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">robots: all</code><br><br>(this is automatically served to  visitors of all Pages preview builds)
      </td>
    </tr>
    <tr>
      <th scope="row"><strong><meta name="robots"> in your Pages site webpage HTML
</strong><br><br>Encourages or discourages robots to read and index the content on this page or use it to find more links to crawl</th>
      <td>
      <code style="background-color: #f5f5f5; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">content="noindex, nofollow”</code>
      </td>
      <td>N/A, indexing is allowed by default</td>
    </tr>
    </tr>
  </tbody>
</table>


### Conditionally set robots - Eleventy (11ty) 

Take advantage of Pages-provided environment variables to enable environment-specific functionality. Hardcode the condition and meta tags to check the branch from the `process.env` environment variable. This differs from how it is dealt with on a Jekyll site, you are able to add specificity with `process.env.BRANCH`. 
You can use this code sample 

```html
{% unless process.env.BRANCH == "main" %}
  <meta name="robots" content="noindex, nofollow">
{% endunless %}
```

See additional documentation on [build environment variables](https://cloud.gov/pages/documentation/env-vars-on-pages-builds/).
