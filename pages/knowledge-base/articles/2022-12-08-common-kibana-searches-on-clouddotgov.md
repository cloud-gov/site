---
layout: layouts/post
title: "Understanding Kibana and how to visualize your application logs"
date: 2022-12-08 00:00:00 +00:00
excerpt: This article briefly explains what Kibana does, what types of logs are available in Kibana, and how to create log visualizations in Kibana.
tags:
  - posts
---

## What does Kibana do?

Kibana is a user interface that lets you search and visualize your application logs. Kibana has a [user guide](https://www.elastic.co/guide/en/kibana/current/index.html) that explains more about how to use it and to create custom visualizations.

## What are some types of logs?

Cloud Foundry assigns a type to each log message depending on its origin. Application logs are assigned the APP log type.  HTTP requests being routed to an app will produce the RTR log type. The various types of logs are listed in the documentation [here](https://docs.cloudfoundry.org/devguide/deploy-apps/streaming-logs.html#format).

Cloudfoundry logs are often translated into field names in Elasticsearch/Kibana using the log type as a prefix. For example, APP logs in Kibana include fields like `app.name` for the application name.

## How to visualize application traffic

Router log data can be used to create a visualization of your application traffic following the steps below. 

After you have logged into Kibana, click "Discover" in the left sidebar menu. Then, add filters and search terms to query for router logs as seen in the screenshot below. Please note that the filters shown here for a specific space and application are just an example. You might want to view logs for all requests to application in a given space, in which case you would not want a filter for `@cf.app`.  

![Screenshot of Kibana interface showing a query for router logs for a given CloudFoundry space and application](https://user-images.githubusercontent.com/104385372/207403558-68266274-af72-43e1-b869-c9ad1805adca.png)

The next step is to visualize your search results based on a specific field. To visualize request logs over time, choose the `@timestamp` field from the left sidebar of "Available fields". Then, click "Visualize".

![Screenshot of Kibana interface showing the selection of @timestamp as field to use for visualizing request logs](https://user-images.githubusercontent.com/104385372/207403643-d2aa8bb8-702b-4aee-a028-baa7caf25fee.png)


By default, visualizing logs based on `@timestamp` will produce a histogram chart. To change the chart type to line, which might be more useful for this type of data, click the "Metrics & axes" link in the chart configuration panel on the right side of the screen. Then, under "Metrics" and "Count", select "Line" from the "Chart type" drop-down. Finally, click the "Update" button at the bottom right of the screen and the chart should update to a line chart.

![Screenshot of Kibana visualization interface showing a line chart of requests over time with a panel for chart configuration options visible on the right side of the screen. In the chart configuration options, "line" is selected as the chart type](https://user-images.githubusercontent.com/104385372/207403815-9f98ff91-6c1a-4f87-97ea-bd60e285ec49.png)


## Fields for router requests

Listed below are the explanations of some field names for router (RTR) logs:

* **rtr.app.id**: The application guid
* **rtr.hostname**: The domain/hostname the request was sent to (e.g test.app.cloud.gov)
* **rtr.http_user_agent**: What user agent the request came from (Chrome, Firefox, Curl, etc…)
* **rtr.path**: The specific url path that was requested (e.g. /my/test/page)
* **rtr.status**: Gives the status of the request (200, 404, etc…)
* **rtr.verb**: The type of request (POST, GET, etc...)
* **rtr.x_forwarded_for**: The IP address the request came from
* **rtr.timestamp**: The time of the request in UTC

The full list of fields available for router logs can be found in [our Elasticsearch field mapping configuration](https://github.com/cloud-gov/logsearch-for-cloudfoundry/blob/develop/jobs/elasticsearch-config-lfc/templates/component-index-mappings-app.json.erb#L38).
