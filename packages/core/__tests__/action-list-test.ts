import { Action, ActionConfig } from '../src';
import ActionList from '../src/action-list';
import { isActionEnabled } from '@checkup/test-helpers';

describe('ActionList', () => {
  let actions: Action[] = [
    {
      name: 'valueGreaterThanThreshold',
      threshold: 20,
      value: 10,
      get enabled() {
        return this.value > this.threshold;
      },
      get message() {
        return `There should be no more than ${this.threshold} instances of 'foo', and you have ${this.value} instances.`;
      },
    },
    {
      name: 'valueLessThanThreshold',
      threshold: 20,
      value: 10,
      get enabled() {
        return this.threshold > this.value;
      },
      get message() {
        return `You need at least ${this.threshold} instances of 'whatever', and you have ${this.value} instances.`;
      },
    },
  ];
  let actionConfig: ActionConfig[] = [];

  it('can create an instance of an ActionList', () => {
    const actionList = new ActionList(actions, actionConfig);

    expect(actionList).toBeInstanceOf(ActionList);
    expect(actionList.isActionable).toEqual(true);
  });

  it('you can get actionMessages', () => {
    const actionList = new ActionList(actions, actionConfig);

    expect(actionList.actionMessages).toMatchInlineSnapshot(`
      Array [
        "You need at least 20 instances of 'whatever', and you have 10 instances.",
      ]
    `);
  });

  it('you can get enabledActions with an empty config', async () => {
    const actionList = new ActionList(actions, actionConfig);

    expect(actionList.enabledActions).toMatchInlineSnapshot(`
      Array [
        Object {
          "enabled": true,
          "message": "You need at least 20 instances of 'whatever', and you have 10 instances.",
          "name": "valueLessThanThreshold",
          "threshold": 20,
          "value": 10,
        },
      ]
    `);
  });

  it('you can get enabledActions with a config that turns off actions', async () => {
    const actionList = new ActionList(actions, { actions: { valueLessThanThreshold: 'off' } });

    expect(actionList.enabledActions).toHaveLength(0);
    expect(isActionEnabled(actionList.enabledActions, 'valueLessThanThreshold')).toEqual(false);
  });

  it('you can get enabledActions with a config has a custom threshold', async () => {
    const actionList = new ActionList(actions, {
      actions: { valueGreaterThanThreshold: { threshold: 5 } },
    });

    let valueGreaterThanThreshold = actionList.enabledActions
      .filter(
        (valueGreaterThanThreshold) =>
          valueGreaterThanThreshold.name === 'valueGreaterThanThreshold'
      )
      .pop();

    expect(valueGreaterThanThreshold).toBeDefined();
    expect(valueGreaterThanThreshold?.threshold).toEqual(5);
    expect(isActionEnabled(actionList.enabledActions, 'valueGreaterThanThreshold')).toEqual(true);
  });

  it('you can get enabledActions with a config has multiple configurations', async () => {
    const actionList = new ActionList(actions, {
      actions: {
        valueLessThanThreshold: { threshold: 5 },
        valueGreaterThanThreshold: ['off', { threshold: 22 }],
      },
    });

    expect(isActionEnabled(actionList.enabledActions, 'valueLessThanThreshold')).toEqual(false);
    expect(isActionEnabled(actionList.enabledActions, 'valueGreaterThanThreshold')).toEqual(false);
  });
});
