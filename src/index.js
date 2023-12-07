import * as dotenv from "dotenv";
dotenv.config();

import loadPage from "./loadPage";

const loadExamplePage = () =>
  loadPage({
    testTitle: "Load Example Page",
    url: "https://example.com/",
  });

const execute = async () => {
  const tests = [loadExamplePage];

  const reportContents = [];
  for (const test of tests) reportContents.push(await test());
};

execute();
