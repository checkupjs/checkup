import { getTaskContext } from '@checkup/test-helpers';
import { Result } from 'sarif';
import BaseValidationTask from '../src/base-validation-task';
import { TaskContext } from '../src/types/tasks';

class FakeValidationTask extends BaseValidationTask {
  taskName = 'my-fake-validation';
  taskDisplayName = 'Fake Validation';
  description = 'description';
  category = 'foo';

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.addRule();
    this.addRuleComponentMetadata();

    this.addValidationSteps();
  }

  addValidationSteps() {
    this.addValidationStep('Check the first thing', () => {
      return {
        isValid: true,
      };
    });

    this.addValidationStep('Check the second thing', () => {
      return {
        isValid: true,
        options: {
          location: {
            uri: 'some/path/to/second.js',
          },
          properties: {
            foo: 'bar',
          },
        },
      };
    });

    this.addValidationStep('Check the third thing', () => {
      return {
        isValid: false,
        options: {
          location: {
            uri: 'some/path/to/third.js',
          },
          properties: {
            foo: 'bar',
          },
        },
      };
    });
  }

  async run(): Promise<Result[]> {
    let stepResults = this.validate();

    for (let [messageText, validationResult] of stepResults) {
      this.addValidationResult(messageText, validationResult.isValid);
    }

    return this.results;
  }
}

describe('BaseValidationTask', () => {
  it('can add rule component metadata', () => {
    let context: TaskContext = getTaskContext();

    let fakeTask = new FakeValidationTask('fake validation', context);

    expect(fakeTask.rule).toEqual({
      id: 'my-fake-validation',
      shortDescription: {
        text: 'description',
      },
      properties: {
        taskDisplayName: 'Fake Validation',
        category: 'foo',
        component: {
          name: 'validation',
        },
      },
    });
  });

  it('can add validation steps to a validation task', () => {
    let context: TaskContext = getTaskContext();

    let fakeTask = new FakeValidationTask('fake validation', context);

    expect(fakeTask.validationSteps.size).toEqual(3);
  });

  it('can validate steps and return result', () => {
    let context: TaskContext = getTaskContext();

    let fakeTask = new FakeValidationTask('fake validation', context);

    let steps = fakeTask.validate();

    expect(steps.size).toEqual(3);
    expect(steps).toMatchInlineSnapshot(`
Map {
  "Check the first thing" => Object {
    "isValid": true,
  },
  "Check the second thing" => Object {
    "isValid": true,
    "options": Object {
      "location": Object {
        "uri": "some/path/to/second.js",
      },
      "properties": Object {
        "foo": "bar",
      },
    },
  },
  "Check the third thing" => Object {
    "isValid": false,
    "options": Object {
      "location": Object {
        "uri": "some/path/to/third.js",
      },
      "properties": Object {
        "foo": "bar",
      },
    },
  },
}
`);
  });

  it('can add validation step results', async () => {
    let context: TaskContext = getTaskContext();

    let fakeTask = new FakeValidationTask('fake validation', context);

    await fakeTask.run();

    expect(fakeTask.log.runs[0].results).toMatchInlineSnapshot(`
Array [
  Object {
    "kind": "pass",
    "level": "none",
    "message": Object {
      "text": "Check the first thing",
    },
    "ruleId": "my-fake-validation",
    "ruleIndex": 0,
  },
  Object {
    "kind": "pass",
    "level": "none",
    "message": Object {
      "text": "Check the second thing",
    },
    "ruleId": "my-fake-validation",
    "ruleIndex": 0,
  },
  Object {
    "kind": "fail",
    "level": "error",
    "message": Object {
      "text": "Check the third thing",
    },
    "ruleId": "my-fake-validation",
    "ruleIndex": 0,
  },
]
`);
  });
});
