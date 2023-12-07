import path from "path";

import puppeteer from "puppeteer";

export const getBrowser = async (options = {}) => {
  const { extName } = options;
  const args = [`--window-size=800,600`];

  if (extName) {
    const pathToExtension = path.join(
      process.cwd(),
      "extensions",
      `${extName}`
    );
    args.push(
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`
    );
  }

  const browser = await puppeteer.launch({
    headless: false,
    args,
  });

  return browser;
};
