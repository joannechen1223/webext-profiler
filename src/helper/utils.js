import cliProgress from "cli-progress";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const bytesToMB = (bytes) => bytes / 1000000;

export const round = (num, decimalPlaces = 0) => {
  const p = Math.pow(10, decimalPlaces);
  return Math.round((num + Number.EPSILON) * p) / p;
};

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
  keys.map((key) => (avgObj[key] = round(accObj[key] / length, 4)));

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
