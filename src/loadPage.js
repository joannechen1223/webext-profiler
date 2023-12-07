import { getBrowser } from "./helper/puppeteer";
import { bytesToMB, objAverage, sleep } from "./helper/utils.js";

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

const execute = async ({ url, testTitle }) => {
  console.log(`Start ${testTitle} test`);
  const noExtMetrics = [];
  const extMetrics = [];
  const iterations = process.env.ITERATIONS;
  const extNames = process.env.EXT_NAMES.split(",");
  let metrics = [];

  // no extension
  for (let i = 0; i < iterations; i++) {
    metrics.push(await loadPage(url));
  }
  noExtMetrics.push(objAverage(metrics));

  // with extension
  for (const extName of extNames) {
    metrics = [];
    for (let i = 0; i < iterations; i++) {
      metrics.push(await loadPage(url, { extName }));
    }
    extMetrics.push(objAverage(metrics));
  }

  console.table([...noExtMetrics, ...extMetrics]);
  console.log(`End ${testTitle} test`);
};

export default execute;
