const rule = require('../rules/test-types'),
  RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('test-type-counts', rule, {
  valid: [
    // if there are no tests or skips in the module, it will be "valid"
    `
    module('test', function(hooks) {
      setupApplicationTest(hooks);
    });
  `,
  ],
  invalid: [
    // correctly identifies application tests / skips / only / todo
    {
      code: `
          module('test', function(hooks) {
            setupApplicationTest(hooks);

            test('testing foo');
            skip('testing shmoo');
            todo('blue goo');
            only('macaroni');
          });
        `,
      errors: [
        { message: 'testApplication' },
        { message: 'skipApplication' },
        { message: 'todoApplication' },
        { message: 'onlyApplication' },
      ],
    },
    // correctly identifies rendering tests / skips / only / todo
    {
      code: `
              module('test', function(hooks) {
                setupRenderingTest(hooks);

                test('testing foo');
                test('testing foo');
                skip('testing shmoo');
                todo('blue goo');
                todo('blue goo');
                only('macaroni');
              });
            `,
      errors: [
        { message: 'testRendering' },
        { message: 'testRendering' },
        { message: 'skipRendering' },
        { message: 'todoRendering' },
        { message: 'todoRendering' },
        { message: 'onlyRendering' },
      ],
    },

    // correctly identifies unit tests / skips / only / todo
    {
      code: `
          module('test', function(hooks) {
            setupTest(hooks);

            test('testing foo');
            skip('testing shmoo');
            skip('testing shmoo');
            todo('blue goo');
            only('macaroni');
            only('macaroni');
          });
        `,
      errors: [
        { message: 'testUnit' },
        { message: 'skipUnit' },
        { message: 'skipUnit' },
        { message: 'todoUnit' },
        { message: 'onlyUnit' },
        { message: 'onlyUnit' },
      ],
    },
  ],
});
