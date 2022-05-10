import { getTaskContext } from '@checkup/test-helpers';
import { Result } from 'sarif';
import BaseValidationTask from '../src/base-validation-task.js';
import { TaskContext } from '../src/types/tasks.js';

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
    let stepResults = await this.validate();

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

  it('can validate steps and return result', async () => {
    let context: TaskContext = getTaskContext();

    let fakeTask = new FakeValidationTask('fake validation', context);

    let steps = await fakeTask.validate();

    expect(steps.size).toEqual(3);
    expect(steps).toMatchInlineSnapshot(`
Map {
  "Check the first thing" => {
    "isValid": true,
  },
  "Check the second thing" => {
    "isValid": true,
    "options": {
      "location": {
        "uri": "some/path/to/second.js",
      },
      "properties": {
        "foo": "bar",
      },
    },
  },
  "Check the third thing" => {
    "isValid": false,
    "options": {
      "location": {
        "uri": "some/path/to/third.js",
      },
      "properties": {
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
[
  {
    "kind": "pass",
    "level": "none",
    "message": {
      "text": "Check the first thing",
    },
    "ruleId": "my-fake-validation",
    "ruleIndex": 0,
  },
  {
    "kind": "pass",
    "level": "none",
    "message": {
      "text": "Check the second thing",
    },
    "ruleId": "my-fake-validation",
    "ruleIndex": 0,
  },
  {
    "kind": "fail",
    "level": "error",
    "message": {
      "text": "Check the third thing",
    },
    "ruleId": "my-fake-validation",
    "ruleIndex": 0,
  },
]
`);
  });
});
