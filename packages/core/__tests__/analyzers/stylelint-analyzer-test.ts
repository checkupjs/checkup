import { resolve } from 'path';
import { LinterOptions } from 'stylelint';
import StylelintAnalyzer from '../../src/analyzers/stylelint-analyzer';
import { TaskConfig } from '../../src/types/config';

describe('stylelint-analyzer', () => {
  it('can create a stylelint analyzer', () => {
    let config: Partial<LinterOptions> = {
      config: {
        rules: {
          'font-family-no-duplicate-names': true,
        },
      },
    };

    let analyzer: StylelintAnalyzer = new StylelintAnalyzer(config);

    expect(analyzer.config).toEqual(config);
  });

  it('can create a stylelint analyzer with custom rule configuration', () => {
    let customConfig: TaskConfig = {
      stylelintConfig: {
        config: {
          rules: {
            'font-family-no-duplicate-names': false,
          },
        },
      },
    };
    let config: Partial<LinterOptions> = {
      config: {
        rules: {
          'font-family-no-duplicate-names': true,
        },
      },
    };

    let analyzer: StylelintAnalyzer = new StylelintAnalyzer(config, customConfig);

    expect(analyzer.config).toEqual(customConfig.stylelintConfig);
  });

  it('can run on files and return a result', async () => {
    let config: Partial<LinterOptions> = {
      config: {
        rules: {
          'font-family-no-duplicate-names': true,
        },
      },
    };

    let analyzer: StylelintAnalyzer = new StylelintAnalyzer(config);

    let filePath = resolve(__dirname, '..', '__fixtures__/simple.css');
    let result = await analyzer.analyze([filePath]);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "errored": true,
        "output": "[{\\"source\\":\\"/Users/scalvert/workspace/personal/checkup/packages/core/__tests__/__fixtures__/simple.css\\",\\"deprecations\\":[],\\"invalidOptionWarnings\\":[],\\"parseErrors\\":[],\\"errored\\":true,\\"warnings\\":[{\\"line\\":2,\\"column\\":23,\\"rule\\":\\"font-family-no-duplicate-names\\",\\"severity\\":\\"error\\",\\"text\\":\\"Unexpected duplicate name serif (font-family-no-duplicate-names)\\"}]}]",
        "reportedDisables": Array [],
        "results": Array [
          Object {
            "_postcssResult": Result {
              "css": "a {
        font-family: serif, serif;
      }
      ",
              "map": undefined,
              "messages": Array [
                Warning {
                  "column": 23,
                  "index": 20,
                  "line": 2,
                  "node": Object {
                    "prop": "font-family",
                    "raws": Object {
                      "before": "
        ",
                      "between": ": ",
                    },
                    "source": Object {
                      "end": Object {
                        "column": 28,
                        "line": 2,
                      },
                      "input": Input {
                        "css": "a {
        font-family: serif, serif;
      }
      ",
                        "file": "/Users/scalvert/workspace/personal/checkup/packages/core/__tests__/__fixtures__/simple.css",
                        "hasBOM": false,
                      },
                      "start": Object {
                        "column": 3,
                        "line": 2,
                      },
                    },
                    "type": "decl",
                    "value": "serif, serif",
                  },
                  "rule": "font-family-no-duplicate-names",
                  "severity": "error",
                  "text": "Unexpected duplicate name serif (font-family-no-duplicate-names)",
                  "type": "warning",
                },
              ],
              "opts": Object {
                "from": "/Users/scalvert/workspace/personal/checkup/packages/core/__tests__/__fixtures__/simple.css",
                "syntax": Object {
                  "config": Object {
                    "babel": "jsx",
                    "css": Object {
                      "parse": [Function],
                      "stringify": [Function],
                    },
                    "css-in-js": [Function],
                    "jsx": [Function],
                    "less": [Function],
                    "markdown": [Function],
                    "postcss": "css",
                    "sass": [Function],
                    "scss": [Function],
                    "stylus": "css",
                    "sugarss": [Function],
                    "xml": "html",
                  },
                  "parse": [Function],
                  "stringify": [Function],
                },
              },
              "processor": Processor {
                "plugins": Array [],
                "version": "7.0.35",
              },
              "root": Object {
                "indexes": Object {},
                "lastEach": 3,
                "nodes": Array [
                  Object {
                    "indexes": Object {},
                    "lastEach": 3,
                    "nodes": Array [
                      Object {
                        "prop": "font-family",
                        "raws": Object {
                          "before": "
        ",
                          "between": ": ",
                        },
                        "source": Object {
                          "end": Object {
                            "column": 28,
                            "line": 2,
                          },
                          "input": Input {
                            "css": "a {
        font-family: serif, serif;
      }
      ",
                            "file": "/Users/scalvert/workspace/personal/checkup/packages/core/__tests__/__fixtures__/simple.css",
                            "hasBOM": false,
                          },
                          "start": Object {
                            "column": 3,
                            "line": 2,
                          },
                        },
                        "type": "decl",
                        "value": "serif, serif",
                      },
                    ],
                    "raws": Object {
                      "after": "
      ",
                      "before": "",
                      "between": " ",
                      "semicolon": true,
                    },
                    "selector": "a",
                    "source": Object {
                      "end": Object {
                        "column": 1,
                        "line": 3,
                      },
                      "input": Input {
                        "css": "a {
        font-family: serif, serif;
      }
      ",
                        "file": "/Users/scalvert/workspace/personal/checkup/packages/core/__tests__/__fixtures__/simple.css",
                        "hasBOM": false,
                      },
                      "start": Object {
                        "column": 1,
                        "line": 1,
                      },
                    },
                    "type": "rule",
                  },
                ],
                "raws": Object {
                  "after": "
      ",
                  "semicolon": false,
                },
                "source": Object {
                  "input": Input {
                    "css": "a {
        font-family: serif, serif;
      }
      ",
                    "file": "/Users/scalvert/workspace/personal/checkup/packages/core/__tests__/__fixtures__/simple.css",
                    "hasBOM": false,
                  },
                  "lang": "css",
                  "start": Object {
                    "column": 1,
                    "line": 1,
                  },
                  "syntax": Object {
                    "parse": [Function],
                    "stringify": [Function],
                  },
                },
                "type": "root",
              },
              "stylelint": Object {
                "config": Object {
                  "rules": Object {
                    "font-family-no-duplicate-names": Array [
                      true,
                    ],
                  },
                },
                "customMessages": Object {
                  "font-family-no-duplicate-names": undefined,
                },
                "disabledRanges": Object {
                  "all": Array [],
                },
                "quiet": undefined,
                "ruleSeverities": Object {
                  "font-family-no-duplicate-names": "error",
                },
                "stylelintError": true,
              },
            },
            "deprecations": Array [],
            "errored": true,
            "ignored": undefined,
            "invalidOptionWarnings": Array [],
            "parseErrors": Array [],
            "source": "/Users/scalvert/workspace/personal/checkup/packages/core/__tests__/__fixtures__/simple.css",
            "warnings": Array [
              Object {
                "column": 23,
                "line": 2,
                "rule": "font-family-no-duplicate-names",
                "severity": "error",
                "text": "Unexpected duplicate name serif (font-family-no-duplicate-names)",
              },
            ],
          },
        ],
      }
    `);
  });
});
