---
layout: layouts/post
title: "Managing egress traffic from your app"
date: 2021-12-16 00:00:00 +00:00
excerpt: If you are having issues connecting to external services from your app, use these tips to troubleshoot
---

The cloud.gov team [recently announced a new feature]({{ site.baseurl }}/_posts/2021-11-16-controlled-space-egress) of our platform that allows developers to control how traffic leaves their application instances.

By default, when new spaces are created in your organization an application security group (ASG) is applied that restricts access to only the internal cloud.gov network. Applications running in this ASG can respond to incoming requests, but new egress traffic to cloud.gov brokered services or to the public internet can't be initiated from these instances.

If you have created a new space in your organization and are having trouble making external requests from it (e.g., ssh'ing to your app instance to administer an RDS instance), you may need to modify the ASG that applies to your space.

You can [read the documentation]({{ site.baseurl }}/docs/management/space-egress) on controlling space egress here, and you can modify the ASGs that apply to your space by [opening a support ticket](mailto:support@cloud.gov).
