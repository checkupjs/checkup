# Checkup

> A health check for your project

# Mission & Vision

Visibility to the ongoing health of a project to help enable developers and teams to make informed decisions about where to invest their precious time and resources.

# Motivation

Often, when building large (and ambitious) applications, the state of the code is almost in constant flux. This is a good thing, and is indicative of a healthy, maintained application. The dark side to this can be the app feeling like it's constantly in a half state - migrations from old APIs to new are taking place, patterns are being reinvented and rolled out, and tests are being created and maintained (and sometimes 😱 skipped). Keeping track of all these ongoing changes in your codebase can be challenging.

Checkup aims to provide you with insights into your codebase. You can see things like dependencies, types used, test types used, etc. allowing you to have a more full, high level view of your codebase at any one point in time. It also allows consumers to author plugins, providing an extensibility mechanism to address varied needs. This will help you with making maintenance decisions, charting progress of migrations, and keeping up with the general health of your codebase.

# Key Ideas

## Provide Project Information

Knowledge is power. Checkup wants to give you constant insights into the current and historical state of your codebase.

## Provide Health Checkups

Balancing priorities in technical teams can be a challenge; there's always trade-offs. Checkup wants to provide health checks on your project to ensure that it's adhering to required standards (whatever those may be!).

## Allow for Extensibility

Checkup wants to provide a mechanism to customize the data you want to gather within the codebase. This will allow consumers more control over what they want to track based on what it means to them.

## Help Quantify the Cost of Migrations

A healthy codebase is in constant flux as new libraries and APIs are moved out and brought in. While this is a signal of active investment in your codebase, it can also feel like they code never 'settles'. Checkup won't change this, but it _will_ help monitor migrations as they progress, making them feel more finite. Additionally, charting the progress of those migrations can help with estimating overall duration and costs.

## Features
1. The cli supports configurability and the dynamic nature of all possible use cases
  - Consumers can add a configuration directly to their repository
  - External configuration can be provided that can be used for 1..n repositories
  - Checkup will provide example configs (and/or generators to help create a config)
  - There will be a single location for configuration to serve the entire application
2. A mechanism to create custom tasks && plugins and to plug them into the cli
  - Checkup will provide:
    - Generators to assist in the creation of new tasks && plugins
    - A testing framework for tasks (required)
    - Documentation for tasks (required)
  - Schema for prioritization of tasks
  - [optional enhancement] Nested plugins
3. A public API (to run checkup programmatically)
4. A reporting mechanism to display data in a consumable way
  - The reporting will offer multiple levels of abstraction (full detail, roll-up, summary)
  - The ability to display in JSON, PDF, HTML, console output (potentially separate reporting modules for each)
  - [optional enhancement] A plug and playable reporting module system, that will allow users to swap out default report for a more customized experience
  - [optional enhancement] A generator that creates a reporting scaffold to allow for simple customization of reporting

# Detailed Design

## What Checkup Does

At its core, Checkup is an aggregator of data derived from your project. It runs Tasks, which gather information from disparate sources, and presents that data in an easy-to-read format. You can think of Checkup as a 10,000ft view of your project, where you can visualize its changes in the moment and over time.

Functionality wise, Checkup contains the following:

- A generic CLI to perform static analysis across your application or addon
- A set of recommended tasks based on best practices that you can configure to run by default
- A plugin infrastructure, which allows you to write your own Checkup tasks based on your organization's needs
- A generated report on the health of your application or addon
- A dashboard to visualize the data

## Terminology

**project**: A directory containing source code, such as a Github repository, React project direction (generated from create-react-app), or an Ember.js application or addon.

**task**: A Checkup action that is used to statically inspect a project for the purpose of gathering data to summarize.

**task source**: The type of source code inspected by a task and used to gather information from.

**plugin**: A package of code authored outside of Checkup's core functionality, that extends or enhances functionality.

## Checkup CLI Overview

At its core, Checkup is a CLI that can be run against a project directory. That CLI has a few features that allow its execution to be tailored to your needs:

To run checkup against your project

```shell
checkup .
```

To output JSON

```shell
checkup . --json
```

To run a specific task

```shell
checkup . --task project-info
```

## Checkup Core

The core of Checkup will contain some necessary interfaces, types, and classes for plugin authors (see below for more information on plugins).

### Tasks

`Tasks` are the main building block of Checkup. They should provide a thin, simple interface that allows consumers to author tasks in the most straightforward manner.

Tasks fall into one of two categories:

#### `JSON`

A JSON task is used to read JSON files, whether project information files (such as `package.json`), or configuration files (such as `.eslinrc.json` and the like). These tasks simply gather information from disparate sources to aggregate into a report.

#### `Lint`

Lint based tasks use underlying linting rules to gather data from source code, ultimately aggregating the results of multiple rules for reporting.

The relationship between lint rules and checkup can be describe as the following:

- A Checkup `Task` may use one or more lint rules
- Lint rules are not aware of Checkup `Tasks`
- Lint rules may be used in conjunction with Checkup Tasks

It's likely that we'll want to use specific lint rules both in Checkup and configured to run in a project. Again, Checkup's role is one of a data aggregator, and lint rules provide more fine-grained, actionable guidance on changes within source code.

### Results

