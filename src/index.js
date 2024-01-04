import fs from 'fs';

import * as dotenv from 'dotenv';
dotenv.config();

import loadPage from './loadPage';
import { generateReport } from './report/generator';

const TEST_PAGES_PATH = process.env.TEST_PAGES_PATH || 'tests/example.json';

const execute = async () => {
  const testPages = JSON.parse(fs.readFileSync(TEST_PAGES_PATH, 'utf8'));
  const tests = testPages.map((testPage) => () => loadPage(testPage));

  const reportContents = [];
  for (const test of tests) reportContents.push(await test());

  generateReport(reportContents);
};

execute();
