import {
  Category,
  NumericalCardData,
  Priority,
  TaskMetaData,
  PieChartData,
  UIReportData,
} from '@checkup/core';

import { generateHTML } from '../src/helpers/pdf';

describe('generateHTML', () => {
  const taskMeta: TaskMetaData = {
    taskName: 'mock-task',
    friendlyTaskName: 'Mock Task',
    taskClassification: {
      category: Category.Migrations,
      priority: Priority.Medium,
    },
  };

  const projectMeta = {
    project: {
      name: 'some-app',
      version: '0.0.1',
      repository: {
        totalCommits: 5870,
        totalFiles: 1571,
        age: '8 years',
        activeDays: '1380',
      },
    },
    checkup: {
      configHash: '07e8f7d8731ffbb321ad86f8f2f62460',
      version: '0.0.6',
    },
  };

  const mergedResults: UIReportData = {
    meta: projectMeta,
    results: {
      [Category.Insights]: {
        [Priority.High]: [],
        [Priority.Medium]: [new NumericalCardData(taskMeta, 100, 'bad patterns in your app')],
        [Priority.Low]: [],
      },
      [Category.Migrations]: {
        [Priority.High]: [],
        [Priority.Medium]: [],
        [Priority.Low]: [],
      },
      [Category.Recommendations]: {
        [Priority.High]: [],
        [Priority.Medium]: [],
        [Priority.Low]: [],
      },
    },
    requiresChart: false,
  };

  it('returns correct HTML string', async () => {
    const htmlString = await generateHTML(mergedResults);
    expect(htmlString).toMatchInlineSnapshot(`
      "<html class=\\"text-gray-900 antialiased leading-tight\\">

      <head>
        <meta charset=\\"utf-8\\">
        <title>Checkup report</title>
        <meta name=\\"description\\" content=\\"\\">
        <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\">
        <link href=\\"https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css\\" rel=\\"stylesheet\\">
        <link rel=\\"stylesheet\\" href=\\"https://cdn.jsdelivr.net/npm/@tailwindcss/ui@latest/dist/tailwind-ui.min.css\\">
      </head>
      <body class=\\"min-h-screen bg-gray-100 p-5\\">
        <div class=\\"py-4 flex flex-wrap flex-col\\">
          <div class=\\"self-end text-xs\\">
            Checkup version 0.0.6
            <br />
            Config hash 07e8f7d8731ffbb321ad86f8f2f62460
          </div>
          <h1 class=\\"text-4xl\\">Checkup Report for some-app <span class=\\"text-xl\\">(v. 0.0.1)</span></h1>
          <h2 class=\\"text-base italic\\">This project is 8 years old, has been active for 1380 days, has 1571 files, and 5870 commits</h2>
        </div>

          <section class=\\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-500 m-5\\">
          <h3 class=\\"text-center capitalize text-3xl font-bold\\">insights</h3>
              <h4 class=\\"capitalize text-2xl font-bold m-5\\">medium priority insightss</h4>
                <div class=\\"grid grid-cols-2 gap-4\\">
                    <div class=\\"border rounded overflow-hidden shadow-lg bg-white my-4 row-start-1\\">
                      <div class=\\"px-6 py-4 flex flex-wrap flex-col\\">
                        <div class=\\"text-xl font-bold self-end\\">A</div>
                        <h1 class=\\"text-xl self-center\\">Mock Task</h1>
                        <div class=\\"text-4xl self-center\\">100</div>
                        <p>bad patterns in your app</p>
                      </div>
                    </div>
                </div>
          </section>
          <section class=\\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-500 m-5\\">
          <h3 class=\\"text-center capitalize text-3xl font-bold\\">migrations</h3>
          </section>
          <section class=\\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-500 m-5\\">
          <h3 class=\\"text-center capitalize text-3xl font-bold\\">recommendations</h3>
          </section>

      </body>
      </html>
      "
    `);
  });

  it('includes tailwind UI lib and stylesheet, but no chartjs (since results dont require it by default)', async () => {
    const htmlString = await generateHTML(mergedResults);

    expect(htmlString).toContain('tailwind.min.css');
    expect(htmlString).toContain('tailwind-ui.min.css');
    expect(htmlString).not.toContain('Chart.js v2.9.3 CSS');
    expect(htmlString).not.toContain('Chart.js v2.9.3 JS');
  });

  it('includes chartsjs css and js when there is a pie-chart being rendered as part of the results', async () => {
    const htmlString = await generateHTML({
      meta: projectMeta,
      results: {
        [Category.Insights]: {
          [Priority.High]: [],
          [Priority.Medium]: [],
          [Priority.Low]: [],
        },
        [Category.Migrations]: {
          [Priority.High]: [],
          [Priority.Medium]: [],
          [Priority.Low]: [],
        },
        [Category.Recommendations]: {
          [Priority.High]: [],
          [Priority.Medium]: [
            new PieChartData(
              {
                taskName: 'mock-task',
                friendlyTaskName: 'Mock Task',
                taskClassification: {
                  category: Category.Insights,
                  priority: Priority.Medium,
                },
              },
              [
                { value: 33, description: 'blah' },
                { value: 23, description: 'blah' },
                { value: 13, description: 'black' },
                { value: 3, description: 'sheep' },
              ],
              'this is a chart'
            ),
          ],
          [Priority.Low]: [],
        },
      },
      requiresChart: true,
    });

    expect(htmlString).toContain('Chart.js v2.9.3 CSS');
    expect(htmlString).toContain('Chart.js v2.9.3 JS');
  });
});
