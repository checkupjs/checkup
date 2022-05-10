import '@microsoft/jest-sarif';
import SarifLogBuilder from '../../src/data/sarif-log-builder.js';

describe('sarif-builder', () => {
  it('builds a default SARIF builder log', () => {
    let builder = new SarifLogBuilder();

    builder.addRun();

    expect(builder.log).toMatchInlineSnapshot(`
{
  "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json",
  "runs": [
    {
      "invocations": [],
      "results": [],
      "tool": {
        "driver": {
          "informationUri": "https://github.com/checkupjs/checkup",
          "language": "en-US",
          "name": "checkup",
          "rules": [],
        },
      },
    },
  ],
  "version": "2.1.0",
}
`);
  });

  it('can add runs to a log', () => {
    let builder = new SarifLogBuilder();

    builder.addRun();

    expect(builder.log.runs).toHaveLength(1);
  });

  it('can preload rules to a log', () => {
    let builder = new SarifLogBuilder();

    builder.addRun();

    builder.addRule({
      id: 'FOO',
    });

    builder.addRule({
      id: 'BAR',
    });

    builder.addRule({
      id: 'BAZ',
    });

    expect(builder.log.runs[0].tool.driver.rules).toHaveLength(3);
    expect(builder.log.runs).toMatchInlineSnapshot(`
[
  {
    "invocations": [],
    "results": [],
    "tool": {
      "driver": {
        "informationUri": "https://github.com/checkupjs/checkup",
        "language": "en-US",
        "name": "checkup",
        "rules": [
          {
            "id": "FOO",
          },
          {
            "id": "BAR",
          },
          {
            "id": "BAZ",
          },
        ],
      },
    },
  },
]
`);
  });

  it('can add results to a log', () => {
    let builder = new SarifLogBuilder();

    builder.addRun();

    builder.addResult({
      message: {
        text: 'THIS IS A MESSAGE',
      },
      ruleId: 'test-rule',
      level: 'error',
      kind: 'fail',
    });

    expect(builder.log).toMatchInlineSnapshot(`
{
  "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json",
  "runs": [
    {
      "invocations": [],
      "results": [
        {
          "kind": "fail",
          "level": "error",
          "message": {
            "text": "THIS IS A MESSAGE",
          },
          "ruleId": "test-rule",
          "ruleIndex": 0,
        },
      ],
      "tool": {
        "driver": {
          "informationUri": "https://github.com/checkupjs/checkup",
          "language": "en-US",
          "name": "checkup",
          "rules": [
            {
              "id": "test-rule",
            },
          ],
        },
      },
    },
  ],
  "version": "2.1.0",
}
`);
    expect(builder.log).toBeValidSarifLog();
  });

  it('can add results to a log with optional rules metadata', () => {
    let builder = new SarifLogBuilder();

    builder.addRun();
    builder.addResult(
      {
        message: {
          text: 'THIS IS A MESSAGE',
        },
        ruleId: 'test-rule',
        level: 'error',
        kind: 'fail',
      },
      {
        shortDescription: {
          text: 'This is only a test rule',
        },
        helpUri: 'http://fat-chance-youre-gonna-get-help-here.com',
      }
    );

    let run = builder.log.runs[0];

    expect(builder.log).toMatchInlineSnapshot(`
{
  "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json",
  "runs": [
    {
      "invocations": [],
      "results": [
        {
          "kind": "fail",
          "level": "error",
          "message": {
            "text": "THIS IS A MESSAGE",
          },
          "ruleId": "test-rule",
          "ruleIndex": 0,
        },
      ],
      "tool": {
        "driver": {
          "informationUri": "https://github.com/checkupjs/checkup",
          "language": "en-US",
          "name": "checkup",
          "rules": [
            {
              "helpUri": "http://fat-chance-youre-gonna-get-help-here.com",
              "id": "test-rule",
              "shortDescription": {
                "text": "This is only a test rule",
              },
            },
          ],
        },
      },
    },
  ],
  "version": "2.1.0",
}
`);
    expect(run.tool.driver.rules![0].id).toEqual(run.results![0].ruleId);
    expect(builder.log).toBeValidSarifLog();
  });
});
