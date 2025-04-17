---
layout: layouts/post
tags: news
title: "Now available: alerting for Cloud.gov logs"
date: 2025-04-17
excerpt: How to use the new alerting feature for your Cloud.gov logs
---

Alerting is now available for the Cloud.gov logging system. This new feature allows users to monitor their logs and send notifications when certain conditions or thresholds are met.

You will be able to setup monitors for different conditions using fields, including:

- The size of a field value
- The contents of a field value
- Writing a query to only match under certain conditions(e.g. only in your prod space, only for a specific app)

The potential applications of the new alerting feature include (but are not limited to):

- Monitor for an increase in 404 responses in a certain timeframe
- Monitor for appearance of certain words (e.g. exceptions, failures) in log contents
- Monitor when your application's memory usage exceeds a certain threshold

## How access for OpenSearch notifications works

Most of the objects that you create in OpenSearch, such as queries, visualization, or dashboards, are only visible to other members of your OpenSearch tenant. We have configured OpenSearch to have tenants for each cloud.gov organization, meaning there is a one-to-one mapping between tenants and organizations. For whichever tenant you choose when using OpenSearch, only other members of the associated Cloud.gov organization can see your objects.

Unfortunately, the OpenSearch alerting plugin [does not support the use of tenants for storing associated objects such as email recipient groups or channels](https://github.com/opensearch-project/alerting-dashboards-plugin/issues/1096).

Given the current behavior of the OpenSearch alerting plugin, to ensure maximum security we have customized OpenSearch so that **only users who share all of the same cloud.gov organizations as your user will be able to see the notification objects that you create**. If another user shares some but not all of the same Cloud.gov organizations as you, the names of your notification objects will be visible to the other user, but they will not be able to see any details about those objects.

In OpenSearch 3.x, the concept of "workspaces" is going to be introduced, which may allow for a permissions model for notifications that more closely matches how we handle multi-tenancy for other OpenSearch objects.

## Setting up a Notification

To setup a notification you need to setup an email group and channel.

### Making an email recipient group

1. From the OpenSearch navigation menu, select **Notifications** under **Management**
2. Select **Email recipient groups**
3. Click **Create recipient Group**
4. Enter a meaningful name description. In the email textbox, add the email addresses that you wish to be included in the group.

### Setting up a notification channel

1. From the OpenSearch navigation menu, select **Notifications** under **Management**
2. Choose **Channels**
3. Click **Create channel**
4. Provide a name and description for the channel.
5. Under **Channel Type** select email (**Note: Cloud.gov does not support other channel types**)
6. Under **SMTP sender** choose **cloudgovemail**
7. Under **default recipients**, choose the email recipient group that you created earlier.

## Setting up an alert

To receive alerts, you must create a monitor that will trigger the alert when the specified conditions are met.

### Creating a monitor

A monitor allows you to specify multiple conditions, and it can send alerts to different notification channels based on those conditions.

1. From the OpenSearch navigation menu, select **Alerting** under **OpenSearch Plugins**
2. Select **Monitors**, then click **Create Monitor**
3. Give the monitor a descriptive name.
4. Choose a monitor type from the list of available options below.

  - **per query**: Runs a query and generates alert notifications based on the matching criteria. See [Per query monitors](https://OpenSearch.org/docs/latest/observing-your-data/alerting/per-query-bucket-monitors/) for information about creating and using this monitor type.
  - **per document**: Runs a query (or multiple queries combined by a tag) that returns individual documents that match the alert notification trigger condition. See [Per document monitors](https://OpenSearch.org/docs/latest/observing-your-data/alerting/per-document-monitors/) for information about creating and using this monitor type.
  - **composite monitor**: Runs multiple monitors in a single workflow and generates a single alert based on multiple trigger conditions. See [Composite monitors](https://OpenSearch.org/docs/latest/observing-your-data/alerting/composite-monitors/) for information about creating and using this monitor type.

5. Select the desired timeframe under **Schedule**
6. Under **index** put `logs-app*` (the `*` wildcard index pattern means that that the separate indices for every day will be searched, e.g. `logs-app-2024-04-17`)
7. Fill out **Query** referring to Monitor Types for your chose monitor
8. Create a **Trigger**, this can be for any alert condition or specific queries/tags.
9. Under **Actions** fill out the notification info.
10. When the trigger is activated next, it will notify users.

### High Memory Usage Example
Here is an example of putting a monitor on memory usage of a test app.
{% image "_img/content/opensearch-memory-alerting-query.png" "Screenshot of Dashboards interface showing dashboard selection" %}
The metric is MAX OF containermetric.memory_bytes and the app is specified.
You can see a graph for monitor performance, this shows the value for that field over the last few datapoints (in this example it is 6 points seperated by 30 minutes), So we know the average is about 170,000,000

{% image "_img/content/opensearch-reporting.png" "Screenshot of Dashboards interface showing dashboard selection" %}
This alert will trigger if the value of the containermetric.memory_bytes field is above 177000000 whenthe query is triggered.