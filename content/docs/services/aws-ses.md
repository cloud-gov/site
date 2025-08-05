---
parent: services
title: "AWS Simple Email Service"
name: aws-ses
description: "AWS SES: Send email from verified domains using SMTP or an HTTP API."
status: "Beta"
showInSidenav: true
---

Cloud.gov offers [AWS SES](https://aws.amazon.com/ses/) as a service. SES is hosted in AWS GovCloud and supports sending emails via SMTP or the SES API.

## Usage and service plans

AWS SES currently offers one plan, `domain`. The `domain` plan supports sending email from a verified domain. You can provide a domain like `agency.gov` or allow Cloud.gov to generate a temporary domain for you.

If you provide a domain, you must create DNS records in your agency DNS system to send mail. Once the service instance is created, bind an application to it or create a service key. The binding or service key will include instructions for creating the required DNS records.

If you do not provide a domain, Cloud.gov will generate one. When generating a domain, Cloud.gov manages all DNS records, making this feature useful for testing and debugging.

For instructions on creating and binding to AWS SES service instances, examples, and the full plan and parameter reference, see [Cloud.gov Services Reference: AWS Simple Email Service](https://services.cloud.gov#aws-ses).

## Reputation protection

Cloud.gov monitors sender reputation on brokered SES identities. If bounce or complaint rates exceed a threshold, the identity's ability to send email will be disabled.

You must provide an administrative email via the `admin_email` parameter when creating an AWS SES instance. Cloud.gov will send warning notifications to this address if your identity is approaching the bounce or complaint threshold, and critical alarms if the identity has reached the threshold.

The thresholds are:

- Bounce rate, warning: 2%
- Bounce rate, critical: 4%
- Complaint rate, warning: 0.04%
- Complaint rate, critical: 0.08%

These thresholds are based on AWS SES's reputation monitoring policies. For more information about monitoring sender reputation, see the [AWS Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/monitor-sender-reputation.html).

To be notified of complaints, bounces, or successful delivery of emails sent from your identity, set `"enable_feedback_notifications": "true"` when creating your SES service instance and provide a webhook when binding. See [Cloud.gov Services Reference: AWS Simple Email Service](https://services.cloud.gov#aws-ses) for full details.

If sending is disabled on your domain, contact support@cloud.gov for help.

## Rotating credentials

Each service binding and service key creates a new IAM user with access to the identity. To rotate credentials, unbind and rebind your application to the service instance, or delete and recreate the service key.

## Feedback

AWS SES is new service currently offered as an invite-only beta. To get access to the beta, or provide feedback, email support@cloud.gov.

## The broker in GitHub

AWS SES is brokered using the [Cloud Service Broker project](https://github.com/cloudfoundry/cloud-service-broker/) from Cloud Foundry. Source code for Cloud.gov's implementation of the CSB and the SES brokerpak is [available on GitHub](https://github.com/cloud-gov/csb).
