// This file reads all data and displays it in a chart. Chart is shown on start page. This is only used for the start page.
var userCount; var pointCount; var commandCount; var quoteCount; var introChart; var pollChart;
function getBasicData() {
  const users = UserHandle.getAll().then((a) => {
    for (const property in a) {
      const tempArray = [
        `${a[`${property}`].userName}`,
        Number(`${a[`${property}`].points}`),
        Number(`${a[`${property}`].watchTime}`),
        `${a[`${property}`].team}`,
        `${a[`${property}`].role}`,
        `${a[`${property}`].picture}`,
        a[`${property}`].quotes,
      ];
      arrayofUsers.push(tempArray); // Pushes the commands to a variable which we use to build the table
    }
    userCount = a.length;
    const points = QuoteHandle.getAll().then((b) => {
      quoteCount = b.length;
      const commands = CommandHandle.getAll().then((c) => {
        commandCount = c.length;
        pointCount = 4;
        const introChartOptions = {
          series: [userCount, pointCount, commandCount, quoteCount, 4],
          labels: ['Users', 'Points', 'Commands', 'Quotes', 'PlaceHolder'],
          chart: {
            width: 380,
            type: 'donut',
            foreColor: '#f0f8ff',
          },

          plotOptions: {
            pie: {
              startAngle: -90,
              endAngle: 270,
            },
          },
          dataLabels: {
            enabled: false,
          },
          fill: {
            type: 'gradient',
          },
          legend: {
            formatter: function(val, opts) {
              return val + ' - ' + opts.w.globals.series[opts.seriesIndex];
            },
          },
          title: {
            text: 'Bot Usage',
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        };

        introChart = new ApexCharts(document.getElementById('chart'), introChartOptions);
        introChart.render();
      });
    });
  });
}
