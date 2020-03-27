import { TemplateLintConfig } from '../types/ember-template-lint';

const TemplateLinter = require('ember-template-lint');

export function getTemplateLinter(templateLintConfig: TemplateLintConfig): typeof TemplateLinter {
  return new TemplateLinter({
    config: templateLintConfig,
  });
}
