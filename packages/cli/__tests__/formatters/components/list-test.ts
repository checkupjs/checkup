import { BufferedWriter } from '@checkup/core';
import ListComponent from '../../../src/formatters/components/list';

describe('list component', () => {
  let writer: BufferedWriter;
  let component: ListComponent;

  let rule = {
    id: 'fake-rule',
    shortDescription: {
      text: 'Tests whether a rule works or not',
    },
    properties: {
      taskDisplayName: 'Fake rule',
      category: 'best practices',
    },
  };

  beforeEach(() => {
    writer = new BufferedWriter();
    component = new ListComponent(writer);
  });

  it('can render the taskName', () => {
    component.render(rule, []);

    expect(writer.buffer).toMatchInlineSnapshot(`
      "[1m[4mFake Rule[24m[22m
      [1m[22m

      "
    `);
  });
});
