import { resolve } from 'path';
import { LinterOptions } from 'stylelint';
import StylelintAnalyzer from '../../src/analyzers/stylelint-analyzer.js';
import { TaskConfig } from '../../src/types/config.js';

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

    expect(result.errored).toEqual(true);
    expect(result.results).toHaveLength(1);
  });
});
