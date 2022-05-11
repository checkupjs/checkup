import { TemplateLintConfig } from '../../src/types/ember-template-lint';
import EmberTemplateLintAnalyzer from '../../src/analyzers/ember-template-lint-analyzer';

const TemplateLinter = require('ember-template-lint');

describe('ember-template-lint-analyzer', () => {
  it('can create an ember-template-lint analyzer', () => {
    let config: TemplateLintConfig = {};

    let analyzer: EmberTemplateLintAnalyzer = new EmberTemplateLintAnalyzer(config);

    expect(analyzer.engine).toBeInstanceOf(TemplateLinter);
    expect(Object.keys(analyzer.engine.config)).toMatchInlineSnapshot(`
[
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

  it('can create an ember-template-lint analyzer with custom rule configuration', () => {
    let config: TemplateLintConfig = {
      rules: {
        'block-indentation': ['error', 6],
      },
    };

    let analyzer: EmberTemplateLintAnalyzer = new EmberTemplateLintAnalyzer(config);
    let optionsForRule = analyzer.engine.config.rules['block-indentation'];

    expect(analyzer.engine).toBeInstanceOf(TemplateLinter);
    expect(optionsForRule).toMatchInlineSnapshot(`
{
  "config": 6,
  "severity": 2,
}
`);
  });
});
