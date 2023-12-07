import cliProgress from "cli-progress";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const bytesToMB = (bytes) => bytes / 1000000;

export const objAverage = (objList) => {
  const length = objList.length;
  if (!length) {
    console.error("No obj in the list");
    return {};
  }

  const keys = Object.keys(objList[0]);
  const initialValue = {};
  keys.map((key) => (initialValue[key] = 0));

  const accObj = objList.reduce((acc, cur) => {
    keys.map((key) => (acc[key] = acc[key] + cur[key]));
    return acc;
  }, initialValue);

  const avgObj = {};
  keys.map((key) => (avgObj[key] = accObj[key] / length));

  return avgObj;
};

export const getProgressBar = () =>
  new cliProgress.SingleBar(
    {
      format: "[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
      clearOnComplete: true,
    },
    cliProgress.Presets.legacy
  );
