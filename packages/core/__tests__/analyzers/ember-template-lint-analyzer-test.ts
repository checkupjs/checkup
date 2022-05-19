import TemplateLinter from 'ember-template-lint';
import { TemplateLintConfig } from '../../src/types/ember-template-lint';
import EmberTemplateLintAnalyzer from '../../src/analyzers/ember-template-lint-analyzer';

describe('ember-template-lint-analyzer', () => {
  it('can create an ember-template-lint analyzer', () => {
    let config: TemplateLintConfig = {};
    let analyzer: EmberTemplateLintAnalyzer = new EmberTemplateLintAnalyzer(config);

    analyzer.loadConfig();

    expect(analyzer.engine).toBeInstanceOf(TemplateLinter);
    expect(Object.keys(analyzer.engine.options.config)).toEqual([]);
  });

  it('can create an ember-template-lint analyzer with custom rule configuration', async () => {
    let config: TemplateLintConfig = {
      rules: {
        'block-indentation': ['error', 6],
      },
    };

    let analyzer: EmberTemplateLintAnalyzer = new EmberTemplateLintAnalyzer(config);

    await analyzer.loadConfig();

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
