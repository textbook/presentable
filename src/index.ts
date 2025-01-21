import { readFile, writeFile } from "node:fs/promises";
import { format, join, parse } from "node:path";

import { Browser, Page } from "puppeteer";

import { formatSnippet } from "./format.js";

interface Options {
	background: boolean;
	styleCss: string;
}

export async function processExample(
	browser: Browser,
	url: string,
	source: string,
	outDir: string,
	{ background, styleCss }: Options,
): Promise<void> {
	const { dir, ext, name } = parse(source);
	const content = await readFile(source, "utf-8");
	if (content.match(/^\/\/#region.*$/m) !== null) {
		await Promise.all(
			extractSnippets(content).map(async (snippet, index) => {
				const page = await loadPage(browser, url);
				await render(
					page,
					snippet,
					format({ dir, ext, name: `${name}-${index + 1}` }),
					outDir,
					{ background, styleCss },
				);
			}),
		);
		return;
	}
	const page = await loadPage(browser, url);
	await render(page, content, source, outDir, { background, styleCss });
}

function extractSnippets(content: string): string[] {
	const sections = content.split(/^\/\/(#(?:end)?region).*$/m);
	const snippets: string[] = [];
	sections.forEach((section, index) => {
		if (section === "#region") {
			snippets.push(sections[index + 1].trim());
		}
	});
	return snippets;
}

async function loadPage(browser: Browser, url: string): Promise<Page> {
	const page = await browser.newPage();
	await page.goto(url);
	return page;
}

async function render(
	page: Page,
	content: string,
	source: string,
	outDir: string,
	{ background, styleCss }: Options,
): Promise<void> {
	const formatted = await formatSnippet(content, {
		prettier: { filepath: source, printWidth: 50, useTabs: false },
	});
	await page.setContent(
		`<pre id="root" style="width: max-content;"><code class="hljs">${formatted}</code></pre>`,
	);
	await page.addStyleTag({ content: styleCss });
	if (!background) {
		await page.addStyleTag({
			content: ".hljs { background-color: transparent !important; }",
		});
	}
	const { name } = parse(source);
	const htmlFile = join(outDir, `${name}.html`);
	console.info(`writing ${htmlFile}`);
	await writeFile(htmlFile, await page.content());
	const pngFile = join(outDir, `${name}.png`);
	console.info(`writing ${pngFile}`);
	await page.screenshot({
		clip: (await page.$("#root").then((el) => el?.boundingBox())) ?? undefined,
		omitBackground: !background,
		path: pngFile,
		type: "png",
	});
}
