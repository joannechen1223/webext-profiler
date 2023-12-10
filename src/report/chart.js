export const generateChartHtml = (charts) => {
  let html = '<div style="display: flex">';

  charts.map((chart) => {
    html += `
      <div id=${chart.containerId} style="width: 400px; height: 300px"></div>
    `;
  });

  html += `</div>`;

  return html;
};

export const generateChartScript = (charts) => {
  const drawBarChart = () => {
    charts.map((c) => {
      // eslint-disable-next-line no-undef
      const chart = anychart.bar();

      chart.bar(c.data);
      chart.title(c.title);

      chart.container(c.containerId);
      chart.xAxis().title(c.axis[0]);
      chart.yAxis().title(c.axis[1]);
      chart.draw();
    });
  };

  return `
    <script>
      const charts = ${JSON.stringify(charts)};
      anychart.onDocumentReady(${drawBarChart.toString()})
    </script>
  `;
};

export const baseExtChartSettings = {
  normal: {
    fill: "#b3cf99",
    stroke: null,
    label: { enabled: true },
  },
  hovered: {
    fill: "#b3cf99",
    stroke: null,
    label: { enabled: true },
  },
  selected: {
    fill: "#b3cf99",
    stroke: null,
    label: { enabled: true },
  },
};
