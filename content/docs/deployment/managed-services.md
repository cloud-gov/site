---
title: Managed services
parent: deployment
layout: layouts/docs
sidenav: true
redirect_from:
  - /docs/apps/managed-services/
  - /overview/pricing/managed-services
  - /overview/pricing/other-services/
---

Managed services provide applications with on-demand access to services outside of the stateless application environment. Typical managed services include databases, queues, and key-value stores.

## List services

To create a service instance and binding for use with an application, you first need to identify the available services and their respective plans.

```shell
cf marketplace
```

See [the services guide]({{ site.baseurl }}/docs/services/intro) as well.

## Create a service instance

Target the org and space which will hold the app to which the service instance will be bound.

```shell
cf target -o ORG -s SPACE
```

Create a new service instance by specifying a service, plan, and a name of your choice for the service instance. Note that service instance names must be unique and can be renamed. For some services, you'll need to include additional parameters in your create-service command -- refer to [the services guide]({{ site.baseurl }}/docs/services/intro) for details.

```shell
cf create-service SERVICE_NAME PLAN_NAME INSTANCE_NAME
```

## Sharing service instances

Sharing of service instances allows users to share service instances between spaces inside their organization as a way to consolidate service instance usage and avoid data duplication in their service instances.  Users need to be aware that sharing service instances between spaces has limitations and can expose data in those service instances across environment boundaries.  Please see [Sharing Service Instances](https://docs.cloudfoundry.org/devguide/services/sharing-instances.html) for more information on limitations and security concerns.

```shell
cf share-service SERVICE-INSTANCE -s OTHER-SPACE [-o OTHER-ORG]
```

## Bind the service instance

For services that apply to an application ([Elasticsearch]({{ site.baseurl }}/docs/services/aws-elasticsearch), [Redis]({{ site.baseurl }}/docs/services/aws-elasticache), [relational databases (RDS)]({{ site.baseurl }}/docs/services/relational-database), and [S3]({{ site.baseurl }}/docs/services/s3)), the service instance must be bound to the application which will access it. (The [CDN service]({{ site.baseurl }}/docs/services/cdn-route), [identity provider]({{ site.baseurl }}/docs/services/cloud-gov-identity-provider), and [service account]({{ site.baseurl }}/docs/services/cloud-gov-service-account) have different instructions, available in their service documentation.)

Binding to an application can be done in a single step by adding a binding to the application's `manifest.yml`, for example:

```yaml
---
applications:
- name: app
  command: node app.js
  services:
   - myapp-elasticsearch
```

A service binding will be created with the next `cf push`.

Alternatively, a service instance can also bound to an existing application via the `cf` CLI:

```shell
% cf bind-service APPLICATION INSTANCE_NAME
```

Use `cf env APPLICATION` to display the application environment variables, including `VCAP_SERVICES` which holds information for each bound service. Output:

```javascript
// ...
"VCAP_SERVICES": {
  "elasticsearch-swarm-1.7.1": [
    {
      "credentials": {
        "host": "192.0.2.129",
        "hostname": "192.0.2.129",
        "name": "elasticsearch-UUID-A",
        "password": "UUID-B",
        "port": 45001,
        "url": "http://UUID-C:UUID-B@192.0.2.129:45001",
        "username": "UUID-C"
      },
      "label": "elasticsearch-swarm-1.7.1",
      "name": "myapp-elasticsearch",
      "plan": "1x",
      "tags": [
        "object store"
      ]
      // ...
    }
    // ...
  }
}
```

In this case, `url` alone could be sufficient for establishing a connection from the running application.

The contents of the `VCAP_SERVICES` environment variable contain the credentials to access your service. Treat the contents of this and all other environment variables as sensitive.

## Access the service configuration

Configuration and credentials for the bound service can be accessed in several ways:

* Manually parsing the JSON contained in the `VCAP_SERVICES` environment variable. For specifics of the `VCAP_SERVICES` format see the Cloud Foundry [environment variables documentation](http://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html#VCAP-SERVICES).
* Through a language-specific module such as [cfenv](https://www.npmjs.org/package/cfenv) for node.js.
* Through buildpack-populated environment variables as in the [Ruby buildpack](http://docs.cloudfoundry.org/buildpacks/ruby/ruby-service-bindings.html#vcap-services-defines-database-url).

### Node.js example

To access the elasticsearch service described above with a node app:

`package.json`:

```javascript
// ...
"dependencies": {
  // ...
  "cfenv": "*",
  // ...
}
// ...
```

`app.js`:

```javascript
// ...
var cfenv = require("cfenv")
var appEnv = cfenv.getAppEnv()

url = appEnv.getServiceURL("es")

var client = new elasticsearch.Client({
  host: url,
});
// ...
```

### Ruby on Rails example

`config/initializers/elasticsearch.rb`:

```ruby
# we use "production" env for all things at cloud.gov
if Rails.env.production?
  vcap = ENV["VCAP_SERVICES"]
  vcap_config = JSON.parse(vcap)
  vcap_config.keys.each do |vcap_key|
    if vcap_key.match(/elasticsearch/)
      es_config = vcap_config[vcap_key]
      es_client_args[:url] = es_config[0]["credentials"]["uri"]
    end
  end
elsif Rails.env.test?
  es_client_args[:url] = "http://localhost:#{(ENV['TEST_CLUSTER_PORT'] || 9250)}"
else
  es_client_args[:url] = ENV["ES_URL"] || "http://localhost:9200"
end
```
