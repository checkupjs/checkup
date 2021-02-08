import { mergeLintConfig } from '../../src/utils/merge-lint-config';
import { TemplateLintConfig } from '../../src/types/ember-template-lint';
import { CLIEngine } from 'eslint';

describe('mergeLintConfig', () => {
  describe('eslint', () => {
    it('should merge strings and tuples when strings are leftmost, tuple takes precedence', () => {
      let original: CLIEngine.Options = {
        rules: {
          'fake-eslint-rule': 'error',
        },
      };

      let overrides = {
        rules: {
          'fake-eslint-rule': [
            'warn',
            {
              prop1: 'error',
              prop2: 'off',
            },
          ],
        },
      };

      expect(mergeLintConfig(original, overrides)).toMatchInlineSnapshot(`
        Object {
          "rules": Object {
            "fake-eslint-rule": Array [
              "warn",
              Object {
                "prop1": "error",
                "prop2": "off",
              },
            ],
          },
        }
      `);
    });

    it('should merge strings and tuples when tuples are leftmost, string takes precedence', () => {
      let original: CLIEngine.Options = {
        rules: {
          'fake-eslint-rule': [
            'warn',
            {
              prop1: 'error',
              prop2: 'off',
            },
          ],
        },
      };

      let overrides = {
        rules: {
          'fake-eslint-rule': 'error',
        },
      };

      expect(mergeLintConfig(original, overrides)).toMatchInlineSnapshot(`
        Object {
          "rules": Object {
            "fake-eslint-rule": "error",
          },
        }
      `);
    });

    it('should merge rule tuples when there are rule overrides', () => {
      let original: CLIEngine.Options = {
        rules: {
          'fake-eslint-rule': [
            'warn',
            {
              prop1: 'error',
              prop2: 'off',
            },
          ],
        },
      };

      let overrides = {
        rules: {
          'fake-eslint-rule': [
            'error',
            {
              prop1: 'warn',
              prop2: 'off',
              prop3: 'error',
            },
          ],
        },
      };

      expect(mergeLintConfig(original, overrides)).toMatchInlineSnapshot(`
        Object {
          "rules": Object {
            "fake-eslint-rule": Array [
              "error",
              Object {
                "prop1": "warn",
                "prop2": "off",
                "prop3": "error",
              },
            ],
          },
        }
      `);
    });
  });

  describe('ember-template-lint', () => {
    it('should merge strings and tuples when strings are leftmost, tuple takes precedence', () => {
      let original: TemplateLintConfig = {
        rules: {
          'fake-ember-template-lint-rule': 'error',
        },
      };

      let overrides = {
        rules: {
          'fake-ember-template-lint-rule': [
            'warn',
            {
              prop1: 'error',
              prop2: 'off',
            },
          ],
        },
      };

      expect(mergeLintConfig(original, overrides)).toMatchInlineSnapshot(`
        Object {
          "rules": Object {
            "fake-ember-template-lint-rule": Array [
              "warn",
              Object {
                "prop1": "error",
                "prop2": "off",
              },
            ],
          },
        }
      `);
    });

    it('should merge strings and tuples when tuples are leftmost, string takes precedence', () => {
      let original: TemplateLintConfig = {
        rules: {
          'fake-ember-template-lint-rule': [
            'warn',
            {
              prop1: 'error',
              prop2: 'off',
            },
          ],
        },
      };

      let overrides = {
        rules: {
          'fake-ember-template-lint-rule': 'error',
        },
      };

      expect(mergeLintConfig(original, overrides)).toMatchInlineSnapshot(`
        Object {
          "rules": Object {
            "fake-ember-template-lint-rule": "error",
          },
        }
      `);
    });

    it('should merge rule tuples when there are rule overrides', () => {
      let original: TemplateLintConfig = {
        rules: {
          'fake-ember-template-lint-rule': [
            'warn',
            {
              prop1: 'error',
              prop2: 'off',
            },
          ],
        },
      };

      let overrides = {
        rules: {
          'fake-ember-template-lint-rule': [
            'error',
            {
              prop1: 'warn',
              prop2: 'off',
              prop3: 'error',
            },
          ],
        },
      };

      expect(mergeLintConfig(original, overrides)).toMatchInlineSnapshot(`
        Object {
          "rules": Object {
            "fake-ember-template-lint-rule": Array [
              "error",
              Object {
                "prop1": "warn",
                "prop2": "off",
                "prop3": "error",
              },
            ],
          },
        }
      `);
    });
  });
});
