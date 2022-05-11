import JavaScriptAnalyzer from '../../src/analyzers/javascript-analyzer';

describe('javascript-analyzer', () => {
  it('can parse cjs modules', () => {
    let source = `
    const foo = require('foo');

    foo();
    `;

    expect(() => {
      new JavaScriptAnalyzer(source);
    }).not.toThrow();
  });

  it('can parse esm modules', () => {
    let source = `
    import foo from './foo';

    foo();
    `;

    expect(() => {
      new JavaScriptAnalyzer(source);
    }).not.toThrow();
  });
});
