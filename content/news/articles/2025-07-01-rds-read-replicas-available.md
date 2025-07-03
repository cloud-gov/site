---
layout: layouts/post
tags: news
title: Read replicas now available for RDS databases
date: 2025-07-01
excerpt: "Add a read replica for your RDS databases to handle read-only workloads"
---

The Cloud.gov team is excited to announce support for adding read replicas to your databases.

A read replica is a [read-only copy of your database which automatically replicates the data in your primary database](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html). You can offload read-heavy tasks to a read replica while your primary database handles writes. Isolating read operations to the replica reduces the load and lock contention on your primary database.

Use cases for a read replica include:

- Generating reports from your data
- Serving data for API requests
- Performing analytics queries

## How to create a read replica

To create a new database service with a read replica:

```shell
cf create-service aws-rds micro-psql-replica <your-service-name>
```

To update an existing database to a read replica plan:

```shell
cf update-service <your-service-name> -p micro-psql-replica
```

> **Note:** `micro-psql-replica` is just an example of a service plan that supports database replicas. If you are updating an existing service to add a read replica, you should use the replica plan corresponding to your current database service (e.g. for databases currently using `medium-gp-psql*` plans, use the `medium-gp-psql-replica` plan).
>
> To see the list available of replica plans (which all end in `-replica`):
>
> ```shell
> cf marketplace -e aws-rds
> ```

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

Once you have created or updated a service with a read replica, you need to bind that service to an application to get the credentials to access it. If the service is already bound to an application, you will need to un-bind and then re-bind the service to the application.

```shell
cf unbind-service <app-name> <your-service-name> # if service is already bound to an app
cf bind-service <app-name> <your-service-name>
# make sure to restage for replcia credentials to be available to the app
cf restage <app-name> --strategy rolling
```

You can also [create a service key](https://cli.cloudfoundry.org/en-US/v8/create-service-key.html) to get the credentials for accessing your read replica:

```shell
cf create-service-key <your-service-name> <service-key-name>
```

After you have bound the service to an application or created a service key, then you can inspect the bound credentials:

```shell
cf env <app-name> # view bound services and their credentials for an app
cf service-key <your-service-name> <service-key-name> # view contents of a service key
```

The bound credentials for a database with a read replica should include:

- `replica_uri`: a full URI for connecting to your read replica database.
- `replica_host`: the host for connecting to your read replica database. The `replica_host` can be used in combination with the other properties (`username`, `password`, `db_name`, `port`) to connect to the read replica database.

Using these properties in your application code or other tools, you should be able to connect to your read replica database and use it. **Remember that read replica databases are read-only, so you cannot write to them**.
