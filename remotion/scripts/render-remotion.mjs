import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ids = process.argv.slice(2);
const outDir = process.env.OUT_DIR ?? "/home/lovable";

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: {
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  },
  chromeMode: "chrome-for-testing",
});

for (const id of ids) {
  const composition = await selectComposition({
    serveUrl: bundled,
    id,
    puppeteerInstance: browser,
  });
  const outputLocation = path.join(outDir, `blc-ai-${id}.mp4`);
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    crf: 18,
    outputLocation,
    puppeteerInstance: browser,
    muted: true,
    concurrency: 1,
  });
  console.log("rendered", outputLocation);
}

await browser.close({ silent: false });
