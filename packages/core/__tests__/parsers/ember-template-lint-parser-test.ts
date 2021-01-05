import {
  createParser,
  EmberTemplateLintParser,
} from '../../src/parsers/ember-template-lint-parser';
import { TemplateLintConfig } from '../../src/types/ember-template-lint';

const TemplateLinter = require('ember-template-lint');

describe('ember-template-lint-parser', () => {
  it('can create an eslint parser', () => {
    let config: TemplateLintConfig = {};

    let parser: EmberTemplateLintParser = createParser(config) as EmberTemplateLintParser;

    expect(parser.engine).toBeInstanceOf(TemplateLinter);
    expect(Object.keys(parser.engine.config)).toMatchInlineSnapshot(`
      Array [
        "rules",
        "pending",
        "overrides",
        "ignore",
        "extends",
        "plugins",
        "loadedRules",
        "loadedConfigurations",
        "_processed",
      ]
    `);
  });

  it('can create an eslint parser with custom rule configuration', () => {
    let config: TemplateLintConfig = {
      rules: {
        'block-indentation': ['error', 6],
      },
    };

    let parser: EmberTemplateLintParser = createParser(config) as EmberTemplateLintParser;
    let optionsForRule = parser.engine.config.rules['block-indentation'];

    expect(parser.engine).toBeInstanceOf(TemplateLinter);
    expect(optionsForRule).toMatchInlineSnapshot(`
      Object {
        "config": 6,
        "severity": 2,
      }
    `);
  });
});
