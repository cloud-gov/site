---
parent: management
layout: layouts/docs
sidenav: true
redirect_from: 
    - /docs/apps/custom-domains/
title: Custom domains
---

By default, your application will be accessible via a subdomain of `app.cloud.gov`. To make your application accessible via your own domain, you need to create entries in your DNS system and configure cloud.gov.

## How to set up a custom domain
To make your app accessible via your custom domain name, use the [external domain service]({{ site.baseurl }}/docs/services/external-domain-service). Those pages provide instructions for the DNS entries you need to create in your DNS system.

See [IPv6, HTTPS, and DNSSEC]({{ site.baseurl }}/docs/compliance/domain-standards) for guidance on complying with relevant federal standards and recommendations.

### Comparison of default domains and custom domains

Here's an example of the difference between a default *.app.cloud.gov domain and a custom domain. In this example, an agency's application `App A` is using a default domain, and their application `App B` is using a custom domain.

```mermaid
graph TD

subgraph Amazon Web Services
  subgraph cloud.gov
    CDN
    CG-DNS
    Router[App router]
    subgraph Org: agency-org
    subgraph App A space
        AppA[App A]
      end
      subgraph App B space
        AppB[App B]
      end
    end
  end
end

Public((Public user)) -->|HTTPS| A-DNS(Agency DNS: appB.agency.gov)
Public((Public user)) -->|HTTPS| CG-DNS(cloud.gov DNS: appA_agency.app.cloud.gov)
A-DNS -->|HTTPS| CDN("external domain service")
CG-DNS -->Router
CDN -->Router
Router -->AppA
Router -->AppB
```

## How domains and routes work in cloud.gov

A "route" is a domain with an optional subdomain and path that maps client requests to a particular application, such as:

* `myapp.app.cloud.gov`
* `myapp.app.cloud.gov/test`
* `app.example.gov`
* `example.gov`

[Cloud Foundry's Routes and Domains documentation](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html) explains the overall model and terminology that cloud.gov uses.

## Find the org, space, and app for a route

If you know a route is mapped to an application on cloud.gov, but you're not sure which application it is, you can install and use [cf-route-lookup](https://github.com/18F/cf-route-lookup). This is a [CF CLI plugin]({{ site.baseurl }}/docs/management/plugins).

You need to log into the CF CLI to use this tool, and it will only show you information from orgs and spaces that you have permission to view.

```shell
> cf lookup-route example.gov
Bound to:
example-org/example-space/example-app
```

If you look up a route mapped to an application in an org or space that you can't access, you'll see `Error retrieving apps: Route not found.`

If you look up a route that isn't mapped to any application on cloud.gov, you'll see `Error retrieving apps: Could not find matching domain.`
