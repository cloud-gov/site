---
parent: services
title: External domain service
name: "external-domain-service"
description: "Custom domains and TLS certificates with automatic renewal"
status: "Production Ready"
showInSidenav: true
---

This service provides three different plans allowing you to use custom domains for your apps running on cloud.gov.

All plans offer:

1. Custom domain support, so that your application can have your domain instead of the default `*.app.cloud.gov` domain.
1. HTTPS support via free TLS certificates with auto-renewal (using [Let's Encrypt](https://letsencrypt.org/)), so that user traffic is encrypted.

The `domain-with-cdn` plan also provides Content Distribution Network (CDN) caching (using [AWS CloudFront](https://aws.amazon.com/cloudfront/)) for fast delivery of content to your users.

The `domain-with-org-lb` plan offers load balancers dedicated to your Cloud.gov organization. This plan is not enabled by default for all organizations. Please contact [**{{site.support_email_address}}**]({{site.support_email}}) if you are interested in using the `domain-with-org-lb` plan for your Cloud.gov organization.

## Plans

| Plan Name            | Plan Description                                                                      |
| -------------------- | ------------------------------------------------------------------------------------- |
| `domain`             | Custom domain with automatically renewing ssl certificate.                            |
| `domain-with-cdn`    | Caching distributed CDN with custom domain and automatically renewing ssl certificate |
| `domain-with-org-lb` | Custom domain on a load balancer dedicated to your Cloud.gov organization             |

### domain plan

| Name      | Required   | Description                   | Example                                                                          |
| --------- | ---------- | ----------------------------- | -------------------------------------------------------------------------------- |
| `domains` | _Required_ | Your custom domain or domains | `"my-domain.gov,www.my-domain.gov"` or `["my-domain.gov",  "www.my-domain.gov"]` |

### domain-with-org-lb plan

| Name      | Required   | Description                   | Example                                                                          |
| --------- | ---------- | ----------------------------- | -------------------------------------------------------------------------------- |
| `domains` | _Required_ | Your custom domain or domains | `"my-domain.gov,www.my-domain.gov"` or `["my-domain.gov",  "www.my-domain.gov"]` |

### domain-with-cdn plan

| Name              | Required   | Description                                   | Example                                                                          |
| ----------------- | ---------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| `domains`         | _Required_ | Your custom domain or domains                 | `"my-domain.gov,www.my-domain.gov"` or `["my-domain.gov",  "www.my-domain.gov"]` |
| `origin`          | optional   | A custom origin to serve from                 | `external-app.example.gov`                                                       |
| `insecure_origin` | optional   | Is the custom origin HTTP (not HTTPS)         | `true`                                                                           |
| `forward_cookies` | optional   | List of cookies to forward                    | `"JSESSIONID,othercookiename"`                                                   |
| `forward_headers` | optional   | List of headers to forward                    | `"x-my-header,x-another-one"`                                                    |
| `error_responses` | optional   | dictionary of code:path to respond for errors | `{"404": "/errors/404.html"}`                                                    |
| `path`            | optional   | A custom path to serve from                   | `/some/path`                                                                     |

#### origin and insecure_origin

You can use this option to send traffic to a custom origin, rather than to your app running on cloud.gov
If your custom origin is served over HTTP without HTTPS available, set `insecure_origin` to `true`. This flag
does not apply to apps hosted on cloud.gov.

#### forward_cookies option

This option allows you to control what cookies to pass on to your application. By default, all cookies are passed. You can specify a list of cookie names (comma-separated) to forward, ignoring others. To pass no cookies, pass an empty string, e.g. `cf create-service external-domain domain-with-cdn my-cdn -c '{"domains": "example.gov,www.example.gov", "forward_cookies": ""}'`. You can explicitly set the default of forwarding all cookies with the string `"*"` (note that this is a special string, not a glob/regex).

#### forward_headers option

This option lets you configure what headers to forward to your application. [CloudFront preconfigures some of these](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html#request-custom-headers-behavior), and unless you are using a custom origin, we set the `Host` header. You can add up to nine additional headers or header patterns but note that CloudFront considers forwarded headers in its cache calculation, so more unique header combinations will cause more cache misses.

#### error_responses option

This option lets you send custom error pages for specific error codes. Set this with an object, where the keys are the error codes (as strings) and the values are the path to the custom error page, for example:

```shell
cf create-service external-domain domain-with-cdn -c '{"domains": "example.gov", "error_responses": {"404": "/errors/404.html", "403": "/login.html"}}'
```

Be careful when setting this for 5xx responses: 5xx responses indicate a server error and setting a custom error response will increase the load on a potentially unhealthy application.

The default for this setting is `{}`, so errors are passed to the client exactly as the CDN receives them, and you can use the same setting to reset to the default:

```shell
cf create-service external-domain domain-with-cdn -c '{"domains": "example.gov", "error_responses": {}}'
```

Note that only these error codes can be customized: 400, 403, 404, 405, 414, 416, 500, 501, 502, 503, 504

#### path option

You can use this option to send traffic to a custom path at either the default or custom origin.

```shell
cf create-service external-domain domain-with-cdn -c '{"path": "/some/path"}'
```

## How to create an instance of this service

1. For each of the domains you want to add to the service, create a DNS CNAME or ALIAS record with the name:

   ```text
   _acme-challenge.&lt;DOMAIN&gt;.
   ```

   and the value:

   ```text
   _acme-challenge.&lt;DOMAIN&gt;.external-domains-production.cloud.gov.
   ```

   For example, if you wanted to set up a service for `example.gov`, you would create a CNAME or ALIAS record with the name:

   ```text
   _acme-challenge.example.gov.
   ```

   and the value:

   ```text
   _acme-challenge.example.gov.external-domains-production.cloud.gov.
   ```

   Or for `www.example.gov`, you would create a CNAME or ALIAS record with the name:

   ```text
   _acme-challenge.www.example.gov.
   ```

   and the value:

   ```text
   _acme-challenge.www.example.gov.external-domains-production.cloud.gov.
   ```

   These records will be validated upon service creation, so be sure to set these up ahead of time.

2. **Optional: Complete this step now only for sites that have not yet launched, or for sites that can withstand downtime.** For each of the domains you want to add to the service, create a DNS CNAME or ALIAS record with the name:

   ```text
   &lt;DOMAIN&gt;.
   ```

   and the value:

   ```text
   &lt;DOMAIN&gt;.external-domains-production.cloud.gov.
   ```

   For example, if you wanted to set up a service for
   `example.gov`, you would create a CNAME or ALIAS record with the name:

   ```text
   example.gov.
   ```

   and the value:

   ```text
   example.gov.external-domains-production.cloud.gov.
   ```

   Or, for `www.example.gov`, you would create a CNAME or ALIAS record with the name:

   ```text
   www.example.gov.
   ```

   and the value:

   ```text
   www.example.gov.external-domains-production.cloud.gov.
   ```

3. Create the cf domain for each of the domains you are adding to the service:

   ```shell
   cf create-domain my-org example.gov
   cf create-domain my-org www.example.gov
   ```

4. Map the routes to your app. There are several ways to do this, documented [here](https://docs.cloudfoundry.org/devguide/deploy-apps/routes-domains.html#map-route). For example:

   ```shell
   cf map-route my-app example.gov
   cf map-route my-app www.example.gov
   ```

5. Create the service. For example, with `example.gov` and `www.example.gov`, run:

   ```shell
   $ cf create-service external-domain domain-with-cdn my-cdn -c '{"domains": "example.gov,www.example.gov"}'
    Creating service instance my-cdn in org my-org / space my-service as me...
    OK

    Create in progress. Use 'cf services' or 'cf service my-cdn' to check operation status.
   ```

   **Note:** If you are on Windows, the command to create the service should be:

   ```shell
   cf create-service external-domain domain-with-cdn my-cdn -c "{\"domains\": \"example.gov,www.example.gov\"}"
   ```

6. Wait for the service instance to complete provisioning. The `domain-with-cdn` plan may take up to 2 hours to complete provisioning, the `domain` plan should complete within an hour. You can check the status by running `cf service <service instance name>`.
7. If you didn't complete step 2 above, do so now.

## Update an instance

Not all plans can be updated - see the matrix below for options.
If you'd like to make an update not supported by the broker, you must delete and re-create your service

<table style="text-align:center;">
        <tr>
            <td colspan=2 rowspan=2></td>
            <th style="text-align:center;" colspan=3 scope="colgroup">New Plan</th>
        </tr>
        <tr>
            <th scope="col">domain</th>
            <th scope="col">domain-with-cdn</th>
            <th scope="col">domain-with-org-lb</th>
        </tr>
        <tr>
            <th style="vertical-align:center" rowspan=5 scope="rowgroup">Existing plan</th>
        </tr>
        <tr>
            <th scope="row">domain</th>
            <td>✅</td>
            <td>🚫</td>
            <td>✅</td>
        </tr>
        <tr>
            <th scope="row">domain-with-cdn</th>
            <td>🚫</td>
            <td>✅</td>
            <td>🚫</td>
        </tr>
        <tr>
            <th scope="row">domain-with-org-lb</th>
            <td>🚫</td>
            <td>🚫</td>
            <td>🚫</td>
        </tr>
</table>
### domain-with-cdn instances

When you update a domain-with-cdn instance, any parameter you leave out of the update params will remain unchanged. (Exception: if you switch from using a custom origin to using cloud.gov as the origin, we'll automatically add `HOST` to the forwarded headers, and automatically set `insecure_origin` to false)

To stop using a custom origin and instead route traffic to an app running on cloud.gov, pass either `null` or empty string (`""`) to the origin parameter:

```shell
cf update-service my-cdn -c '{"origin": ""}'  # passing empty string
cf update-service my-cdn -c '{"origin": null}'  # passing null
```

## Technical considerations for domain-with-cdn plan

### CNAME and ALIAS records

This service requires you to create a CNAME or ALIAS record, and these are slightly different. The exact difference is beyond the scope of this article, but what is important to note is that if your domain is an `apex` domain, that is it has only one dot (e.g. `example.gov`, `my-agency.gov`) you must use ALIAS records, but not all DNS providers offer ALIAS records. These are limitations in the DNS specification, and not specific to this service.

### Caching

CloudFront [uses](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) your application's `Cache-Control` or `Expires` HTTP headers to determine how long to cache content. If your application does not provide these headers, CloudFront will use a default timeout of **24 hours**. This can be particularly confusing as different requests might be routed to different CloudFront Edge endpoints.

While there is no mechanism for cloud.gov users to trigger a cache clear, [cloud.gov support](/docs/help/) can. Cache invalidation is not instantaneous; Amazon recommends expecting a lag time of 10-15 minutes (more if there are many distinct endpoints).

All distributions are configured to forward and cache based on querystrings - that is querystrings are part of the cache key, and querystrings are forwarded to your application.

### Authentication

Cookies are passed through the CDN by default, meaning that cookie-based authentication will work as expected.

### Header forwarding

CloudFront forwards a [limited set of headers](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html#request-custom-headers-behavior) by default.

### Migrating from another AWS account

No two CloudFront distributions may have the same alternate domain names (CNAMEs) across all AWS accounts. AWS has instructions for [moving an alternate domain name to a different distribution using wildcard domains](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html#alternate-domain-names-move). However, because the external domain broker does not currently support wildcard domains, you must delete your source distribution and related DNS CNAME records before creating the new domain-with-cdn service instance in cloud.gov. This will require downtime for your site during your migration.
