import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [id, ...frames] = process.argv.slice(2);

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({ serveUrl: bundled, id, puppeteerInstance: browser });

for (const f of frames) {
  const out = `/tmp/stills/${id}-${f}.png`;
  await renderStill({
    composition,
    serveUrl: bundled,
    output: out,
    frame: Number(f),
    puppeteerInstance: browser,
    overwrite: true,
  });
  console.log("still", out);
}

await browser.close({ silent: false });
