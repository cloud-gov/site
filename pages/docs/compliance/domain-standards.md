---
parent: compliance
layout: layouts/docs
sidenav: true
title: IPv6, HTTPS, DNSSEC, and Certificates
---

Here's what cloud.gov does to support relevant federal standards and recommendations, for applications on `*.app.cloud.gov` and [custom domains]({{ site.baseurl }}/docs/management/custom-domains).

## IPv6

cloud.gov has basic support for IPv6. cloud.gov supports two types of application access, external and internal. External access is when traffic reaches an application from outside the cloud.gov platform, such as from an office, external application, or user. Internal traffic is traffic which leverages the platform's internal DNS to allow applications to communicate without ever leaving the platform's network boundaries. IPv6 is supported for external access. For internal access, only IPv4 is supported. When you deploy a new application, for external IPv6 traffic, you do not have to take any action, and most applications will know to use IPv4 internally as cloud.gov's internal DNS provider will leverage IPv4. If you have more questions or security questions, please contact [Support](mailto:support@cloud.gov).

## HTTPS

cloud.gov ensures all applications are accessible only over HTTPS with [HTTP Strict Transport Security (HSTS) headers](https://https.cio.gov/hsts/) in accordance with the [HTTPS-Only Standard](https://https.cio.gov/). Any HTTP requests are permanantly redirected to HTTPS. You don't have to take any action.

### [HSTS preloading](https://https.cio.gov/guide/#options-for-hsts-compliance)

cloud.gov sets [`Strict-Transport-Security`]({{ site.baseurl }}/docs/management/headers) headers for all applications by default, and has added the `cloud.gov` domain/subdomains to the HSTS preload list for most major browsers.

You are responsible for setting up HSTS preloading for your [custom domain]({{ site.baseurl }}/docs/management/custom-domains). cloud.gov doesn't set this up for you. If you need HSTS preloading, follow [the guidance from the maintainers of the HSTS preload list](https://hstspreload.org/#opt-in). The HTTPS-Only Standard encourages HSTS preloading.

*Additional details are available in the [cloud.gov FedRAMP P-ATO documentation package]({{ site.baseurl }}/docs/overview/fedramp-tracker#how-you-can-use-this-p-ato), including in System Security Plan controls SC-8, SC-12, and SC-20.*

### SSL/TLS Implementation

The SSL/TLS implementation depends on how your client is reaching cloud.gov, which is either through an AWS load balancer, or through the CDN service based on Amazon CloudFront.

* [AWS load balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#tls13-security-policies) implement the `ELBSecurityPolicy-TLS13-1-2-Ext1-2021-06` SSL/TLS policy.
* [Amazon CloudFront distributions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/secure-connections-supported-viewer-protocols-ciphers.html#secure-connections-supported-ciphers) implement the `TLSv1.2_2018` policy.

Our TLS implementation and cipher suites are consistent with [White House Office of Management and Budget's M-15-13](https://https.cio.gov/), the Department of Homeland Security's [Binding Operational Directive 18-01](https://cyber.dhs.gov/bod/18-01/), and [NIST's 800-52r2 Guidelines for TLS Implementations](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-52r2.pdf).

Some SSL/TLS scanners will nonetheless return results flagging the following ciphers as "weak":

```txt
TLS_RSA_WITH_AES_128_CBC_SHA256 (0x003C)
TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 (0xC027)
TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 (0xC028)
TLS_RSA_WITH_AES_256_CBC_SHA256 (0x003D)
TLS_RSA_WITH_AES_128_GCM_SHA256 (0x009C)
TLS_RSA_WITH_AES_256_GCM_SHA384 (0x009D)
```

These are false positives. At cloud.gov we leverage TLS implementations from Amazon Web Services, which use [s2n-tls](https://github.com/aws/s2n-tls) to inject random timing variations [to mitigate CBC attacks like LUCKY13](https://aws.amazon.com/blogs/security/s2n-and-lucky-13/). Further, these ciphersuites are still acceptable per [NIST 800-52r2, Appendix D](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-52r2.pdf#%5B%7B%22num%22%3A174%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C70%2C719%2C0%5D).
While the CBC cipher modes of operation are being phased out (they are theoretically subject to padding oracle attacks), we support them so we can serve members of the public who are unable to adopt newer technology.

**TLS 1.3**: TLS 1.3 has been implemented with `ELBSecurityPolicy-TLS13-1-2-Ext1-2021-06` security policies on our load balancers. All new Cloudfront domains are created with the `TLSv1.2_2018` security policy, which supports TLS 1.3. The TLS versions supported by other AWS service endpoints, like S3, are controlled by AWS itself.

**Cipher suite names**: The AWS documentation uses the OpenSSL cipher names which are different from IANA/RFC cipher names returned by scanners. For example, `ECDHE-RSA-AES128-SHA256` on the documentation page will be called `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256` by scanners and other tools.

**Cipher suite count**: The `ELBSecurityPolicy-TLS13-1-2-Ext1-2021-06` has 15 ciphers, but your scanner may only show 11 results. That's because our certificates are signed with RSA keys, not Elliptic Curve (ECDSA) keys, so those cipher suites are not in use. In June, 2023, a switch to ECDSA caused an [outage for a significant percentage of cloud.gov users](https://cloudgov.statuspage.io/incidents/vz9t74zm7zw8), so we will support RSA for the foreseeable future.

## Compression and BREACH (CVE-2013-3587)

Security scanners targeting applications hosted on cloud.gov may generate findings for
BREACH, [CVE-2013-3587](https://nvd.nist.gov/vuln/detail/CVE-2013-3587) (CVSS score 5.9, Medium),
and then suggest disabling HTTP compression as the mitigation. However, there are multiple mitigations
according to the [BREACH authors](https://breachattack.com), including the following:

* Separating secrets from user input
* Randomizing secrets per request
* Masking secrets (effectively randomizing by XORing with a random secret per request)
* Protecting vulnerable pages with CSRF
* Length hiding (by adding random number of bytes to the responses)

Since any modern web application framework should include CSRF token masking to mitigate BREACH,
disabling compression is not necessary, and would badly impact all end users of cloud.gov. We
suggest that you mitigate BREACH at the application level, or carry the finding as an operational
requirement.

## DNSSEC

cloud.gov does not currently support DNSSEC on `cloud.gov` domains. For example, an application at `*.app.cloud.gov` would not support DNSSEC.

[OMB memo M-18-23](https://www.whitehouse.gov/wp-content/uploads/2018/08/M-18-23.pdf) rescinds M-08-23, the OMB memo that originally mandated DNSSEC for federal systems. You should consider carefully whether DNSSEC is still a requirement for your system.

If you do need DNSSEC for your custom domain, you are responsible for configuring DNSSEC in your DNS system. cloud.gov can't configure DNSSEC for you because cloud.gov does not have access to your DNS system.

cloud.gov supports mapping your DNSSEC-enabled custom domain to your applications hosted on cloud.gov -- see [DNSSEC support for the CDN service]({{ site.baseurl }}/docs/services/cdn-route#dnssec-support) and [DNSSEC support for the custom domain service]({{ site.baseurl }}/docs/services/custom-domains#dnssec-support).

*Additional details are available the cloud.gov System Security Plan, including controls SC-20, SC-21, SC-22, and SC-23.*

## Certificates

cloud.gov's global TLS certificate is issued by the third party, open-source vendor [Let's Encrypt](https://letsencrypt.org/). Let's Encrypt allows individuals, companies, or agencies to request free TLS certificates in an automated fashion for easy HTTPS functionality. As part of that, the cloud.gov platform does not control any aspect of the certificate provisioning process other than the common name and alternative name. We do not control the ciphers, certificate validity, or other algorithms used by Let's Encrypt during the certificate creation process. Once our certificates have been generated by Let's Encrypt, we upload them to our public-facing load balancers.

The benefit of using Let's Encrypt, even though the cloud.gov platform doesn't control much of the provisioning process, is how it allows the cloud.gov team to bring a full HTTPS/TLS experience (along with all the compliance requirements) to customers at both no-cost and with full certificate authority validity. Let's Encrypt has partnered with IdenTrust to have their intermediate certificates cross-signed by IdenTrust, who has partnered with nearly all major vendors which ship their products with root certificates. Due to the strategic partnership Let's Encrypt has, nearly every programming language and operating system automatically trusts Let's Encrypt certificates automatically. This is a major benefit to the cloud.gov team, as cross-signed intermediate certificates can be cost-prohibitive to acquire, which is why a lot of vendors just make their root certificate authority certificate available, requiring customers to download them and making the overall user experience much more difficult.

Let's Encrypt is a complicated yet powerful TLS certificate vendor. While the cloud.gov team cannot change the way the certificates are provisioned, any support requests or questions regarding our TLS configuration are welcome at [support@cloud.gov](mailto:support@cloud.gov?subject=TLS%20Certificate%20Questions). You can also find more about how Let's Encrypt works via their [public documentation](https://letsencrypt.org/docs/).
