export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const bytesToMB = (bytes) => bytes / 1000000;
