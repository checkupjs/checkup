import { RuleTester } from 'eslint';
import rule from '../../src/eslint/rules/test-types.cjs';

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
        { message: 'application|test' },
        { message: 'application|skip' },
        { message: 'application|todo' },
        { message: 'application|only' },
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
        { message: 'rendering|test' },
        { message: 'rendering|test' },
        { message: 'rendering|skip' },
        { message: 'rendering|todo' },
        { message: 'rendering|todo' },
        { message: 'rendering|only' },
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
        { message: 'unit|test' },
        { message: 'unit|skip' },
        { message: 'unit|skip' },
        { message: 'unit|todo' },
        { message: 'unit|only' },
        { message: 'unit|only' },
      ],
    },
  ],
});
