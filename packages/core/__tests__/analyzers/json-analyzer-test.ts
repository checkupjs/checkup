import JsonAnalyzer from '../../src/analyzers/json-analyzer.js';

describe('json-analyzer', () => {
  it('throws when given invalid JSON string', () => {
    expect(() => {
      new JsonAnalyzer('not valid');
    }).toThrow();
  });

  it('can traverse JSON', () => {
    expect(() => {
      new JsonAnalyzer(JSON.stringify(['an', 'array'], null, 2));
    }).not.toThrow();
  });
});
