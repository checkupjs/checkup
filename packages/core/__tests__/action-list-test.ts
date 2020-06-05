import { Action, ActionConfig } from '../lib';
import ActionList from '../src/action-list';

describe('ActionList', () => {
  let actions: Action[] = [
    {
      key: 'notEnabledAction',
      isEnabled: function () {
        return this.value > this.threshold;
      },
      threshold: 20,
      value: 30,
      message: function () {
        return `There should be no more than ${this.threshold} instances of 'foo', and you have ${this.value} instances.`;
      },
      enabledByDefault: false,
    },
    {
      key: 'enabledAction',
      isEnabled: function () {
        return this.threshold > this.value;
      },
      threshold: 20,
      value: 10,
      message: function () {
        return `You need at least ${this.threshold} instances of 'whatever', and you have ${this.value} instances.`;
      },
      enabledByDefault: true,
    },
  ];
  let actionConfig: ActionConfig[] = [];

  it('can create an instance of an ActionList', () => {
    const actionList = new ActionList(actions, actionConfig);

    expect(actionList).toBeInstanceOf(ActionList);
    expect(actionList.isActionable).toEqual(true);
  });

  it('isActionEnabled returns false if that action is not enabled', () => {
    const actionList = new ActionList(actions, actionConfig);

    expect(actionList.isActionEnabled('notEnabledAction')).toEqual(false);
  });

  it('isActionAvailable returns false if action does not exists with that name', () => {
    const actionList = new ActionList(actions, actionConfig);

    expect(actionList.isActionAvailable('meowmeow')).toEqual(false);
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
          "enabledByDefault": true,
          "isEnabled": [Function],
          "key": "enabledAction",
          "message": [Function],
          "threshold": 20,
          "value": 10,
        },
      ]
    `);
  });

  it('you can get enabledActions with a config that turns on actions (as a string)', async () => {
    const actionList = new ActionList(actions, ['notEnabledAction']);

    expect(actionList.isActionEnabled('notEnabledAction')).toEqual(true);
    expect(actionList.enabledActions).toHaveLength(2);
  });

  it('you can get enabledActions with a config that turns on actions (as a tuple with string)', async () => {
    const actionList = new ActionList(actions, [{ notEnabledAction: 'on' }]);

    expect(actionList.isActionEnabled('notEnabledAction')).toEqual(true);

    expect(actionList.enabledActions).toHaveLength(2);
  });

  it('you can get enabledActions with a config that turns off actions', async () => {
    const actionList = new ActionList(actions, [{ enabledAction: 'off' }]);

    expect(actionList.isActionEnabled('enabledAction')).toEqual(false);
    expect(actionList.enabledActions).toHaveLength(0);
  });

  it('you can get enabledActions with a config has a custom threshold', async () => {
    const actionList = new ActionList(actions, [{ enabledAction: 5 }]);

    expect(actionList.isActionEnabled('enabledAction')).toEqual(false);
    expect(actionList.getAvailableAction('enabledAction')?.threshold).toEqual(5);
    expect(actionList.enabledActions).toHaveLength(0);
  });

  it('you can get enabledActions with a config has multiple configurations', async () => {
    const actionList = new ActionList(actions, [{ enabledAction: 5 }, { notEnabledAction: 'on' }]);

    expect(actionList.isActionEnabled('enabledAction')).toEqual(false);
    expect(actionList.isActionEnabled('notEnabledAction')).toEqual(true);
    expect(actionList.enabledActions).toHaveLength(1);
  });
});
