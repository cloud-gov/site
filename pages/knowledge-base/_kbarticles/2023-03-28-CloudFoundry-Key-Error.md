---
layout: layouts/post
title: "Debian CloudFoundry key not accessible by wget / curl on Ubuntu"
date: 2023-03-28 00:00:00 +00:00
excerpt: This article documents an upstream CloudFoundry key issue.
tags:
  - posts

---

## CloudFoundry key error

On 3/28/2023, at approximately 10:35 AM ET, it was noted that due to an upstream CloudFoundry issue the [CloudFoundry key](https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key) is not accessible by typical wget or curl requests on Ubuntu using the CloudFoundry Command Line Interface. Despite the [url](https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key) being accessible by internet browser, when users attempt to use the wget command, it would be empty. Additionally curl requests would receive a 403 error / access denied error message. The work around for this issue is by providing a user agent with curl's -A option as noted in this [issue ticket](https://github.com/cloudfoundry/cli/issues/2390) on the CloudFoundry github.

## Status update and issue resolution
On 3/28/2023, at approximately 6:18 PM ET, the upstream issue was addressed and resolved as stated in this [issue ticket](https://github.com/cloudfoundry/cli/issues/2390) on the CloudFoundry github.
