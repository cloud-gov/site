---
layout: layouts/post
title: "Connecting PostgreSQL RDS instance to S3"
date: 2023-02-13 00:00:00 +00:00
excerpt: You can now load data from an S3 bucket into a PostgreSQL RDS instance.
tags:
  - posts

---

This method can be used to load a large amount of data into an RDS instance running on cloud.gov and utilizes an AWS PostgreSQL S3 extension in the process described in the AWS documentation for [Importing data from S3 into RDS for PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PostgreSQL.S3Import.html).

## Prerequisites

This process, outlined in the AWS documentation, will work with your cloud.gov PostgreSQL database and S3 buckets, given the following:

* You have created a [PostgreSQL RDS database with the aws-rds broker in your space](https://cloud.gov/docs/services/relational-database/#create-an-instance).
* You have created an [S3 bucket with the s3-broker service in your space](https://cloud.gov/docs/services/s3/#how-to-create-an-instance).
* You have created a [service-key and retrieve the credentials for your S3 bucket](https://cloud.gov/docs/services/s3/#interacting-with-your-s3-bucket-from-outside-cloudgov).

## AWS S3 Extension
First you must install [the AWS S3 extension](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PostgreSQL.S3Import.html#USER_PostgreSQL.S3Import.InstallExtension). 

You will need to access the PostgreSQL database on the cli using one of the methods detailed [here](https://cloud.gov/docs/services/relational-database/#access-the-data-in-the-database).

## Information needed

Once you have installed the AWS S3 extension, you then need to gather information to provide for the PostgreSQL RDS to S3 connection function which consist of:

* The name of the table on your RDS for PostgreSQL DB instance

  This is the table into which the `aws_s3.table_import_from_s3` function is to import the data.

* The S3 bucket name
* The S3 file path
* The S3 file type
  
  These can be obtained from the service key for your S3 service. To get the credentials such as the bucket name, region and file type, these can be obtained from the service key, you can run `cf service-key <SERVICE_INSTANCE_NAME> <KEY_NAME>`; you will see a JSON description of the credentials. Treat these values as sensitive!
  
* The AWS Region: us-gov-west-1

* S3 Bucket Access Key Id and Secret obtained in your S3 service-key credentials

## Permissions

You will then [set up permissions on your RDS for PostgreSQL DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PostgreSQL.S3Import.html#USER_PostgreSQL.S3Import.Credentials) to allow access to the file on the Amazon S3 bucket using the previously obtained credentials.

## Importing data

Finally you should be able to import the data into the table you have selected by issuing the `aws_s3.table_import_from_s3` function as described [here](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PostgreSQL.S3Import.html#USER_PostgreSQL.S3Import.FileFormats).
