/* eslint-disable no-undef */
import fs from "fs";

import { metrics } from "../helper/metrics";
import { toISOLocal, yyyyMMddHHmm } from "../helper/datetime";
import { internalCss } from "./style";

const COLOR = {
  GREEN: "#ddead1",
  BLUE: "#bbdffb",
  RED: "#ffcbde",
};
const PERCENTAGE_THRESHOLD = 30;

export const generateReport = (reportContents) => {
  const metricsDisplay = {};
  Object.values(metrics).map(
    (value) => (metricsDisplay[value.label] = value.description)
  );

  const metricsHtml = `
    <div>
      <h2>Metrics</h2>
      ${objToUlElement(metricsDisplay)}
    </div>
  `;

  let contentHtml = "";
  reportContents.map((content, idx) => {
    const { title, meta, results, base } = content;
    const listElements = {
      ...meta,
      ["percentage highlight threshold"]: `+${PERCENTAGE_THRESHOLD}%`,
    };
    contentHtml += `
      <div>
        <h2>Test ${idx + 1}: ${title}</h2>
        ${objToUlElement(listElements)}
        ${resultsToHtmlTable(results, base)}
      </div>
    `;
  });

  const header = process.env.HEADER
    ? process.env.HEADER
    : "Extension Profiling Result";

  const d = new Date();
  const html = `
    <html>
      <head>
        <h1>${header}</h1>
        <div>${"Timestamp: " + toISOLocal(d)}</div>
        <style>${internalCss}</style>
      </head>
      <body>
        ${metricsHtml}
        ${contentHtml}
      </body>
    </html>
  `;

  const dir = "./reports";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const filename = process.env.FILENAME
    ? `${filename}_${yyyyMMddHHmm(d)}.html`
    : `extension_performance_test_report_${yyyyMMddHHmm(d)}.html`;
  fs.writeFileSync(`${dir}/${filename}`, html);
};

export const resultsToHtmlTable = (obj, base) => {
  const rows = Object.keys(obj);
  if (rows.length <= 0) console.error("no row");

  const cols = Object.keys(obj[rows[0]]);
  if (cols.length <= 0) console.error("no column");

  let table = `<table>`;
  table += `<tr>`;
  table += `<th>index</th>`;

  cols.forEach((col) => {
    const colDisplay = metrics[col]
      ? `${metrics[col].label} (${metrics[col].unit})`
      : col;
    table += `<th>${colDisplay}</th>`;
  });

  table += `</tr>`;

  rows.forEach((row) => {
    table += `<tr>`;
    const rowDisplay = row === base ? `${row} (base)` : row;
    table += `<td rowspan="2">${rowDisplay}</td>`;

    cols.forEach((col) => (table += `<td>${obj[row][col].toFixed(4)}</td>`));
    table += `</tr>`;

    if (!base) return;

    table += `<tr>`;
    cols.forEach((col) => {
      const diffPercentage = (obj[row][col] / obj[base][col]) * 100 - 100;
      const diffPercentageDisplay =
        diffPercentage > 0
          ? `+${diffPercentage.toFixed(2)}%`
          : `${diffPercentage.toFixed(2)}%`;

      let bgColor = "";
      if (row === base) {
        bgColor = COLOR.GREEN;
      } else if (diffPercentage > PERCENTAGE_THRESHOLD) {
        bgColor = COLOR.RED;
      } else {
        bgColor = COLOR.BLUE;
      }

      table += `<td bgcolor="${bgColor}">${diffPercentageDisplay}</td>`;
    });
    table += `</tr>`;
  });

  table += `</table>`;
  return table;
};

export const objToUlElement = (obj) => {
  let ul = "<ul>";
  for (const [key, value] of Object.entries(obj)) {
    ul += `
      <li>
        <p>
          <code>${key}</code> : ${value}
        </p>
      </li>
    `;
  }
  ul += "</ul>";
  return ul;
};
