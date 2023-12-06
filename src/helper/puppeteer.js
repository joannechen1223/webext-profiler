import puppeteer from "puppeteer";

export const getBrowser = async () => {
  const args = [`--window-size=800,600`];
  const browser = await puppeteer.launch({
    headless: false,
    args,
  });

  return browser;
};
