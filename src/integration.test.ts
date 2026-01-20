import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { Window } from "happy-dom";
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
let window: Window;
let worker: Worker;

before(async () => {
	browser = await createBrowser();
	outDir = await mkdtemp(join(tmpDir, "test-"));
	window = new Window();
	worker = await createWorker(["eng"], OEM.DEFAULT, { cachePath: tmpDir });
});

after(async () => {
	await browser?.close();
	await window.happyDOM.close();
	await worker?.terminate();
});

describe("presentable", () => {
	it("creates PNG files containing the code sample", async () => {
		await processExample(
			browser,
			join(__dirname, "..", "snippets", "test.js"),
			outDir,
			{
				background: true,
				printWidth: 100,
				styleCss: await getStyleCss("default"),
			},
		);

		const { data } = await worker.recognize(join(outDir, "test.png"));
		assert.match(data.text, /^describe\s*\(/);
	});

	it("creates HTML files containing the code sample", async () => {
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

		const window = new Window();
		window.document.write(
			await readFile(join(outDir, "Component.html"), "utf-8"),
		);
		await window.happyDOM.waitUntilComplete();
		assert.match(
			window.document.querySelector("pre#root > code.hljs")?.textContent ?? "",
			/^export function Component/,
		);
	});
});
