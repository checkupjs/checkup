const TemplateLinter = require('ember-template-lint');

export function getOctaneTemplateLinter() {
  return new TemplateLinter({
    config: {
      rules: {
        'no-action': 'error',
        'no-args-paths': 'error',
        'no-curly-component-invocation': [
          'error',
          {
            noImplicitThis: 'error',
            requireDash: 'off',
          },
        ],
        'no-implicit-this': 'error',
      },
    },
  });
}
