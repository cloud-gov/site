---
title: Site Templates
permalink: /pages/documentation/templates/


---

Pages offers several templates for common website types that are meant to serve as a starting point for you. These templates show what’s possible and can even be the basis for your site if your needs are closely aligned to the formatting of the template. Pages templates are not built to serve as final work products, nor are they like templates that you might typically find in a content management system. Instead, templates serve as a “starter kit.” Substantial configuration of a Pages template requires technical knowledge and know-how.

Here are the templates currently available:

{% for template in pages.templates.items %}

  <h3>{{ template.title }}</h3>
  <p>
    <a class='screenshot' href='{{ template.preview_url }}'>
      <img src='{{ site.baseurl }}{{ template.img }}' alt='Screenshot of the {{ template.title }}'>
    </a>
  </p>
  <p>
    {% assign default_docs_url = template.url | prepend: site.baseurl %}
    <a href="{{ template.docs_url | default: default_docs_url }}">Read the template documentation.</a>
  </p>
{% endfor %}

Pages will build any Node.js, Hugo, or Jekyll website, supporting [custom website templates]({{site.baseurl}}/pages/documentation/how-builds-work).

