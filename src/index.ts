import { readFile, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";

import { Browser } from "puppeteer";

import { formatSnippet } from "./format.js";

export async function processExample(browser: Browser, url: string, source: string, styleCss: string, outDir: string): Promise<void> {
	const { name } = parse(source);
	const formatted = await formatSnippet(await readFile(source, "utf-8"), {
		highlight: { language: "typescript" },
		prettier: { parser: "espree", printWidth: 50, useTabs: false },
	});
	const page = await browser.newPage();
	await page.goto(url);
	await page.setContent(`<pre id="root" style="width: max-content;"><code class="language-typescript">${formatted}</code></pre>`);
	await page.addStyleTag({ content: styleCss });
	await writeFile(join(outDir, `${name}.html`), await page.content());
	await page.screenshot({
		clip: await page.$("#root").then((el) => el?.boundingBox()) ?? undefined,
		omitBackground: true,
		path: join(outDir, `${name}.png`),
		type: "png",
	});
}
