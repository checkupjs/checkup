# Contributing to Checkup

The Checkup project is run by community members who want to build tools that provide insights to improve projects. We welcome any contributions to this effort.

The Open Source Guides website has a collection of resources for individuals, communities, and companies who want to learn how to run and contribute to an open source project. Contributors and people new to open source alike will find the following guides especially useful:

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Building Welcoming Communities](https://opensource.guide/building-community/)

## Bugs

We use [GitHub Issues](https://github.com/checkupjs/checkup/issues) for bugs. If you would like to report a problem, take a look around and see if someone already opened an issue about it. If you a are certain this is a new, unreported bug, you can submit a bug report.

## Pull Requests

### Your First Pull Request

Working on your first Pull Request? You can learn how from this free video series:

[**How to Contribute to an Open Source Project on GitHub**](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

### Sending a Pull Request

Small pull requests are much easier to review and more likely to get merged. Make sure the PR does only one thing, otherwise please split it.

Please make sure the following is done when submitting a pull request:

1. Fork [the repository](https://github.com/checkupjs/checkup) and create your branch from `master`.
1. Make sure to [test your changes](#running-tests)!
1. Make sure your Jest tests pass (`yarn test`).

All pull requests should be opened against the `master` branch.

#### Breaking Changes

When adding a new breaking change, follow this template in your pull request:

```md
### New breaking change here

- **Who does this affect**:
- **How to migrate**:
- **Why make this breaking change**:
- **Severity (number of people affected x effort)**:
```

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/checkupjs/checkup.git
   ```

1. Change into that directory, and install dependencies by running `yarn install` (this will install all dependencies for all packages via yarn workspaces):

1. Build the project by running `yarn build`

## To run Checkup in a project

1. Add required dependencies to package.json:

   ```
     "devDependencies": {
       "@checkup/cli": "0.0.0",
       ...
     }
   ```

1. Run Checkup's config generator to generate a checkup config:

   ```shell
   checkup generate config
   ```

1. Execute Checkup in your project

   ```shell
   checkup .
   ```

### Running a specific Checkup task in your project

To run a specific task:

```
checkup --task TASK_NAME
```

## Running tests

To run tests in the checkup repository:

```
yarn test
```

## Using the DEBUG environment variable

Checkup using the debug package to provide useful information for debugging. You can enable it by running:

```shell
DEBUG='*' checkup
```

To filter the output of debug to show information coming from checkup, you can run: 
```shell
DEBUG='checkup*' checkup
```


## Debugging tests

cd into the specific package you want to debug, then run:

```
node --inspect-brk ../../node_modules/.bin/jest --runInBand
```
