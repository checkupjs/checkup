import { SarifLogBuilder } from '../../src/data/sarif-log-builder';

describe('sarif-builder', () => {
  it('builds a default SARIF builder log', () => {
    let builder = new SarifLogBuilder();

    expect(builder.log).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json",
        "runs": Array [
          Object {
            "results": Array [],
            "tool": Object {
              "driver": Object {
                "name": "checkup",
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

    builder.addRun({
      tool: {
        driver: {
          name: 'other',
          language: 'en-CA',
        },
      },
    });

    expect(builder.log).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json",
        "runs": Array [
          Object {
            "results": Array [],
            "tool": Object {
              "driver": Object {
                "name": "checkup",
              },
            },
          },
          Object {
            "results": Array [],
            "tool": Object {
              "driver": Object {
                "language": "en-CA",
                "name": "other",
              },
            },
          },
        ],
        "version": "2.1.0",
      }
    `);
  });

  it('can add rules to a log', () => {
    let builder = new SarifLogBuilder();

    builder.addRule({
      id: 'FOO',
    });

    expect(builder.log).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json",
        "runs": Array [
          Object {
            "results": Array [],
            "tool": Object {
              "driver": Object {
                "name": "checkup",
              },
            },
          },
        ],
        "version": "2.1.0",
      }
    `);
  });

  it('can add results to a log', () => {
    let builder = new SarifLogBuilder();

    builder.addResult({
      message: {
        text: 'THIS IS A MESSAGE',
      },
    });

    expect(builder.log).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json",
        "runs": Array [
          Object {
            "results": Array [
              Object {
                "message": Object {
                  "text": "THIS IS A MESSAGE",
                },
              },
            ],
            "tool": Object {
              "driver": Object {
                "name": "checkup",
              },
            },
          },
        ],
        "version": "2.1.0",
      }
    `);
  });
});
