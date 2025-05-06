---
layout: layouts/post
tags: news
title: New managed policies available for external domain services
date: 2025-05-06
excerpt: "AWS managed cache and origin request policies can now be used with external domain services"
---

Cloud.gov is happy to announce that we have added support for using AWS [managed cache policies][managed-cache-policies] and [managed origin request policies][managed-origin-request-policies] when creating and updating [external domain CDN services](/docs/services/external-domain-service/).

### Managed cache policies

One of the benefits of external domain CDN services is [caching, which can reduce load on your origin server by responding to requests with content served directly from the cache](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ConfiguringCaching.html).

CloudFront, the underlying AWS service for external domain services, offers many options for controllling how and when content from your origin server is cached.

To simplify the management of your CloudFront distribution's caching behavior, [AWS offers managed cache policies][managed-cache-policies].

The following managed cache policies are now supported for external domain CDN services:

- [`Managed-CachingDisabled`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-policy-caching-disabled)
- [`Managed-CachingOptimized`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-caching-optimized)
- [`Managed-CachingOptimizedForUncompressedObjects`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-policy-caching-disabled)
- [`UseOriginCacheControlHeaders`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-policy-caching-disabled)
- [`UseOriginCacheControlHeaders-QueryStrings`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-policy-origin-cache-headers-query-strings)

To specify a cache policy when creating a new CDN service:

```shell
cf create-service external-domain domain-with-cdn \
    -c '{"cache_policy": "Managed-CachingOptimized"}'
```

Please refer to the external domain services page for [further documentation of the behavior of the `cache_policy` parameter](/docs/services/external-domain-service/#cache_policy-parameter).

### Managed origin request policies

CloudFront offers the ability to [specify which properties (headers, cookies, query parameters) are included when forwarding a request to an origin server](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-request-understand-origin-request-policy.html#origin-request-understand-origin-request-policy-settings).

To simplify the configuration of which request properties are forwarded from CloudFront to an origin server, [AWS offers managed origin request policies][managed-origin-request-policies].

The following origin request policies are supported for external domain CDN services:

- [`Managed-AllViewer`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html#managed-origin-request-policy-all-viewer)
- [`Managed-AllViewerAndCloudFrontHeaders-2022-06`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html#managed-origin-request-policy-all-viewer-and-cloudfront)

To specify an origin request policy when creating a CDN service:

```shell
cf create-service external-domain domain-with-cdn \
    -c '{"origin_request_policy": "Managed-AllViewer"}'
```

Please refer to the external domain services page for [further documentation of the behavior of the `origin_request_policy` parameter](/docs/services/external-domain-service/#origin_request_policy-parameter).

[managed-cache-policies]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#managed-cache-policy-origin-cache-headers-query-strings
[managed-origin-request-policies]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html
