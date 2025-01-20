import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { launch } from "puppeteer";

import { formatSnippet } from "./format.js";
import { createStaticServer } from "./server.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const style = "github";

const server = createStaticServer();
let port = 0;
server.listen(port, () => {
	const address = server.address();
	if (typeof address === "object" && address !== null) {
		port = address.port;
	}
	console.debug(`listening on ${port}`);
});
const browser = await launch({
	defaultViewport: {
		deviceScaleFactor: 4,
		height: 768,
		width: 1_024,
	},
});
const page = await browser.newPage();
await page.goto(`http://localhost:${port}`);
const content = await readFile(join(__dirname, "..", "snippets", "example.js"), "utf-8");
const formatted = await formatSnippet(content, {
	highlight: { language: "javascript" },
	prettier: { parser: "espree", printWidth: 50, useTabs: false },
});
await page.setContent(`<pre id="root" style="width: max-content;"><code class="language-javascript">${formatted}</code></pre>`);
await page.addStyleTag({
	content: await readFile(join(__dirname, "..", "node_modules", "highlight.js", "styles", `${style ?? "default"}.css`), "utf-8"),
});
await writeFile(join(__dirname, "..", "output", "test.html"), await page.content());
await page.screenshot({
	clip: await page.$("#root").then((el) => el?.boundingBox()) ?? undefined,
	omitBackground: true,
	path: join(__dirname, "..", "output", "test.png"),
	type: "png",
});
await browser.close();
server.close();
