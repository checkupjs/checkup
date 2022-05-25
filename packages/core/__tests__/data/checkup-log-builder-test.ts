import '@microsoft/jest-sarif';
import MockDate from 'mockdate';
import { createTmpDir } from '../__utils__/tmp-dir';
import { CONFIG_SCHEMA_URL } from '../../src/config';
import CheckupLogBuilder from '../../src/data/checkup-log-builder';
import { CheckupLogBuilderArgs } from '../../src/types/checkup-log';

const DEFAULT_CONFIG = {
  $schema: CONFIG_SCHEMA_URL,
  excludePaths: [],
  plugins: [],
  tasks: {},
};

describe('checkup-log-builder-test', () => {
  let tmp: string;

  beforeEach(() => {
    tmp = createTmpDir();
    MockDate.set('2000-01-23');
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('builds a default Checkup log', async () => {
    let builder = getCheckupLogBuilder({
      options: { cwd: tmp },
      analyzedPackageJson: { name: 'fake-package', version: '0.0.0' },
    });

    await builder.annotate({
      config: DEFAULT_CONFIG,
      actions: [],
      errors: [],
      timings: {},
      executedTasks: [],
    });

    // arguments are non-deterministic, so we nuke them
    builder.currentRunBuilder.currentInvocation.arguments = [];

    expect(builder.log).toMatchInlineSnapshot(`
      {
        "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json",
        "runs": [
          {
            "invocations": [
              {
                "arguments": [],
                "endTimeUtc": "2000-01-23T00:00:00.000Z",
                "executionSuccessful": true,
                "startTimeUtc": "2000-01-23T00:00:00.000Z",
              },
            ],
            "results": [],
            "tool": {
              "driver": {
                "informationUri": "https://github.com/checkupjs/checkup",
                "language": "en-US",
                "name": "checkup",
                "properties": {
                  "checkup": {
                    "analyzedFiles": FilePathArray [],
                    "analyzedFilesCount": 0,
                    "cli": {
                      "config": {
                        "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/schemas/config-schema.json",
                        "excludePaths": [],
                        "plugins": [],
                        "tasks": {},
                      },
                      "configHash": "dd17cda1fc2eb2bc6bb5206b41fc1a84",
                      "schema": 1,
                      "version": "2.0.0-beta.0",
                    },
                    "project": {
                      "name": "fake-package",
                      "repository": {
                        "activeDays": "0 days",
                        "age": "0 days",
                        "totalCommits": 0,
                        "totalFiles": 0,
                      },
                      "version": "0.0.0",
                    },
                    "timings": {},
                  },
                },
                "rules": [],
              },
            },
          },
        ],
        "version": "2.1.0",
      }
    `);
    expect(builder.log).toBeValidSarifLog();
  });
});

function getCheckupLogBuilder(args: Partial<CheckupLogBuilderArgs> = {}) {
  let defaults: CheckupLogBuilderArgs = Object.assign(
    {},
    {
      analyzedPackageJson: {},
      options: {
        paths: ['.'],
        config: undefined,
        excludePaths: undefined,
        cwd: process.cwd(),
        categories: undefined,
        groups: undefined,
        tasks: undefined,
        listTasks: false,
      },
    },
    args
  );

  return new CheckupLogBuilder(defaults);
}
