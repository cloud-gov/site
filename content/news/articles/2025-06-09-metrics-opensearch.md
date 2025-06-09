---
layout: layouts/post
tags: news
title: New Metrics for OpenSearch/Elasticsearch Domain Monitoring and S3 Bucket Size
date: 2025-05-08
excerpt: "Track detailed performance metrics for your Cloud.gov domains and S3"
---

Cloud.gov has introduced comprehensive domain metrics to help teams monitor system performance and resource utilization. As part of this update, Cloud.gov has also implemented a new metric that allows teams to easily track the size of their S3 buckets.

This update allows customers to access metrics and satisfy [M-21-31 guidelines][m-21-31] for log retention. Metrics are now available in the [Cloud.gov logging system][logs].

## Available S3 Metrics

### Storage and Capacity Metrics
- **Bucket Size in Bytes**

## Available Domain Metrics

### System Resource Metrics

#### CPU Utilization
- Overall domain CPU usage
- Master node CPU usage
- Helps identify processing load and potential performance bottlenecks

#### Memory Pressure
- JVM Memory Pressure
- Old Generation JVM Memory Pressure
- Master Node Memory Pressure
- Monitors memory consumption and potential memory-related issues

### Storage and Capacity Metrics

#### Free Storage Space
- Available storage in gigabytes
- Helps track storage capacity and plan for scaling

### Threadpool Performance

#### Write Queue Metrics
- Write Queue Count
- Write Queue Rejected Requests

#### Search Queue Metrics
- Search Queue Count
- Search Queue Rejected Requests
- Monitors background processing and potential system overload

## Using the Services - S3 Dashboard
A quick way to view domain metrics is to:
1. Log in to the [logging system][logs]
2. Click on "Dashboards" in the left sidebar menu
3. Enter "Services" in the search bar
4. Follow the link for ["Services - S3"](https://logs.fr.cloud.gov/app/dashboards#/view/services-s3)

{% image "_img/content/finding_service_dashboards.png" "Screenshot of searching OpenSearch Dashboards for ones with 'Services' in the name" %}

## Using the Services - Elasticsearch/OpenSearch Dashboard
A quick way to view domain metrics is to:
1. Log in to the [logging system][logs]
2. Click on "Dashboards" in the left sidebar menu
3. Enter "Services" in the search bar
4. Follow the link for ["Services - Elasticsearch/OpenSearch"](https://logs.fr.cloud.gov/app/dashboards#/view/aws-elasticsearch)

{% image "_img/content/finding_service_dashboards.png" "Screenshot of searching OpenSearch Dashboards for ones with 'Services' in the name" %}

## How to Search Metrics in the Logging System
Metrics are ingested into the logging system with the value `@type: metrics`, which provides an easy way to filter them.

To find your metrics in the logging system:
1. Log in to the [logging system][logs]
2. Click on "Discover" in the left sidebar menu
3. Add a filter for `@type: metrics` to your log search

{% image "_img/content/add-metrics-filter.png" "Screenshot of OpenSearch Dashboards interface showing the addition of a filter for the @type field with a value of metrics" %}

4. Apply additional filters on the metrics event fields as desired. For example, to filter for domain FreeStorageSpace, add a filter of `metric.name: FreeStorageSpace`:

{% image "_img/content/filter-metric-domain-freestoragespace.png" "Screenshot of OpenSearch Dashboards interface showing a filtered search for the metric FreeStorageSpace" %}

## Metrics Fields
The fields available on metrics records are:
- `@cf.service_offering` - Type of service being monitored
- `@cf.service_plan` - Specific service plan details
- `metric.average` - Numeric value of the metric
- `metric.name` - Name of the specific metric
- `metric.unit` - Unit of measurement

## How Metrics Are Ingested into the Logging System
An automated job runs every 10 minutes to pull metric events from the platform and ingest them into the logging system. AWS limits most metrics to a 2-minute delay. Thus, **there could be up to a 12-minute delay** before metric logs appear in the logging system.

## Retention
Metric events are retained in the logging system for 12 months and in offline storage for an additional 18 months.

## Benefits
1. Domain monitoring
2. Early detection of resource constraints
3. Access to S3 bucket sizes

[logs]: https://logs.fr.cloud.gov
[m-21-31]: https://www.whitehouse.gov/wp-content/uploads/2021/08/M-21-31-Improving-the-Federal-Governments-Investigative-and-Remediation-Capabilities-Related-to-Cybersecurity-Incidents.pdf