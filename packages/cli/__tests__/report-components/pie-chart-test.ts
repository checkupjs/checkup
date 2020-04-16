import { Category, PieChartData, Priority } from '@checkup/core';
import { renderPartialAsHtml } from '../__utils__/render-partial';

describe('the correct data is rendered for a pie chart', () => {
  it('returns correct HTML string', async () => {
    const htmlString = renderPartialAsHtml(
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
        'this is a chart',
        100
      )
    );

    expect(htmlString).toMatchInlineSnapshot(`
      "<div class=\\"max-w-sm rounded overflow-hidden shadow-lg bg-white\\">
        <div class=\\"px-6 py-4\\">
          <div class=\\"font-bold text-xl mb-2\\">Mock Task</div>
          <canvas id=\\"chart-area-100\\"></canvas>
        </div>
      </div>


      <script>
        let canvasFor100 = document.getElementById('chart-area-100').getContext('2d');
        let optionFor100 = {
          type: 'pie',
          data: {
            datasets: [{
              data: [33,23,13,3],
              backgroundColor: [\\"#4FD1C5\\",\\"#7F9CF5\\",\\"#FC8181\\",\\"#63B3ED\\"],
            }],
            labels: [\\"blah\\",\\"blah\\",\\"black\\",\\"sheep\\"],
          },
          options: {
            legend: {
              position: 'right',
            },
          }
        };

        window['pieChart-100'] = new Chart(canvasFor100, optionFor100);
      </script>
      "
    `);
  });
});
