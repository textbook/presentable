#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { createBrowser } from "./browser.js";
import { processExample } from "./index.js";
import { createStaticServer } from "./server.js";
import { getStyleCss } from "./style.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const {
	positionals,
	values: { background, font, output, style, width },
} = parseArgs({
	allowPositionals: true,
	allowNegative: true,
	options: {
		background: { short: "b", type: "boolean", default: true },
		font: { short: "f", type: "string" },
		output: {
			short: "o",
			type: "string",
			default: join(__dirname, "..", "output"),
		},
		style: { short: "s", type: "string", default: "default" },
		width: { short: "w", type: "string", default: "50" },
	},
});

if (positionals.length === 0) {
	console.warn("no examples found");
	process.exit(0);
}

const browser = await createBrowser();
const server = await createStaticServer();
// @ts-ignore -- this is checked in createStaticServer
const port: number = server.address().port;
const styleCss = await getStyleCss(style);
await mkdir(output, { recursive: true });

try {
	for (const file of positionals) {
		await processExample(browser, `http://localhost:${port}`, file, output, {
			background,
			font,
			printWidth: parseInt(width, 10),
			styleCss,
		});
	}
} catch (err) {
	console.error(err);
	process.exitCode = 1;
} finally {
	await browser.close();
	server.close();
}
