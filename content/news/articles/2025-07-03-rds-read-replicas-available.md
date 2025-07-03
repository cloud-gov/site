---
layout: layouts/post
tags: news
title: Read replicas now available for RDS databases
date: 2025-07-03
excerpt: "Add a read replica for your RDS databases to handle read-only workloads"
---

The Cloud.gov team is excited to announce support for adding read replicas to your databases.

A read replica is a [read-only copy of your database which automatically replicates the data in your primary database](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html). You can offload read-heavy tasks to a read replica while your primary database handles writes. Isolating read operations to the replica reduces the load and lock contention on your primary database.

Use cases for a read replica include:

- Generating reports from your data
- Serving data for API requests
- Performing analytics queries

## How to create a read replica service

To create a new database service with a read replica:

```shell
cf create-service aws-rds micro-psql-replica <your-service-name>
```

To update an existing database to a read replica plan:

```shell
cf update-service <your-service-name> -p micro-psql-replica
```

See the [database service documentation]({{ site.baseurl }}/docs/services/relational-database) for more information on how to create or update database services.

Read replicas are supported for all `aws-rds` plans. To add a read replica to an existing instance, use the replica plan corresponding to its current plan. For example, an instance using the `medium-gp-psql` plan should update to `medium-gp-psql-replica`.

To see the list available of replica plans (which all end in `-replica`):

```shell
cf marketplace -e aws-rds
```

While your database service is being created or updated to add a read replica, running `cf service <your-service-name>` should report on the status of the create or update operation:

```shell
...
Showing status of last operation:
   status:    create in progress
   message:   Waiting for database to be available. Current status: in progress (attempt 6 of 60)
   started:   2025-07-01T18:28:22Z
   updated:   2025-07-01T18:28:22Z
```

## Using your read replica

Once you have created or updated a service with a read replica, you need to bind that service to an application to get the credentials to access it.

[See the database service documentation for general guidance on how to bind database services to an application]({{ site.baseurl }}/docs/services/relational-database#bind-to-an-application).

In particular, note the extra `replica_uri` and `replica_host` values that are available for any database service with a read replica.

If you updated an existing database service from a non-replica plan to a replica plan, then you will need to un-bind and re-bind that service to include the credentials for accessing the read replica. As always, when binding or re-binding a service to an application, you should then restage the application.

Using these credentials in your application code or other tools, you should be able to connect to your read replica database and use it. **Remember that read replica databases are read-only, so you cannot write to them**.
