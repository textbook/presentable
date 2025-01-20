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
	values: { background, output, style },
} = parseArgs({
	allowPositionals: true,
	allowNegative: true,
	options: {
		background: { short: "b", type: "boolean", default: true },
		output: {
			short: "o",
			type: "string",
			default: join(__dirname, "..", "output"),
		},
		style: { short: "s", type: "string", default: "default" },
	},
});

if (positionals.length === 0) {
	console.warn("no examples found");
	process.exit(0);
}

const browser = await createBrowser();
const server = createStaticServer();
// @ts-ignore -- this is checked in createStaticServer
const port: number = server.address().port;
const styleCss = await getStyleCss(style);

try {
	for (const file of positionals) {
		await processExample(
			browser,
			`http://localhost:${port}`,
			file,
			styleCss,
			output,
			background,
		);
	}
} catch (err) {
	console.error(err);
	process.exitCode = 1;
} finally {
	await browser.close();
	server.close();
}
