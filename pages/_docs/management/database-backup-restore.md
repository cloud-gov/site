---
parent: management
layout: layouts/docs
sidenav: true
redirect_from:
    - /docs/apps/database-backup-restore/
title: Perform a database backup or restore
---


Use this procedure to perform a database backup or restore operation by using `cf-service-connect` to import and export data.

## Install or update plugin

This process requires the [cf-service-
connect](https://github.com/18F/cf-service-connect) plugin that folks on the
cloud.gov team have developed for Cloud Foundry.

Please make sure you have the
latest version installed before starting. If you need to update the plugin, you
need to uninstall it first before you can install the new version. To uninstall
a plugin, run this command:

```shell
cf uninstall-plugin <plugin name>
```

Then follow the installation instructions found in the plugin's documentation.

## Database backup or data export

```shell
# Target the environment you're exporting from
cf target [-o <org name>] -s <space name>

# Check to see if a SERVICE_CONNECT service key already exists
cf service-keys <service name>

# If a key exists, remove it first before starting
cf delete-service-key <service name> SERVICE_CONNECT

# In a separate shell window, connect to the service to setup a direct SSH tunnel and leave it running
# note the credentials and connection info given in the output
cf connect-to-service -no-client <app name> <service name>

# Back in the original window, dump the database
pg_dump -F c --no-acl --no-owner -f <file name> postgres://<username>:<password>@<host>:<port>/<name>

# In the window with the SSH Tunnel, close the SSH tunnel
ctrl+c

# Back in the original window, remove the SERVICE_CONNECT service key to keep things clean
cf delete-service-key <service name> SERVICE_CONNECT
```

Once these steps are complete, you may also want to upload a copy of the backup to the Drive folder.

## Database restore or data import

```shell
# Target the environment you're restoring into
cf target [-o <org name>] -s <space name>

# Check to see if a SERVICE_CONNECT service key already exists
cf service-keys <service name>

# If a key exists, remove it first before starting
cf delete-service-key <service name> SERVICE_CONNECT

# Check the current running applications
cf apps

# Unbind the database service connected to the app you're working with
cf us <app name> <service name>

# Delete the database service
cf ds <service name>

# Recreate the database service
# To see all available service plans, run cf marketplace
cf cs aws-rds <service plan> <service name>

# rebind the service to the app
cf bs <app name> <service name>

# In a separate shell window, connect to the service to setup a direct SSH tunnel and leave it running
# note the credentials and connection info given in the output
cf connect-to-service -no-client <app name> <service>

# back in the original window, restore the database
pg_restore --dbname postgres://<username>:<password>@<host>:<port>/<name> --no-acl --no-owner <file name>

# In the window with the SSH Tunnel, close the SSH tunnel
ctrl+c

# Back in the original window, remove the SERVICE_CONNECT service key to keep things clean
cf delete-service-key <service name> SERVICE_CONNECT

# Restage the app associated with the service
cf restage <app name>
```
