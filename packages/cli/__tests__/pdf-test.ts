import { Category, NumericalCardData, Priority, TaskMetaData, PieChartData } from '@checkup/core';

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

  const mergedResults: any = {
    meta: projectMeta,
    results: [new NumericalCardData(taskMeta, 100, 'bad patterns in your app')],
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
        <h1 class=\\"text-4xl\\">Checkup report</h1>
        <div class=\\"grid grid-cols-3 gap-4\\">
            <div class=\\"max-w-sm rounded overflow-hidden shadow-lg bg-white\\">
              <div class=\\"px-6 py-4 flex flex-wrap flex-col\\">
                <div class=\\"text-xl font-bold self-end\\">A</div>
                <h1 class=\\"text-xl self-center\\">Mock Task</h1>
                <div class=\\"text-4xl self-center\\">100</div>
                <p>bad patterns in your app</p>
              </div>
            </div>
        </div>
      </body>
      </html>
      "
    `);
  });

  it('includes tailwind UI lib and stylesheet, but no chartjs (since results dont require it)', async () => {
    const htmlString = await generateHTML(mergedResults);

    expect(htmlString).toContain('tailwind.min.css');
    expect(htmlString).toContain('tailwind-ui.min.css');
    expect(htmlString).not.toContain('Chart.js v2.9.3 CSS');
  });

  it('includes chartsjs css when there is a pie-chart being rendered as part of the results', async () => {
    const htmlString = await generateHTML({
      meta: projectMeta,
      results: [
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
    });

    expect(htmlString).toContain('Chart.js v2.9.3 CSS');
  });
});
