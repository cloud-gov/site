---
layout: layouts/post
title: "Scaling your cloud.gov applications"
date: 2023-08-07 00:00:00 +00:00
excerpt: How and why to scale your cloud.gov applications by adding more application instances
tags:
  - posts

---

### Importance of multiple application instances

One of the benefits of Cloud.gov is the ability to [deploy applications with a simple command](https://cloud.gov/docs/deployment/deployment/#how-deployment-works). 

By default, applications are deployed with a single instance which handles all traffic and load for your application. The downside of a single application instance is that if you have unexpected surges in application load, it is likely that your instance may run out of available CPU or memory or both, leading to an outage for your application. 

To increase your application's ability to respond to requests, also known as availability, you can horizontally scale your application by running multiple application instances. When you have multiple application instances, your application requests are load-balanced among them to ensure that no single instance is prematurely overloaded, thus maximizing your availability. 

By default, the routing infrastructure in cloud.gov [distributes requests to application instances using a `round-robin` algorithm](https://docs.cloudfoundry.org/concepts/http-routing.html#balancing-algorithm).

Running multiple application instances also increases the chances that your application will be [balanced across availability zones](https://docs.cloudfoundry.org/concepts/diego/diego-auction.html#auction).

The benefits of running multiple application instances are [exemplified in the EPA AirNow.gov customer story]({{ site.baseurl }}/docs/customer-stories/epa-airnow-gov), which details how the EPA utilized the ability to quickly and easily scale up their number of application instances to handle increased customer traffic for AirNow.gov.

### How to scale your application instances

Using the [cf push command](https://docs.cloudfoundry.org/devguide/deploy-apps/deploy-app.html#custom-cf-push), you can use the `-i` flag to indicate the number of application instances you would like.

For example, pushing an application with 2 instances:

```shell
cf push myapp -i 2
```

Additionally, you can also define the number of application instances in your application `manifest.yml` file with the [`instances` manifest attribute](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest-attributes.html#instances).

An example for defining an application with 2 instances in your `manifest.yml` file:

```shell
    memory: 512mb
    instances: 2
    applications:
        name: myapp
        path: .
```

Please note the default number of instances is 1 instance.

You can also use the [cf scale](http://docs.cloudfoundry.org/devguide/deploy-apps/cf-scale.html) command to increase the number of instances for a running app.

```shell
cf scale myapp -i 2
```

Please note that running multiple instances may sometimes cause scheduled tasks or data loads to run multiple times. This issue can be prevented by updating scheduled tasks to use the [`CF_INSTANCE_INDEX` environment variable]({{ site.baseurl }}/docs/management/multiple-instances#managing-multiple-instances-with-cf-instance-index), which denotes a specific application instance number.

### Application instances and memory usage

Each individual application instance utilizes the same amount of memory that is specified in the application manifest or indicated in the `cf push` command. Please note that the application cannot use more than the [defined memory quota for your org]({{ site.baseurl }}/docs/management/limits).

For example, if the org `my-example-org` had:

- a memory quota of 3 GB and were hosting a single application `myapp` 
- 256 MB of memory per application instance 
- 4 application instances

Then, the application would be utilizing 1 GB (256 MB * 4 instances) of the org’s 3 GB total memory quota. This would leave 2 GB available for the org to otherwise use. 
