---
parent: pricing
title: Try a free sandbox space
weight: -10
redirect_from:
  - /overview/pricing/free-limited-sandbox/
  - /docs/pricing/free-limited-sandbox/
---

A sandbox is a free space that you can use to see if cloud.gov might suit your team’s needs. From the [setup process](/docs/getting-started/setup) through [deploying an app](/docs/getting-started/your-first-deploy), it works similarly to other spaces that are included in [paid access packages](/pricing/), with [some limitations](#sandbox-limitations).

## Get a sandbox

Anyone with a U.S. federal government email address (ending in `.gov`, `.mil`, or `.fed.us`) can [**sign up for a free sandbox space**](https://account.fr.cloud.gov/signup). No paperwork is required from us. (It’s up to you to determine whether you may need permission from your agency.) If you have other questions or comments, see [Contact](/contact).

If you’re interested in [purchasing full access](/pricing/) (whether for **Prototyping** or for production systems at the **FISMA Low** or **FISMA Moderate** levels), email [inquiries@cloud.gov](mailto:inquiries@cloud.gov) and we'll help you get started.

## Keep in mind before you try your sandbox

- If your agency has not already integrated its single-sign on authentication provider with cloud.gov (only EPA, FDIC, GSA, NSF, OMB, and DOJ have done this so far), you will access your sandbox through a [cloud.gov account](/docs/getting-started/accounts#cloudgov-accounts). This account requires multi-factor authentication using a mobile app such as 1password, Microsoft Authenticator, or Authy. If you cannot install or use these apps, such as if your workplace prohibits mobile phones or mobile phone cameras, you might not be able to set up access. (Paid access packages support integration with your agency single sign-on authentication provider.)
- If your agency prohibits installing the [cloud.gov command line interface](/docs/getting-started/setup#set-up-the-command-line) on your computer, you won’t be able to deploy applications in your sandbox. (For paid access packages, we can coordinate with your agency to help them approve this tool.)
- If your agency blocks many network ports, you might receive errors when you try [`cf logs`](/docs/deployment/logs) or [`cf ssh`](/docs/management/using-ssh). (For paid access packages, we can coordinate with your agency to ask for unblocking those ports.)

## A few things you can try in your sandbox

On a technical level, a sandbox is a specially-limited ["space"](/docs/getting-started/concepts#spaces) within a sandbox-only ["organization"](/docs/getting-started/concepts#organizations) that is managed by cloud.gov. You can build and deploy applications and services within that space.

As part of that, you can:

- Try the [web interface (dashboard)](/docs/getting-started/setup#log-into-the-dashboard-web-interface) and the command line options.
- Deploy a demo app or two! You can use [one of these sample apps](/docs/getting-started/your-first-deploy) or your own code. You can also try [an app from the Cloud Foundry community](https://github.com/cloudfoundry-samples) (we don't maintain or vouch for these).
- Create a free service instance, such as a [PostgreSQL or MySQL database instance](/docs/services/relational-database), and bind it to your application.
- Look at [your application logs](/docs/deployment/logs).
- [Give a teammate permission to deploy](/docs/orgs-spaces/roles#adding-roles-via-the-dashboard-for-users-to-access-orgs-and-spaces) by assigning them the “space developer” role.

## Sandbox limitations

Sandboxes are limited because cloud.gov is a cost-recoverable service. They’re a free trial to help you evaluate whether to purchase cloud.gov.

Sandboxes are for testing; they’re suitable for information and applications that require **no confidentiality, integrity, or availability**. (Don’t put production applications or production data in sandboxes; that’s not what they’re for.)

Limitations include:

- Resource usage is capped at 1 GB of memory total, for all the applications in your space combined.
- You're [capped at using a maximum](/docs/pricing/quotas#what-quotas-limit) of 10 [service instances](/docs/deployment/managed-services), 10 [service keys](https://docs.cloudfoundry.org/devguide/services/service-keys.html), and 10 [application routes](/docs/management/custom-domains), for all the applications in your space combined.
- You can only create certain managed service instances. (See each [service documentation page](/docs/services/intro) for details about which service instances are available in sandboxes.)
- You can only use the default `*.app.cloud.gov` domain, not [custom domains](/docs/management/custom-domains).
- Sandboxes do not have an "org manager" role available. (You can control access and permissions for your own sandbox space.) If you want to manage an org of prototyping spaces for people at your agency, consider purchasing a [prototyping package](/pricing).
- Government agency users that login to Cloud.gov using their agency single sign-on credentials have access to their government agency’s sandbox. A Cloud.gov user account (Cloud.gov IdP) cannot be added to spaces in the government agency sandbox. A user must have single sign-on credentials with that specific government agency which they can use login to cloud.gov to access their government agency's sandbox as well as to be added to spaces within their government agency’s sandbox.
- We periodically delete sandbox contents to ensure that users don't run production applications in sandboxes. Specifically, we clear all sandbox contents 90 days after the first application or service is created. We'll warn you via email five days before clearing out your sandbox.
