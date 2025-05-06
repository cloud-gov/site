---
layout: layouts/post
tags: news
title: Audit events now available in Cloud.gov logging system
date: 2025-05-07
excerpt: "Use audit events in the Cloud.gov logging system to monitor activity on your resources"
---

Audit events are recorded by the Cloud.gov platform [to track activity against any resource (e.g. users, services, apps, organizations, and more)](https://docs.cloudfoundry.org/running/managing-cf/audit-events.html#types).

While audit events can be [queried from the platform via an API](https://docs.cloudfoundry.org/running/managing-cf/audit-events.html#querying), [they are only retained by the platform for 31 days by default](https://docs.cloudfoundry.org/running/managing-cf/audit-events.html#considerations).

To simplify customer access to audit events and to satisfy [M-21-31 guidelines][m-21-31] for the retention of these logs, audit events are now available in the [Cloud.gov logging system][logs].

## How to search audit events in the logging system

Audit events are all ingested into the logging system with a value of `@type: audit_event`, which provides an easy way to filter for them.

To find your audit events in the logging system:

1. Log in to the [logging system][logs]
2. Click on "Discover" in the left sidebar menu
3. Add a filter for `@type: audit_event` to your log search

    {% image "_img/content/add-audit-event-filter.png" "Screenshot of OpenSearch Dashboards interface showing the addition of a filter for the @type field with a value of audit_event" %}

4. Adjust the view of the results as desired

    {% image "_img/content/audit-event-results.png" "Screenshot of OpenSearch Dashboards interface showing the results of a search for audit events" %}

5. Apply additional filters on the audit event fields as desired. For example, to filter for app restart events, add a filter of `type: audit.app.restart`:

    {% image "_img/content/filter-audit-app-restart-events.png" "Screenshot of OpenSearch Dashboards interface showing a filtered search for app restart audit events" %}

## Audit event fields

The fields available on audit event records are:

- `guid` - GUID for the audit event
- `type` - the type of audit event recorded
- `actor.guid` - GUID of the actor for the event
- `actor.type` - Type of the actor for the event (e.g. user, process)
- `actor.name` - Name of the actor for the event
- `target.guid` - GUID of the target for the event
- `target.type` - Type of the target for the event (e.g. app, service)
- `target.name` - Name of the target for the event
- `data.*` - Additional information about the event. The fields are different for each `type` of event.
- `created_at` - Time when the audit event was created
- `updated_at` - Time when the audit event was last updated

## How audit events are ingested into the logging system

An automated job runs every 15 minutes to pull the audit events from the platform and ingest them into the logging system. Thus, **there could be up to a 15-minute delay** before any audit event logs appear in the logging system.

## Retention

Audit events are retained in the logging system for 12 months and in offline storage for an additional 18 months.

## Relevant NIST controls

Audit events stored in the logging system satisify NIST controls in the [`AU` control family](https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=AU), specifically:

- AU-02
- AU-11

[logs]: https://logs.fr.cloud.gov
[m-21-31]: https://www.whitehouse.gov/wp-content/uploads/2021/08/M-21-31-Improving-the-Federal-Governments-Investigative-and-Remediation-Capabilities-Related-to-Cybersecurity-Incidents.pdf
