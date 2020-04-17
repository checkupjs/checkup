import { Category, NumericalCardData, Priority } from '@checkup/core';
import { renderPartialAsHtml } from '../__utils__/render-partial';

const expectedOutput: any = {
  meta: {
    taskName: 'mock-task',
    friendlyTaskName: 'Mock Task',
    taskClassification: {
      category: Category.Migrations,
      priority: Priority.Medium,
    },
  },
  result: 100,
  description: 'bad patterns in your app',
};

describe('the correct data is rendered for a numerical card', () => {
  it('returns correct HTML string', async () => {
    const htmlString = renderPartialAsHtml(
      new NumericalCardData(expectedOutput.meta, expectedOutput.result, expectedOutput.description)
    );

    expect(htmlString).toMatchInlineSnapshot(`
      "<div class=\\"px-6 py-4 flex flex-wrap flex-col\\">
        <div class=\\"text-xl font-bold self-end\\">A</div>
        <h1 class=\\"text-xl self-center\\">Mock Task</h1>
        <div class=\\"text-4xl self-center\\">100</div>
        <p>bad patterns in your app</p>
      </div>
      "
    `);
  });
});