`Tasks` return `Results`, which are in turn formatted for output based on what data they return.

### Output

`Results` are aggregated from `Tasks`, formatted, and output depending on their target. Output can be any of `console`, `JSON`, `PDF`, or `HTML`.

## Checkup External Plugins

In most cases, Checkup will accept most tasks, but may not configure them to run by default. Having a broad library from which to select tasks is a powerful way to satisfy a multitude of use cases.

There may be certain situations where tasks may _not_ be accepted as part of the project's internal plugins.

- Organization specific

  Any plugins that are specific to an organization may not make sense to include as part of checkup directly. Ensuring that specific internal APIs are used the correct way, for instance, may be a concern best left to consuming organizations.

- External library specific

  Plugins that are specific to external libraries, such as `ember-concurrency` for example, may be best left as externally authored plugins that are ultimately configurable.

## Configuration

Projects are likely to require different configurations for their tasks. While it's likely that Checkup would provide a set of recommended tasks, consumers should be able to configure the tasks they want to write with minimal effort.

## Health Checkups

Checkup aims to provide a combination of Core tasks and External tasks (via plugins) to configure Health Checkups for your project. These health checkups, when run on-demand, provide a snapshot view of the project and its associated characteristics.

Using the above as a building block, there's a number of applications for running Health Checkups:

1. ### Scheduled Checkups

   On-demand Health Checkups can be scheduled at a desired cadence in order to get a periodic view of your project. An example of this could be scheduling a nightly cron job to clone/checkout the repository via git, run `checkup` on that repository, and report the result either via an email with attached PDF report, or persisting that data to a data store.

1. ### Multiple Checkups

   Multiple checkups could be performed across a number of repositories, giving a broad view of a number of projects. You could imagine using this in conjunction with a site like https://emberobserver.com/, which aims to provide a overview of quality and sustainability for projects in the Ember ecosystem.

1. ### Health Dashboard

   Ultimately, being able to view Checkup information over time would give the best overview of a project as it progresses over time. Checkup's goal is to provide a dashboard, which will allow consumers to view and filter data to gain valuable insights. This type of advanced filtering is best suited to a web-based application.

## Migrations

Managing migrations as they progress is a key ingredient of maintainability in a project. Checkup's Tasks can be written to monitor the rate of completion of migrations as they progress through a system. By authoring custom plugins that contain Tasks targeted at these migrations, teams can chart progress, estimate completion, and help drive resourcing decisions.

Converting an application to Ember Octane, for example, can be monitored to track progress, and report on completion. This is particularly powerful for large applications where it's expected that the codebase will be in a 'half state' for a significant amount of time during the migration. Giving insight into progress can be a powerful tool in driving changes through a system.

# Use Cases

1. Run checkup against a single application at the top level with an in-repo config
2. Run checkup against a subset of a single application with an in-repo config
3. Run checkup against an application(s) as an external observer (with a custom external config)
4. Infrastructure to configure a mechanism to store historical insights over time into the changing state of an application
5. Assimilating information about the state of an application into a format understandable by all

# Personas (what they need from checkup)

1. Developers - engineers working in the application *want to* **gain more understanding of the quality of the code they're responsible for**
  - Detailed & _actionable_ insights into the state of the part of the codebase they care about
  - Historical context on the growth/changes within their area of the app
  - Current status of active migrations they are responsible for
  - Broad view of the linting summary of their codebase
  - Awareness on newest best practices
  - A tool to help them communicate with personas 2-4 and prioritize work accordingly

2. Eng Managers - managers who manages developers working in the app *want to* **make more informed decisions around prioritization of craftsmanship and code quality initiatives**
  - Insights into areas of deficiency in the app
  - Most of the requirements for persona 1 apply here, but at a more high level view
  - An understanding of how deficiencies affect developer velocity, and how to prioritize various issues

3. Internal Stakeholders - individuals who care about the high level quality of a given application (with little to no context on the technology used in the app) *want* **a simple and comprehensive tool to provide insights into the overall quality of the application**
  - To be able to trust the heuristics we provide to ascertain the quality and stability of the app
  - "Cheerleader" for the importance of checkup
  - "Checkup award"

4. External Observers - groups that want insight into the quality of an application (Foundation teams, Ember Observer, etc.) *want* **a consumable and reliable sorce of truth to measure the quality of an application**
  - Organized insights into an application(s) they have no context on
  - Onboarding to application for the sake of debugging/consulting


# How We Teach This

Checkup in and of itself isn't a complex concept to understand: you execute a command via the CLI against a project, and get a report. The key is ensuring that Checkup becomes a part of the development life cycle.

We should consider promoting Checkup as a tool for the Ember community primarily, but its application stretches past any one framework.

# Alternative Designs

Checkup was originally planned to be an `ember-cli` command, allowing for tight integration into the Ember ecosystem. In order to allow for the `checkup` command to be run without requiring either `ember-cli` or Checkup itself to be installed as dependencies, it was decided to extract it to be more generic.

Checkup's original PoC also included a custom AST traversal mechanism. It became clear during implementation, and thinking about the role of Checkup with regards to project Linting that there was more in common than not. Additionally, the relationship between Checkup and Linting is more symbiotic; Checkup tasks utilize Linting, but are not replacements for Linting - they should be used in conjunction but for different purposes.
