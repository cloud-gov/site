---
layout: layouts/post
tags: news
title: Faster build times on cloud.gov Pages
date: 2023-02-23
excerpt: We advertise that cloud.gov Pages, previously known as Federalist, can “securely deploy a website from your repository in minutes.” Getting your content on the web quickly, seeing fast previews, and even seeing errors early are all important to good maintenance of a website
---

We advertise that [cloud.gov Pages](https://cloud.gov/pages), previously known as Federalist, can “securely deploy a
website from your repository in minutes.” Getting your content on the web quickly, seeing fast previews, and even seeing
errors early are all important to good maintenance of a website. But as sites become larger and more complex, this can
be a difficult task. We’ve made two recent changes to cloud.gov Pages to make website deployment faster so you can focus
on your code, design, and content.

## Publishing improvements

Static site generators, like those frequently used with cloud.gov Pages, generate each website page in advance. We then
copy each page to our hosting service so it can appear online. If we want to save time, we can choose to only copy the
page if we can tell that it changed from the previous build.

Starting in late 2020, cloud.gov Pages was publishing every file individually. We did this because a new feature
for [adding headers](https://cloud.gov/pages/documentation/custom-headers/) prevented us from quickly comparing whether
files had changed. This past October, we made a change to return to only publishing changed files if sites weren’t using
the header feature.

Sites like [Digital.gov](https://digital.gov/), with over 20,000 files, had been taking seventeen minutes on each build!
Now their production builds only update about one-third of the total files and have brought the build times down to
seven or eight minutes (fresh preview builds still take about fourteen). Across our whole portfolio, production sites
saw 25% faster builds, saving 1 minute 40 seconds on average.

<div class="border bg-white padding-2 margin-bottom-2 margin-top-1 radius-md padding-bottom-0 maxw-tablet">

<h4 class="margin-0">Median Build Times (in minutes) for Digital.gov by Month</h4>
<p class="margin-top-1 font-sans-2xs text-base margin-bottom--3">Digital.gov was taking seventeen minutes to build on cloud.gov Pages with most of the time spent uploading new files. After the October release of publishing improvements, build times were reduced to about seven or eight minutes.</p>

!["Chart - Faster Builds"](/img/content/cloud-gov-pages-faster-builds-1.svg)

  <table class="usa-sr-only" aria-describedby="source_line">
    <caption>Median Build Times for Digital.gov by Month</caption>
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">June</th>
        <th scope="col">July</th>
        <th scope="col">August</th>
        <th scope="col">September</th>
        <th scope="col">October</th>
        <th scope="col">November</th>
        <th scope="col">December</th>
        <th scope="col">January</th>
        <th scope="col">February</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Median build times in minutes</th>
        <td>15.1</td>
        <td>15.8</td>
        <td>16.8</td>
        <td>17.1</td>
        <td>17.1</td>
        <td>8.5</td>
        <td>7.1</td>
        <td>7.1</td>
        <td>6.8</td>
      </tr>
    </tbody>
  </table>
  <p id="source_line">Source: internal cloud.gov Pages analytic data</p>
</div>

## Caching build dependencies

Sites were installing all required custom software dependencies on each build. This process commonly takes about two or
three minutes. We replaced this step with a new, opt-out, caching strategy:

- If your dependencies didn’t change from the previous build, we’ll re-download the prior package from a secure cache.
  This takes about fifteen seconds
- If your dependencies did change, which doesn’t happen often, we’ll re-install them.
- Because downloading dependencies from a cache can create some errors, we have
  an [option to opt-out](https://cloud.gov/pages/documentation/cache-dependencies/#configuration).

We just recently added this change, so we’re still waiting to see the full metrics on how it’s improved build time. But
many sites using the popular [Jekyll framework](https://jekyllrb.com/) have seen their build time reduced by about three
minutes. You can see the effect of both of these changes in our median build time since June of last year:

<div class="border bg-white padding-2 margin-bottom-2 margin-top-1 radius-md padding-bottom-0 maxw-tablet">

<h4 class="margin-0">Median Build Times (in minutes) for cloud.gov Pages Sites by Month</h4>
<p class="margin-top-1 font-sans-2xs text-base margin-bottom--3">Sites were taking about six minutes to build in mid-2022. Publishing improvements in October helped reduce the time by about two minutes. Caching improvements in January reduced the build time by about another minute.</p>

!["Chart - Faster Builds 2"](/img/content/could-gov-pages-faster-builds-2.svg)

  <table class="usa-sr-only" aria-describedby="source_line">
    <caption>Median Build Times for cloud.gov Pages Sites by Month</caption>
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">June</th>
        <th scope="col">July</th>
        <th scope="col">August</th>
        <th scope="col">September</th>
        <th scope="col">October</th>
        <th scope="col">November</th>
        <th scope="col">December</th>
        <th scope="col">January</th>
        <th scope="col">February</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Median build times in minutes</th>
        <td>5.2</td>
        <td>5.9</td>
        <td>5.5</td>
        <td>5.7</td>
        <td>5.6</td>
        <td>4.5</td>
        <td>3.5</td>
        <td>3.3</td>
        <td>2.7</td>
      </tr>
    </tbody>
  </table>
  <p id="source_line">Source: internal cloud.gov Pages analytic data</p>
</div>

Please [let us know](mailto:inquiries@cloud.gov) if these new features have helped you out or you’d like to try [cloud.gov Pages](https://cloud.gov/pages).
