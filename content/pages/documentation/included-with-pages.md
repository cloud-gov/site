---
title: Included with Pages
permalink: /pages/documentation/included-with-pages/
---

- An automatic deployment mechanism for static site assets and [supported site engines](/pages/documentation/supported-site-engines).
- Web-based configuration and access to preview builds.
- Premade templates for your sites, in addition to the many sites you can copy in creating your site. All templates now have Netlify CMS support built in, allowing content creators to make site changes without requiring extensive html, CSS, or YAML experience.
- Automatically adds additional request headers to improve site security.
  - `Strict-Transport-Security max-age=31536000; preload;`
  - `X-Frame-Options "SAMEORIGIN";`
- Easy on-boarding or off-boarding: Pages can deploy content from existing GitHub repositories used with other tools. Your Pages site will also be easy to port to another deployment mechanism if that's ever needed.
- Content delivery network support for your desired URL, with custom 404 page (see [customization](/pages/documentation/customization/)).
- A user community across agencies and vendors using Pages.
- A permanent team to maintain and patch Pages as needed.
- GSA's previous work to build [cloud.gov](), a robust and secure platform as a service, recognized with a FedRAMP Moderate (DISA Level 2) PATO, that ensures Pages' underlying technology is secure, performant, and scalable.

## Not included with Pages

### Large file hosting

We're excited to announce an upcoming new public file storage feature! 🎉 With this new feature, you'll be able to upload and share files publicly from your existing site and simply manage your public files in Pages.

This functionality facilitates the hosting and organization of files intended for public dissemination and enables direct file uploads to your site, generating persistent URLs associated with the site's custom domain. This eliminates previous file size limitations and offers an optimized approach to content sharing.

Interested in trying out the new public file storage? Reach out to us at [pages-support@cloud.gov](mailto:pages-support@cloud.gov) to get on the waitlist!


### Code editing tools

While it is possible to edit files directly in Github, in practice, this is cumbersome and limited. A local development environment will improve your efficiency when editing code, provide faster feedback for frequent changes, and enable a better debugging experience. Static site engines, such as Node.js-based, Hugo, or Jekyll, require you to have a local environment to ensure that the dependencies of your project are managed properly.
