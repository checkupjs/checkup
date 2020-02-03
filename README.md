# Checkup

> A health check on your project

Often, when building large (and ambitious) applications, the state of the code is almost in constant flux. This is a good thing, and is indicative of a healthy, maintained application. The dark side to this can be the app feeling like it's constantly in a half state - migrations from old APIs to new are taking place, patterns are being reinvented and rolled out, and tests are being created and maintained (and sometimes 😱 skipped). Keeping track of all these ongoing changes in your codebase can be challenging.

Checkup aims to provide you with insights into your codebase. You can see things like dependencies, types used, test types used, etc. allowing you to have a more full, high level view of your codebase at any one point in time. This will help you with making maintenance decisions, charting progress of migrations, and keeping up with the general health of your codebase.

## Goals

1. Give constant insights into the historical and current state of your codebase
1. Provide a mechanism to customize the data you want to gather within the codebase
1. Enable health checkups to ensure that an application or addon is adhering to required standards
1. Monitor migrations as they progress, helping you estimate the scope of migration tasks

## What Checkup Does

Checkup is a set of tools to allow you to achieve the goals outlined above. It includes:

- A CLI to perform static analysis across your application or addon
- A plugin infrastructure, which allows you to write your own Checkup tasks based on your organization's needs
- A set of recommended tasks based on best practices that you can configure to run by default
- A generated report on the health of your application or addon
- A dashboard to visualize the data

### Extensibility

Checkup includes a plugin system, which allows you to author tasks to be run by checkup that will gather data for your application or addon based on your organization's needs. This can be things like:

- Ensuring applications use required dependencies
- Ensuring an application's dependency versions are at least a certain version
- Tracking migration statuses

### Health Check

By default, Checkup comes with some recommended tasks that can be run to ensure your application is adhering to specific standards.

- Ensuring dependency freshness
- Validating required dependencies
- Ensuring correct linting plugins are part of the project
- Ensuring correct types and versions of tools are installed

### Recommended Fixes

Checkup, as part of its reporting, will alert on specific fixes that should be undertaken. These fixes will include a severity, which will help identify what problems should be addressed first, and in what order.

### Migration Management

Migrations can be a long and tedious process, but are a normal part of a project’s life cycle. Checkup aims to provide information on the status of migrations, which can serve a number of purposes.

- Giving a level of visibility to the progress of all migrations
- Tracking the completion of a migration
- Helping to assist in the estimation of the duration of a migration

## Summary

While Checkup isn’t a silver bullet, bringing visibility to the ongoing health of a project will help enable teams to make informed decisions about where to invest their precious time and resources.
