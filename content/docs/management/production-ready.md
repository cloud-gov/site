---
parent: apps
layout: layouts/docs
sidenav: true
redirect_from: 
    - /docs/apps/production-ready/
title: Production-ready guide
weight: -90
---

This is your guide to building production-ready apps on cloud.gov. Read this early and often, especially when you’re starting to consider a future project. It explains things you can do for reliable and responsive applications deployed on cloud.gov.

## Core best practices
To build consistent, healthy, production-ready applications on cloud.gov, incorporate the following practices into your development workflow from the beginning.

### Configuration as code
To ensure consistency and reproducibility, capture your application configuration in version control.

#### How
* Write an [application manifest](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html) that defines your application configuration, such as the application name and the previously-created services to use.

### More than one instance
It is critical that your production application has more than one instance. Then if
there are any issues with one of the platform runners where your app instances are assigned, or we upgrade platform components underneath an instance, your app will continue to function correctly (with less risk of downtime).

#### How
* See [multiple instances]({{ site.baseurl }}/docs/management/multiple-instances).

### Protect access to sensitive credentials
Environment variables defined with `cf set-env` are ephemeral to the specific deployment of each application. Use user-provided services to store sensitive information such as credentials or API keys, and use your `manifest.yml` for non-sensitive variables.

#### How
* Create [user-provided services](https://docs.cloudfoundry.org/devguide/services/user-provided.html) with `cf cups` and bind them with `cf bs`. Once you have updated your application to read your stored credentials from the service, [update your `manifest.yml`](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#services-block) to make it part of your configuration. For non-sensitive information, use [an env: block](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#env-block) in your `manifest.yml`.
* Protect access to platform provided variables such as `VCAP_SERVICES` for [managed services]({{ site.baseurl }}/docs/deployment/managed-services) and `DATABASE_URL` for [the database service]({{ site.baseurl }}/docs/services/relational-database).
  * Minimize your number of users with the `SpaceDeveloper` role, as they can access all environment variables using `cf env`.
  * Educate users who require the `SpaceDeveloper` role to protect access to environment variables.

### Prefer dedicated over shared services
Shared services do not have the same constraints as a dedicated service and can be affected by other customers that are performing CPU or memory intensive tasks against that service.

#### How
* Use `cf marketplace` to consider your options and sizes for each service, and choose appropriately for the resources your application will need.

### Space per environment
When running an application for development or testing, it is best to have a separate space from your production instance in which to run the application. Ideally, each space will look identical to each other, with the exception of routes or number of instances.

#### How
* As an Org Manager for your organization, use the `cf create-space` command to create new spaces for each environment.

### Prevent non-auditable changes to production apps

All changes made to running production applications should be logged for auditing, which means that those changes should be made using commands in the cloud.gov dashboard, command line interface, or CF API (or automated commands in deployment scripts). By default, cloud.gov also allows [SSH access]({{ site.baseurl }}/docs/management/using-ssh), which allows making changes that are harder to audit. This means you should disable SSH access to production applications.

You may need to document your restrictions for remote access to your applications for control AC-17 in your System Security Plan, and this is a restriction that you can document.

#### How
* Use `cf disallow-space-ssh PRODUCTION-SPACE-NAME` for your production space or `cf disable-ssh PRODUCTION-APP-NAME` to [disable SSH access]({{ site.baseurl }}/docs/management/using-ssh) for individual running application instances. Use [event auditing]({{ site.baseurl }}/docs/compliance/auditing-activity) to audit deployments and further access.

### Health monitoring
You want to receive alerts about application errors, downtime, and throughput issues.

#### How
* There are many external services that provide alerting. For example, New Relic provides application availability monitoring with "Synthetics".

## Additional practices
The following practices are very helpful to incorporate into most cloud.gov apps. Evaluate which ones you need for your team and users.

### Zero-downtime deploy
Your application should be able to be deployed without any downtime. Be aware there are known issues if your application automatically does database migrations when deploying.

#### How
* Use the native [Rolling App Deployments](https://docs.cloudfoundry.org/devguide/deploy-apps/rolling-deploy.html). This is preferable to the unmaintained [autopilot](https://github.com/contraband/autopilot) Cloud Foundry CLI plugin.

### Automated deployments
To reduce the risk associated with manual deployments, consider automating the process to make it repeatable.

#### How
* See [continuous deployment]({{ site.baseurl }}/docs/management/continuous-deployment).

### Caching
The best way to prevent performance issues is to enable caching on your application.

#### How
* You can use [S3 file storage]({{ site.baseurl }}/docs/services/s3) for caches.

### Asset serving
It's best not to serve static files from cloud.gov directly.

#### How
* You can [store your files in S3]({{ site.baseurl }}/docs/services/s3) or point CloudFront to an assets folder so you serve your assets with a CDN.

### Custom domain name
When launching your application to production, you should deploy it to production using a custom domain name (a `.gov` or `.mil` TLD). When you are ready to launch to production, DNS delegation for the domain is the easiest path to getting the domain up and running.

#### How
* See [custom domains]({{ site.baseurl }}/docs/management/custom-domains).

### Graceful shutdown
Your application should respond to [shutdown
events](http://docs.cloudfoundry.org/devguide/deploy-apps/app-lifecycle.html#shutdown)
by closing connections and cleaning up resources.

#### How
- Listen to `SIGTERM` and complete the shutdown within 10 seconds.
- Refuse any new connections and complete any in-flight requests.
- Flush and close any open connections.
