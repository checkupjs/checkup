import ActionsEvaluator from '../src/actions/actions-evaluator.js';

describe('actions-evaluator', () => {
  it('can add an action to actions', () => {
    let actionsEvaluator = new ActionsEvaluator();

    actionsEvaluator.add({
      taskName: 'foo-task',
      name: 'foo',
      summary: 'Remove exessive foos',
      details: '`${count} foos too many`',
      defaultThreshold: 10,
      items: [],
      input: 11,
    });

    expect(actionsEvaluator.evaluate({})).toHaveLength(1);
  });

  it('should return no action when action disabled via string', () => {
    let actionsEvaluator = new ActionsEvaluator();

    actionsEvaluator.add({
      taskName: 'foo-task',
      name: 'foo',
      summary: 'Remove exessive foos',
      details: '`${count} foos too many`',
      defaultThreshold: 10,
      items: [],
      input: 11,
    });

    let evaluatedActions = actionsEvaluator.evaluate({
      actions: {
        foo: 'off',
      },
    });

    expect(evaluatedActions).toHaveLength(0);
  });

  it('should return no action when action disabled via tuple', () => {
    let actionsEvaluator = new ActionsEvaluator();

    actionsEvaluator.add({
      taskName: 'foo-task',
      name: 'foo',
      summary: 'Remove exessive foos',
      details: '`${count} foos too many`',
      defaultThreshold: 10,
      items: [],
      input: [].length,
    });

    let evaluatedActions = actionsEvaluator.evaluate({
      actions: {
        foo: ['off', { threshold: 10 }],
      },
    });

    expect(evaluatedActions).toHaveLength(0);
  });

  it('should return no action when action enabled and threshold not exceeded', () => {
    let actionsEvaluator = new ActionsEvaluator();

    actionsEvaluator.add({
      taskName: 'foo-task',
      name: 'foo',
      summary: 'Remove exessive foos',
      details: '`${count} foos too many`',
      defaultThreshold: 10,
      items: [],
      input: 9,
    });

    let evaluatedActions = actionsEvaluator.evaluate({
      actions: {
        foo: ['on', { threshold: 10 }],
      },
    });

    expect(evaluatedActions).toHaveLength(0);
  });

  it('should return action when action is enabled and default threshold exceeded', () => {
    let actionsEvaluator = new ActionsEvaluator();

    actionsEvaluator.add({
      taskName: 'foo-task',
      name: 'foo',
      summary: 'Remove exessive foos',
      details: '`${count} foos too many`',
      defaultThreshold: 10,
      items: [],
      input: 11,
    });

    let evaluatedActions = actionsEvaluator.evaluate({
      actions: {
        foo: 'on',
      },
    });

    expect(evaluatedActions).toHaveLength(1);
  });

  it('should return action when action is enabled and threshold exceeded when overriding threshold via config', () => {
    let actionsEvaluator = new ActionsEvaluator();

    actionsEvaluator.add({
      taskName: 'foo-task',
      name: 'foo',
      summary: 'Remove exessive foos',
      details: '`${count} foos too many`',
      defaultThreshold: 12,
      items: [],
      input: 11,
    });

    let evaluatedActions = actionsEvaluator.evaluate({
      actions: {
        foo: ['on', { threshold: 10 }],
      },
    });

    expect(evaluatedActions).toHaveLength(1);
  });
});
