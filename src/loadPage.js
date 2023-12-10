import { v4 as uuid } from "uuid";

import { getBrowser } from "./helper/puppeteer";
import {
  bytesToMB,
  getProgressBar,
  objAverage,
  sleep,
} from "./helper/utils.js";
import { baseExtChartSettings } from "./report/chart";

const BASE_EXT = process.env.BASE_EXT || "no ext";

const loadPage = async (url, options) => {
  const browser = await getBrowser(options);

  await sleep(5000);

  // prewarm sub resource cache
  const tmp = await browser.newPage();
  await tmp.goto(url, { waitUntil: "networkidle0", timeout: 0 });
  await tmp.close();

  // testing target page
  const page = await browser.newPage();
  await page.bringToFront();
  await page.goto(url, { waitUntil: "networkidle0", timeout: 0 });

  const metrics = await page.metrics();
  const performanceTimingJson = await page.evaluate(() => {
    const perf = window.performance.getEntriesByType("navigation")[0];
    return JSON.stringify({
      pageLoadDuration: perf.duration,
      subResourcesDuration: perf.loadEventEnd - perf.domContentLoadedEventEnd,
    });
  });
  const performanceTiming = JSON.parse(performanceTimingJson);

  await browser.close();

  return {
    taskDuration: metrics.TaskDuration * 1000,
    layoutDuration: metrics.LayoutDuration * 1000,
    recalcStyleDuration: metrics.RecalcStyleDuration * 1000,
    scriptDuration: metrics.ScriptDuration * 1000,
    pageLoadDuration: performanceTiming.pageLoadDuration,
    subResourcesDuration: performanceTiming.subResourcesDuration,
    jsHeapUsedSize: bytesToMB(metrics.JSHeapUsedSize),
  };
};

export const generateCharts = (results) => {
  const extNames = Object.keys(results);
  const data = {
    taskDuration: [],
    pageLoadDuration: [],
    jsHeapUsedSize: [],
  };

  extNames.forEach((extName) => {
    data.taskDuration.push({
      x: extName,
      value: results[extName].taskDuration,
      ...(extName == BASE_EXT && baseExtChartSettings),
    });

    data.pageLoadDuration.push({
      x: extName,
      value: results[extName].pageLoadDuration,
      ...(extName == BASE_EXT && baseExtChartSettings),
    });

    data.jsHeapUsedSize.push({
      x: extName,
      value: results[extName].jsHeapUsedSize,
      ...(extName == BASE_EXT && baseExtChartSettings),
    });
  });

  const uniqueId = uuid().substring(0, 8);
  const charts = [
    {
      data: data.taskDuration,
      title: "Task Duration(ms)",
      containerId: `${uniqueId}-load-page-task-duration-container`,
      axis: ["Extension", "Time (ms)"],
    },
    {
      data: data.pageLoadDuration,
      title: "Page Load Duration(ms)",
      containerId: `${uniqueId}-load-page-page-load-duration-container`,
      axis: ["Extension", "Time (ms)"],
    },
    {
      data: data.jsHeapUsedSize,
      title: "JS Heap Used Size(MB)",
      containerId: `${uniqueId}-load-page-js-heap-used-size-container`,
      axis: ["Extension", "Size (MB)"],
    },
  ];

  return charts;
};

const execute = async ({ url, testTitle }) => {
  console.log(`Start ${testTitle} test`);
  const iterations = process.env.ITERATIONS;
  const extNames = process.env.EXT_NAMES.split(",");
  const results = {};

  const progressBar = await getProgressBar();
  const total = (extNames.length + 1) * iterations;
  let count = 0;
  progressBar.start(total, 0);

  // no extension
  let metrics = [];
  for (let i = 0; i < iterations; i++) {
    metrics.push(await loadPage(url));
    progressBar.update(++count);
  }
  results["no ext"] = objAverage(metrics);

  // with extension
  for (const extName of extNames) {
    metrics = [];
    for (let i = 0; i < iterations; i++) {
      metrics.push(await loadPage(url, { extName }));
      progressBar.update(++count);
    }
    results[extName] = objAverage(metrics);
  }

  progressBar.stop();

  console.table(results);
  console.log(`End ${testTitle} test`);
  return {
    title: testTitle,
    meta: {
      iteration: process.env.ITERATIONS,
      extNames: extNames.join(", "),
      url,
    },
    results,
    base: BASE_EXT,
    charts: generateCharts(results),
  };
};

export default execute;
