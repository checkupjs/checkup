<p align="center">
  <img src="docs/logo.png" alt="checkup" width="25%" />
</p>

<p style="font-style: italic; font-size: 20px; margin-bottom: 20px">Use static analysis and gain insights to help drive maintenance decisions</p>

![CI Build](https://github.com/checkupjs/checkup/workflows/CI%20Build/badge.svg)
[![License](https://img.shields.io/npm/l/@checkup/cli.svg)](https://github.com/checkupjs/checkup/blob/master/package.json)
![Dependabot](https://badgen.net/badge/icon/dependabot?icon=dependabot&label)
![Volta Managed](https://img.shields.io/static/v1?label=volta&message=managed&color=yellow&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAeQC6AMEpK7AhAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH5AMGFS07qAYEaAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFmSURBVDjLY2CgB/g/j0H5/2wGW2xyTAQ1r2DQYOBgm8nwh+EY6TYvZtD7f9rn5e81fAGka17GYPL/esObP+dyj5Cs+edqZsv/V8o//H+z7P+XHarW+NSyoAv8WsFszyKTtoVBM5Tn7/Xys+zf7v76vYrJlPEvAwPjH0YGxp//3jGl/L8LU8+IrPnPUkY3ZomoDQwOpZwMv14zMHy8yMDwh4mB4Q8jA8OTgwz/L299wMDyx4Mp9f9NDAP+bWVwY3jGsJpB3JaDQVCEgYHlLwPDfwYWRqVQJgZmHoZ/+3PPfWP+68Mb/Pw5sqUoLni9ipuRnekrAwMjA8Ofb6K8/PKBF5nU7RX+Hize8Y2DOZTP7+kXogPy1zrH+f/vT/j/Z5nUvGcr5VhJioUf88UC/59L+/97gUgDyVH4YzqXxL8dOs/+zuFLJivd/53HseLPPHZPsjT/nsHi93cqozHZue7rLDYhUvUAADjCgneouzo/AAAAAElFTkSuQmCC&link=https://volta.sh)
![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)
[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](#badge)

Checkup is a framework that uses static analysis and gain insights to help drive maintenance decisions. It provides a framework to run **tasks** to gather information about the craftsmanship and quality of your codebase. Task results are output as [SARIF](https://sarifweb.azurewebsites.net/), which provides a consistent schema for data processing, and can be integrated into your development workflow through IDE integrations.

<img src="docs/checkup-run-output.png" alt="Checkup summary output" style="margin: 20px 0" />

Checkup allows you to determine the important information you care about, and provides the infrastructure to gather and output that data.

Tasks can gather insights on things like

- **Code structure** - to give shape to your project, which can help you understand the codebase and identify areas of improvement
- **Dependency health** - such as which dependency versions are out of date, or outside supported ranges
- **Test health** - to identify types of tests used, which tests are being skipped, and what the [shape](https://martinfowler.com/articles/2021-test-shapes.html) of the test infrastructure is
- **API compatability** - to identify which APIs are being used, and which are not
- **Migration status** - to give practical insight into how your codebase is being migrated
- Anything else you can dream up... :bulb:

## Features

- **Task Runner CLI** - A [CLI](packages/cli/README.md) that runs tasks that can be loaded via plugins.
- **Code Generators** - A collection of generators allowing you to generate a checkup **config** file, **plugin** project structure, and **task** files and tests.
- **Plugins** - Existing plugins for **JavaScript**, **Ember**, and **Ember Octane**.

## Installation

To install Checkup, run the following command:

```bash
$ npm install @checkup/cli
```

## Usage

See the [CLI README](packages/cli/README.md) for information on usage.

## Contributing

To contribute, please read the [CONTRIBUTING](CONTRIBUTING.md) guidelines.

## Spec

Read more about the mission, vision, and overall direction of checkup in the [spec](docs/SPEC.md) document.
