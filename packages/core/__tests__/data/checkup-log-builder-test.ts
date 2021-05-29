import '@microsoft/jest-sarif';
import MockDate from 'mockdate';
import { createTmpDir } from '../__utils__/tmp-dir';
import { CONFIG_SCHEMA_URL } from '../../src/config';
import CheckupLogBuilder from '../../src/data/checkup-log-builder';
import { CheckupLogBuilderArgs } from '../../src/types/checkup-log';

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
    let builder = getCheckupLogBuilder({ options: { cwd: tmp } });

    await builder.annotate();

    // arguments are non-deterministic, so we nuke them
    builder.currentRunBuilder.currentInvocation.arguments = [];

    expect(builder.log).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json",
        "runs": Array [
          Object {
            "invocations": Array [
              Object {
                "arguments": Array [],
                "endTimeUtc": "2000-01-23T00:00:00.000Z",
                "executionSuccessful": true,
                "startTimeUtc": "2000-01-23T00:00:00.000Z",
              },
            ],
            "results": Array [],
            "tool": Object {
              "driver": Object {
                "informationUri": "https://github.com/checkupjs/checkup",
                "language": "en-US",
                "name": "checkup",
                "properties": Object {
                  "analyzedFiles": FilePathArray [],
                  "analyzedFilesCount": 0,
                  "cli": Object {
                    "config": Object {
                      "$schema": "https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/schemas/config-schema.json",
                      "excludePaths": Array [],
                      "plugins": Array [],
                      "tasks": Object {},
                    },
                    "configHash": "dd17cda1fc2eb2bc6bb5206b41fc1a84",
                    "schema": 1,
                    "version": "0.0.0",
                  },
                  "project": Object {
                    "name": "fake-package",
                    "repository": Object {
                      "activeDays": "0 days",
                      "age": "0 days",
                      "linesOfCode": Object {
                        "total": 0,
                        "types": Array [],
                      },
                      "totalCommits": 0,
                      "totalFiles": 0,
                    },
                    "version": "0.0.0",
                  },
                },
                "rules": Array [],
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
      packageName: 'fake-package',
      packageVersion: '0.0.0',
      config: {
        $schema: CONFIG_SCHEMA_URL,
        excludePaths: [],
        plugins: [],
        tasks: {},
      },
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
      actions: [],
      errors: [],
    },
    args
  );

  return new CheckupLogBuilder(defaults);
}
