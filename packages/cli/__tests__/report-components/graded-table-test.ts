import {
  Category,
  Priority,
  TaskMetaData,
  DependencyResult,
  GradedTableData,
  Grade,
} from '@checkup/core';
import { renderPartialAsHtml } from '../__utils__/render-partial';

const expectedOutput: { meta: TaskMetaData; result: DependencyResult[] } = {
  meta: {
    taskName: 'mock-task',
    friendlyTaskName: 'Mock Task',
    taskClassification: {
      category: Category.Migrations,
      priority: Priority.Medium,
    },
  },
  result: [
    { name: 'ember-cli', value: '12.2.2', grade: Grade.A },
    { name: 'ember-data', value: '4.2.2', grade: Grade.B },
    { name: 'ember-qunit', value: '6.1.2', grade: Grade.D },
  ],
};

describe('the correct data is rendered for a table', () => {
  it('returns correct HTML string', async () => {
    const htmlString = renderPartialAsHtml(
      new GradedTableData(expectedOutput.meta, expectedOutput.result)
    );

    expect(htmlString).toMatchInlineSnapshot(`
      "<div class=\\"max-w-sm rounded overflow-hidden shadow-lg bg-white\\">
        <div class=\\"px-6 py-4 flex flex-wrap flex-col\\">
            <div class=\\"text-xl font-bold self-end\\">A</div>
          <div class=\\"text-xl font-bold self-center\\">Mock Task</div>

          <table class=\\"table-auto rounded\\">
            <thead>
              <tr class=\\"font-bold\\">
                  <th class=\\"px-4 py-2\\">name</th>
                  <th class=\\"px-4 py-2\\">value</th>
              </tr>
            </thead>
            <tbody>
                <tr class=\\" bg-green-600 \\">
                  <td class=\\"border px-4 py-2\\">ember-cli</td>
                  <td class=\\"border px-4 py-2\\">12.2.2</td>
                </tr>
                <tr class=\\" bg-green-200 \\">
                  <td class=\\"border px-4 py-2\\">ember-data</td>
                  <td class=\\"border px-4 py-2\\">4.2.2</td>
                </tr>
                <tr class=\\" bg-orange-500 \\">
                  <td class=\\"border px-4 py-2\\">ember-qunit</td>
                  <td class=\\"border px-4 py-2\\">6.1.2</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
      "
    `);
  });
});
