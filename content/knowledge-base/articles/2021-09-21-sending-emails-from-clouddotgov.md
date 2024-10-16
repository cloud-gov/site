---
layout: layouts/post
title: "Sending emails from the cloud.gov platform"
date: 2021-09-21 00:00:00 +00:00
excerpt: Information to help if you need to send emails from your app
tags:
  - posts
---

Applications sometimes need to send an outbound email to users or administrators. cloud.gov users may require guidance on what email components are supported by the platform, and which options are best for them.

Note - if you are looking for options to send manual communications to your users (like a monthly newsletter, or periodic marketing update), please know that this article is not geared for that use case.

Some things you can check:

* What events potentially trigger an email from your application (e.g., a user password reset)?
* What is the volume of email you expect your application to send?
* What address / domain do your emails need to come from? Do you administer this domain, or are you in contact with the people who do?

The cloud.gov platform does not directly offer a managed service for sending programmatically generated emails, but there are a few different approaches you can consider depending on your needs.

### Connecting to an agency SMTP server

If your agency provides an SMTP service, it may be possible for your application to utilize it. In order to do so, you may need approval from your agency's network security team. This approach often requires special firewall rules to be established letting your application in cloud.gov talk to your agency's SMTP server(s), which will be running in a completely separate environment.

To do this, you will require a list of IP addresses from which traffic from the cloud.gov platform will reach your agency's network. You can find the [list of external IP addresses for cloud.gov here](https://cloud.gov/docs/management/static-egress/#cloudgov-egress-ranges). Be aware, however, that simply filtering traffic to your agency's network by IP address is insufficient from a security perspective, and additional authentication should also be put in place.

### Connecting to a Cloud Service Provider offering

Commercial CSP's also provide services that may be suitable for your needs. You can review the FedRAMP status of these services on the various CSP sites ([AWS](https://aws.amazon.com/compliance/services-in-scope/), [Azure](https://docs.microsoft.com/en-us/azure/azure-government/compliance/azure-services-in-fedramp-auditscope), [GCP](https://cloud.google.com/security/compliance/fedramp)), and connect to these external services using a [user provided service instance](https://docs.cloudfoundry.org/devguide/services/user-provided.html).

### Running your own SMTP server

If none of the above options is suitable for your needs, you may opt to run your own SMTP server on cloud.gov and have your application leverage this instance to send outbound email. A description of how to set up and manage an SMTP server on cloud.gov is beyond the scope of this article, but will typically involve more work to set up and manage than the prior two options.