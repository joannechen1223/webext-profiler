export const metrics = {
  taskDuration: {
    label: "Task Duration",
    unit: "ms",
    description: "Combined duration of all tasks performed by the browser.",
  },
  layoutDuration: {
    label: "Layout Duration",
    unit: "ms",
    description: "Combined durations of all page layouts.",
  },
  recalcStyleDuration: {
    label: "Style Recalculation Duration",
    unit: "ms",
    description: "Combined duration of all page style recalculations.",
  },
  scriptDuration: {
    label: "Script Duration",
    unit: "ms",
    description: "Combined duration of JavaScript execution.",
  },
  jsHeapUsedSize: {
    label: "JS Heap Used Size",
    unit: "MB",
    description: "Used JavaScript heap size.",
  },
  pageLoadDuration: {
    label: "Page Load Duration",
    unit: "ms",
    description:
      "PerformanceNavigationTiming.loadEventEnd - PerformanceEntry.startTime",
  },
  subResourcesDuration: {
    label: "Sub Resources Duration",
    unit: "ms",
    description:
      "PerformanceNavigationTiming.loadEventEnd - PerformanceNavigationTiming.domContentLoadedEventEnd",
  },
  lcp: {
    label: "LCP",
    unit: "ms",
    description:
      "Largest Contentful Paint, the render time of the largest image or text block visible within the viewport.",
  },
};
