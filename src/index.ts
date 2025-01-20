import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";

import { Browser } from "puppeteer";

import { formatSnippet } from "./format.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function processExample(browser: Browser, url: string, source: string, style: string, outDir: string): Promise<void> {
	const { name } = parse(source);
	const formatted = await formatSnippet(await readFile(source, "utf-8"), {
		highlight: { language: "javascript" },
		prettier: { parser: "espree", printWidth: 50, useTabs: false },
	});
	const styleCss = await readFile(join(__dirname, "..", "node_modules", "highlight.js", "styles", `${style}.css`), "utf-8");
	const page = await browser.newPage();
	await page.goto(url);
	await page.setContent(`<pre id="root" style="width: max-content;"><code class="language-javascript">${formatted}</code></pre>`);
	await page.addStyleTag({ content: styleCss });
	await writeFile(join(outDir, `${name}.html`), await page.content());
	await page.screenshot({
		clip: await page.$("#root").then((el) => el?.boundingBox()) ?? undefined,
		omitBackground: true,
		path: join(outDir, `${name}.png`),
		type: "png",
	});
}
