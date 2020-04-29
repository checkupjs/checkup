# Checkup: A health checkup for your project

![CI Build](https://github.com/checkupjs/checkup/workflows/CI%20Build/badge.svg)
[![License](https://img.shields.io/npm/l/@checkup/cli.svg)](https://github.com/checkupjs/checkup/blob/master/package.json)
![Dependabot](https://badgen.net/badge/icon/dependabot?icon=dependabot&label)
![Volta Managed](https://img.shields.io/static/v1?label=volta&message=managed&color=yellow&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAeQC6AMEpK7AhAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH5AMGFS07qAYEaAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFmSURBVDjLY2CgB/g/j0H5/2wGW2xyTAQ1r2DQYOBgm8nwh+EY6TYvZtD7f9rn5e81fAGka17GYPL/esObP+dyj5Cs+edqZsv/V8o//H+z7P+XHarW+NSyoAv8WsFszyKTtoVBM5Tn7/Xys+zf7v76vYrJlPEvAwPjH0YGxp//3jGl/L8LU8+IrPnPUkY3ZomoDQwOpZwMv14zMHy8yMDwh4mB4Q8jA8OTgwz/L299wMDyx4Mp9f9NDAP+bWVwY3jGsJpB3JaDQVCEgYHlLwPDfwYWRqVQJgZmHoZ/+3PPfWP+68Mb/Pw5sqUoLni9ipuRnekrAwMjA8Ofb6K8/PKBF5nU7RX+Hize8Y2DOZTP7+kXogPy1zrH+f/vT/j/Z5nUvGcr5VhJioUf88UC/59L+/97gUgDyVH4YzqXxL8dOs/+zuFLJivd/53HseLPPHZPsjT/nsHi93cqozHZue7rLDYhUvUAADjCgneouzo/AAAAAElFTkSuQmCC&link=https://volta.sh)
![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)
[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](#badge)

Checkup aims to provide you with insights into your codebase. You can track the progress of your codebase for things such as:

1. **Insights**
   - types of code constructs used (types, etc)
   - dependency health
   - test type breakdown (unit, integration, functional, visual, etc)
1. **Migrations**
   - chart the progress of active code migrations to help you get a sense of progress
1. **Recommendations**
   - suggested areas of improvement

This allows you to have a more full, high level view of your codebase at any one point in time. Checkup can help you with making resourcing decisions, planning and prioritizing the general health of your codebase.

## What you get with Checkup

Checkup provides you with a CLI, which can be run against your code base. Using a custom Checkup configuration file, **plugins** can be configured and loaded containing **tasks** to run. The CLI will execute these tasks on your codebase, ultimately aggregating and producing a comprehensive **Checkup report**.

## Usage

See the [CLI README](packages/cli/README.md) for information on usage.

## Installation and Contributing

To contribute to Checkup, you'll need to clone and setup the repository. See the [installation](CONTRIBUTING.md#installation) documentation to start. To contribute, please read the [CONTRIBUTING](CONTRIBUTING.md) guidelines.

## Spec

Read more about the mission, vision, and overall direction of checkup in the [spec](docs/SPEC.md) document.
