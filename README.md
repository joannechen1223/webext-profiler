# Webext-profiler

Webext-profiler analyzes the performance of browser extensions, collecting web performance metrics such as CPU consuming time and JS heap used size.

## Methodologies

Manually repeating tests is time-consuming and costly. Once the automation test is created, we are able to run same script with different extension versions.
Webext-profiler created the automated test process with [Puppeteer](https://pptr.dev/), which provides a high-level API to control Chrome/Chromium over the DevTools Protocol. By comparing performance metrics of browser with different extensions installed and without extension installed, developers are able to measure the performance impact of installing browser extension on Chomium browser in various dimensions.

## How to use?

### Prerequisites

- `node>=16.13.2`

### Installation

`yarn install`

### Preparation

1. Prepare **Extension**

- Test your own extension
  - Move your extension directory under `extensions`.
- Test other extensions locally installed in Chrome
  - Find your Chrome local profile directory. Open `chrome://version/` and find the `Profile Path:` field.

    <img width="600" alt="Screenshot 2023-12-10 at 3 39 26 PM" src="https://github.com/joannechen1223/webext-profiler/assets/22555930/62a62f6a-3890-4025-a239-8ca122a1d98d">

  - Find the extension id. Open `chrome://extensions/` and turn on the developer mode. The extension id field will appear in the extension block.

    <img width="600" alt="Screenshot 2023-12-10 at 3 43 09 PM" src="https://github.com/joannechen1223/webext-profiler/assets/22555930/92aad7a1-baee-46e7-a5ff-8cda2e678770">

  - Extract the extension from `/{Your profile path}/Extensions/{extension id}`. e.g. `/Users/joannechen/Library/Application Support/Google/Chrome/Default/Extensions/bmnlcjabgnpnenekpadlanbbkooimhnj`
  - Copy the extension to `./extensions` directory and rename it to `{NameOfExtension}`

2. Prepare **Environment Variables**
   The following variables are required when running performance test:

| Variable  | Description                                                                                                 | Example Value                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| EXT_NAMES | Extensions you want to test. Split by comma `,`                                                             | ex: `Grammarly` or `Grammarly,Rakuten_Cashback,PayPal_Honey` or `v7.1.0,v8.0.0` |
| BASE_EXT  | Which extensiojn you want to set its results as baseline to compare with other results, default to `no ext` | `Grammarly`                                                                     |
| ITERATIONS | How many times each test case will run, default to `10`                                                     | `10`                                                                            |
| HEADER    | Title performance report. Usually set to the target extension or version you would like to test             | `Grammarly Extension Performance Test`                                          |
| FILENAME  | Filename prefix of the report. Usually set to the target extension or version you would like to test        | `grammarly-extension-performance-report`                                        |

> You can follow `.env.sample` to create your own `.env` file, and fill in the correct value of the variables.

#### Run the test

```sh
yarn test
```

The test result will be printed in the terminal. An HTML report will be saved under `reports`
