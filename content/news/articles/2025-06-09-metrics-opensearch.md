---
layout: layouts/post
tags: news
title: New Metrics for OpenSearch/Elasticsearch Domain Monitoring and S3 Bucket Size
date: 2025-06-10
excerpt: "Track detailed performance metrics for your Cloud.gov domains and S3"
---

Cloud.gov has introduced comprehensive Elasticsearch/OpenSearch domain metrics to help teams monitor system performance and resource utilization for brokered domains. As part of this update, Cloud.gov has also implemented a new metric that allows teams to easily track the size of their S3 buckets.

## Available S3 Metrics

### Storage and Capacity Metrics
- **Bucket Size in Bytes**, metric name: `BucketSizeBytes`

## Available Domain Metrics

### System Resource Metrics

#### CPU Utilization
- Overall domain CPU usage, metric name: `CPUUtilization`
- Master node CPU usage, metric name: `MasterCPUUtilization`
- Helps identify processing load and potential performance bottlenecks

#### Memory Pressure
- JVM Memory Pressure, metric name: `JVMMemoryPressure`
- Old Generation JVM Memory Pressure, metric name: `OldGenJVMMemoryPressure`
- Master Node Memory Pressure, metric name: `MasterJVMMemoryPressure`
- Old Generation Master Node Memory Pressure, metric name: `MasterOldGenJVMMemoryPressure`
- Monitors memory consumption and potential memory-related issues

### Storage and Capacity Metrics

#### Free Storage Space, metric name: `FreeStorageSpace`
This metric helps track storage capacity and plan for scaling.

- Available storage in gigabytes

### Threadpool Performance

#### Write Queue Metrics
- Write Queue Count, metric name: `ThreadpoolWriteQueue`
- Write Queue Rejected Requests, metric name: `ThreadpoolWriteRejected`

#### Search Queue Metrics
- Search Queue Count, metric name: `ThreadpoolSearchQueue`
- Search Queue Rejected Requests, metric name: `ThreadpoolSearchRejected`
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
Metric events are retained in the logging system for 12 months and in offline storage for an additional 18 months in accordance with [M-21-31 guidelines][m-21-31].

## Benefits
1. Domain monitoring
2. Early detection of resource constraints
3. Access to S3 bucket sizes

[logs]: https://logs.fr.cloud.gov
[m-21-31]: https://www.whitehouse.gov/wp-content/uploads/2021/08/M-21-31-Improving-the-Federal-Governments-Investigative-and-Remediation-Capabilities-Related-to-Cybersecurity-Incidents.pdf