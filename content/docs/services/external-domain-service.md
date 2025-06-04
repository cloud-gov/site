---
parent: services
title: External domain service
name: "external-domain-service"
description: "Custom domains and TLS certificates with automatic renewal"
status: "Production Ready"
showInSidenav: true
---

This service provides four different plans allowing you to use custom domains for your apps running on cloud.gov.

All plans offer:

1. Custom domain support, so that your application can have your domain instead of the default `*.app.cloud.gov` domain.
1. HTTPS support via free TLS certificates with auto-renewal (using [Let's Encrypt](https://letsencrypt.org/)), so that user traffic is encrypted.

## Plans

| Plan Name            | Plan Description                                                                      |
| -------------------- | ------------------------------------------------------------------------------------- |
| `domain`             | Custom domain                       |
| `domain-with-cdn`    | CDN with custom domain  |
| `domain-with-org-lb` | Custom domain on a load balancer dedicated to your Cloud.gov organization             |
| `domain-with-cdn-dedicated-waf` | CDN with custom domain and a dedicated WAF web ACL       |

The `domain-with-org-lb` plan offers load balancers dedicated to your Cloud.gov organization.

The `domain-with-cdn` and `domain-with-cdn-dedicated-waf` plans provide a Content Distribution Network (CDN) which leverages caching and distributed edge locations (using [AWS CloudFront](https://aws.amazon.com/cloudfront/)) for fast delivery of content to your users.

In addition to a CDN for your custom domain, the `domain-with-cdn-dedicated-waf` plan also includes:

- A dedicated [WAF web ACL](https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works.html) for your CDN
- Alerts on DDoS attacks against your domain
- Alerts for any detected downtime on your domain

The `domain-with-cdn-dedicated-waf` and `domain-with-org-lb` plans are not enabled by default for all organizations. Please contact [**{{site.support_email_address}}**]({{site.support_email}}) if you are interested in using these plans for your Cloud.gov organization.

### domain plan

| Name      | Required   | Description                   | Example                                                                          |
| --------- | ---------- | ----------------------------- | -------------------------------------------------------------------------------- |
| `domains` | _Required_ | Your custom domain or domains | `"my-domain.gov,www.my-domain.gov"` or `["my-domain.gov","www.my-domain.gov"]` |

### domain-with-org-lb plan

| Name      | Required   | Description                   | Example                                                                          |
| --------- | ---------- | ----------------------------- | -------------------------------------------------------------------------------- |
| `domains` | _Required_ | Your custom domain or domains | `"my-domain.gov,www.my-domain.gov"` or `["my-domain.gov","www.my-domain.gov"]` |

### domain-with-cdn plan

| Name              | Required   | Description                                   | Example                                                                   |
| ----------------- | ---------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| `domains`         | _Required_ | Your custom domain or domains                 | `"my-domain.gov,www.my-domain.gov"` or `["my-domain.gov","www.my-domain.gov"]` |
| `origin`          | optional   | A custom origin to serve from                 | `external-app.example.gov`                                                       |
| `insecure_origin` | optional   | Is the custom origin HTTP (not HTTPS)         | `true`                                                                           |
| `forward_cookies` | optional   | List of cookies to forward                    | `"JSESSIONID,othercookiename"`                                                   |
| `forward_headers` | optional   | List of headers to forward                    | `"x-my-header,x-another-one"`                                                    |
| `error_responses` | optional   | dictionary of code:path to respond for errors | `{"404": "/errors/404.html"}`                                                    |
| `path`            | optional   | A custom path to serve from                   | `/some/path` |
| `cache_policy` | optional | [An AWS managed cache policy][managed-cache-policies]       | `Managed-CachingOptimized` |
| `origin_request_policy` | optional | [An AWS managed origin request policy][managed-origin-request-policies] | `Managed-AllViewer` |

#### `origin` and `insecure_origin`

You can use the `origin` parameter to send traffic to a custom origin, rather than to your app running on cloud.gov. If your custom origin is served over HTTP without HTTPS available, set `insecure_origin` to `true`. This flag does not apply to apps hosted on cloud.gov.

#### `forward_cookies` parameter

> Note: If you set the `cache_policy` parameter, this parameter is ignored

This parameter allows you to control what cookies to pass on to your application. By default, all cookies are passed. You can specify a list of cookie names (comma-separated) to forward, ignoring others. To pass no cookies, pass an empty string:

```shell
cf create-service external-domain domain-with-cdn my-cdn \
    -c '{"domains": "example.gov,www.example.gov", "forward_cookies": ""}'
```

You can explicitly set the default of forwarding all cookies with the string `"*"` (note that this is a special string, not a glob/regex).

#### `forward_headers` parameter

> Note: If you set the `cache_policy` parameter, this parameter is ignored

This parameter lets you configure what headers to forward to your application. [CloudFront preconfigures some of these](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html#request-custom-headers-behavior), and unless you are using a custom origin, we set the `Host` header. You can add up to nine additional headers or header patterns but note that CloudFront considers forwarded headers in its cache calculation, so more unique header combinations will cause more cache misses.

#### `error_responses` parameter

This parameter lets you send custom error pages for specific error codes. Set this with an object, where the keys are the error codes (as strings) and the values are the path to the custom error page, for example:

```shell
cf create-service external-domain domain-with-cdn \
    -c '{"domains": "example.gov", "error_responses": {"404": "/errors/404.html", "403": "/login.html"}}'
```

Be careful when setting this for 5xx responses: 5xx responses indicate a server error and setting a custom error response will increase the load on a potentially unhealthy application.

The default for this setting is `{}`, so errors are passed to the client exactly as the CDN receives them, and you can use the same setting to reset to the default:

```shell
cf create-service external-domain domain-with-cdn \
    -c '{"domains": "example.gov", "error_responses": {}}'
```

Note that only these error codes can be customized: 400, 403, 404, 405, 414, 416, 500, 501, 502, 503, 504.

#### `path` parameter

You can use this option to send traffic to a custom path at either the default or custom origin.

```shell
cf create-service external-domain domain-with-cdn \
    -c '{"path": "/some/path"}'
```

#### `cache_policy` parameter

> Note: If you set the `cache_policy` parameter, the `forward_headers` and `forward_cookies` parameters are ignored.

[AWS managed cache policies][managed-cache-policies] provide a simplified way for managing the caching behavior of your CloudFront distribution.

Only the following managed cache policies are supported by the broker:

- [`Managed-CachingDisabled`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-policy-caching-disabled)
- [`Managed-CachingOptimized`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-caching-optimized)
- [`Managed-CachingOptimizedForUncompressedObjects`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-policy-caching-disabled)
- [`UseOriginCacheControlHeaders`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-policy-caching-disabled)
- [`UseOriginCacheControlHeaders-QueryStrings`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-policy-origin-cache-headers-query-strings)

Please note that while the [AWS documentation on managed cache policies][managed-cache-policies] may refer to these policies by different names, **only the names listed above are allowed values for `cache_policy`**.

```shell
cf create-service external-domain domain-with-cdn \
    -c '{"cache_policy": "Managed-CachingOptimized"}'
```

#### `origin_request_policy` parameter

[AWS managed origin request policies][managed-origin-request-policies] provide a simplified way to control how the request is forwarded from CloudFront to your origin server.

Only the following origin request policies are supported by the broker:

- [`Managed-AllViewer`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html#managed-origin-request-policy-all-viewer)
- [`Managed-AllViewerAndCloudFrontHeaders-2022-06`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html#managed-origin-request-policy-all-viewer-and-cloudfront)

Please note that while the [AWS documentation on managed origin request policies][managed-origin-request-policies] may refer to these policies by different names, **only the names listed above are allowed values for `origin_request_policy`**.

```shell
cf create-service external-domain domain-with-cdn \
    -c '{"origin_request_policy": "Managed-AllViewer"}'
```

### domain-with-cdn-dedicated-waf plan

> Note: All of the parameters for the `domain-with-cdn` plan are applicable to this plan as well, in addition to the ones listed below

| Name              | Required   | Description                                   | Example                                                                   |
| ----------------- | ---------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| `alarm_notification_email`         | _Required_ | An email to receive notifications sent by the broker          | `example@agency.gov` |

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

[managed-cache-policies]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-policy-origin-cache-headers-query-strings
[managed-origin-request-policies]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html
