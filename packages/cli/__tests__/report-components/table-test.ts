import {
  Category,
  TableData,
  Priority,
  TaskMetaData,
  DependencyResult,
  Grade,
} from '@checkup/core';
import { renderPartialAsHtml } from '../__utils__/render-partial';

describe('the correct data is rendered for a table', () => {
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
      {
        name:
          'reaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaly-long-name',
        value: '12.2.2',
      },
      { name: 'foo', value: '4.2.2' },
      { name: 'bar', value: '6.1.2' },
    ],
  };
  it('returns correct HTML string', async () => {
    const htmlString = renderPartialAsHtml(
      new TableData(expectedOutput.meta, expectedOutput.result)
    );

    expect(htmlString).toMatchInlineSnapshot(`
      "<div class=\\"max-w-sm rounded overflow-hidden shadow-lg bg-white\\">
        <div class=\\"px-6 py-4 flex flex-wrap flex-col\\">
          <div class=\\"text-xl font-bold self-center\\">Mock Task</div>

          <table class=\\"table-auto rounded\\">
            <thead>
              <tr class=\\"font-bold\\">
                  <th class=\\"px-4 py-2\\">name</th>
                  <th class=\\"px-4 py-2\\">value</th>
              </tr>
            </thead>
            <tbody>
                <tr class=\\"bg-gray-100\\">
                    <td class=\\"border px-4 py-2\\">reaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaly-long-name</td>
                    <td class=\\"border px-4 py-2\\">12.2.2</td>
                </tr>
                <tr class=\\"bg-gray-100\\">
                    <td class=\\"border px-4 py-2\\">foo</td>
                    <td class=\\"border px-4 py-2\\">4.2.2</td>
                </tr>
                <tr class=\\"bg-gray-100\\">
                    <td class=\\"border px-4 py-2\\">bar</td>
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

describe('the correct data is rendered for a graded table', () => {
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
      { name: 'foo', value: '12.2.2', grade: Grade.A },
      { name: 'bar', value: '4.2.2', grade: Grade.B },
      { name: 'baz', value: '6.1.2', grade: Grade.D },
    ],
  };
  it('returns correct HTML string', async () => {
    const htmlString = renderPartialAsHtml(
      new TableData(expectedOutput.meta, expectedOutput.result)
    );

    expect(htmlString).toMatchInlineSnapshot(`
      "<div class=\\"max-w-sm rounded overflow-hidden shadow-lg bg-white\\">
        <div class=\\"px-6 py-4 flex flex-wrap flex-col\\">
          <div class=\\"text-xl font-bold self-center\\">Mock Task</div>

          <table class=\\"table-auto rounded\\">
            <thead>
              <tr class=\\"font-bold\\">
                  <th class=\\"px-4 py-2\\">name</th>
                  <th class=\\"px-4 py-2\\">value</th>
              </tr>
            </thead>
            <tbody>
                <tr class=\\"bg-green-600\\">
                    <td class=\\"border px-4 py-2\\">foo</td>
                    <td class=\\"border px-4 py-2\\">12.2.2</td>
                </tr>
                <tr class=\\"bg-green-200\\">
                    <td class=\\"border px-4 py-2\\">bar</td>
                    <td class=\\"border px-4 py-2\\">4.2.2</td>
                </tr>
                <tr class=\\"bg-orange-500\\">
                    <td class=\\"border px-4 py-2\\">baz</td>
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
