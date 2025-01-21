import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Page } from "puppeteer";

const styleDir = dirname(
	fileURLToPath(import.meta.resolve("highlight.js/styles/default.css")),
);

export async function loadFont(page: Page, font: string): Promise<void> {
	const headElement = await page.$("head");
	await headElement?.evaluate(
		(head, { font }) => {
			[
				{ href: "https://fonts.googleapis.com", rel: "preconnect" },
				{
					crossorigin: true,
					href: "https://fonts.gstatic.com",
					rel: "preconnect",
				},
				{
					href: `https://fonts.googleapis.com/css2?family=${font}:ital,wght@0,400;0,700;1,400;1,700&display=swap`,
					rel: "stylesheet",
				},
			].forEach(({ crossorigin, href, rel }) => {
				const link = document.createElement("link");
				link.crossOrigin = crossorigin ? "" : null;
				link.href = href;
				link.rel = rel;
				head.appendChild(link);
			});
		},
		{ font },
	);
	await page.addStyleTag({
		content: `
			.hljs {
				font-family: "${font}", serif;
				font-optical-sizing: auto;
				font-weight: 400;
				font-style: normal;
			}
		`,
	});
	await page.waitForNetworkIdle();
}

export async function getStyleCss(name: string): Promise<string> {
	const available = await getStyleNames();
	if (!available.includes(name)) {
		console.info(`available styles: ${available.join(", ")}`);
		throw new Error(`invalid style: ${name}`);
	}
	if (name.startsWith("base16-")) {
		return await readFile(
			join(styleDir, "base16", `${name.slice(7)}.min.css`),
			"utf-8",
		);
	}
	return await readFile(join(styleDir, `${name}.min.css`), "utf-8");
}

export async function getStyleNames(): Promise<string[]> {
	const base16themes = await readdir(join(styleDir, "base16"), {
		withFileTypes: false,
	});
	const themes = await readdir(styleDir, { withFileTypes: false });
	return [
		...base16themes
			.filter((name) => name.endsWith(".min.css"))
			.map((name) => `base16-${name}`),
		...themes.filter((name) => name.endsWith(".min.css")),
	].map((name) => name.slice(0, -8));
}
