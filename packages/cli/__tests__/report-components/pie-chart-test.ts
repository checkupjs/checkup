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
      "<div class=\\"px-6 py-4\\">
        <div class=\\"font-bold text-xl mb-2\\">Mock Task</div>
        <canvas id=\\"chart-area-100\\"></canvas>
        <div class=\\"font-bold text-lg\\">this is a chart</div>
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
            animation: {
              onComplete: function () {
                var ctx = this.chart.ctx;
                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                this.data.datasets.forEach(function (dataset) {

                  for (var i = 0; i < dataset.data.length; i++) {
                    var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                        total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                        mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                        start_angle = model.startAngle,
                        end_angle = model.endAngle,
                        mid_angle = start_angle + (end_angle - start_angle)/2;

                    var x = mid_radius * Math.cos(mid_angle);
                    var y = mid_radius * Math.sin(mid_angle);

                    ctx.fillStyle = '#000000';

                    ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                  }
                });
              }
          }

          }
        };

        window['pieChart-100'] = new Chart(canvasFor100, optionFor100);
      </script>
      "
    `);
  });
});
