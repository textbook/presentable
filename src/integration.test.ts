import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { dirname, join } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import type { Browser } from "puppeteer";
import type { Worker } from "tesseract.js";
import { createWorker, OEM } from "tesseract.js";

import { createBrowser } from "./browser.js";
import { processExample } from "./index.js";
import { getStyleCss } from "./style.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tmpDir = join(__dirname, "..", "tmp");

let browser: Browser;
let outDir: string;
let worker: Worker;

before(async () => {
	browser = await createBrowser();
	outDir = await mkdtemp(join(tmpDir, "test-"));
	worker = await createWorker(["eng"], OEM.DEFAULT, {
		cachePath: tmpDir,
		logger: console.log,
	});
});

after(async () => {
	await browser?.close();
	await worker?.terminate();
});

describe("presentable", () => {
	it("creates PNG files containing the code sample", async () => {
		await processExample(
			browser,
			join(__dirname, "..", "snippets", "Component.jsx"),
			outDir,
			{
				background: true,
				printWidth: 100,
				styleCss: await getStyleCss("default"),
			},
		);
		const { data } = await worker.recognize(join(outDir, "Component.png"));
		assert.match(data.text, /^export function Component/);
	});
});
