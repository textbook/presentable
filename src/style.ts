import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const styleDir = join(__dirname, "..", "node_modules", "highlight.js", "styles")

export async function getStyleCss(name: string): Promise<string> {
	const available = await getStyleNames();
	if (!available.includes(name)) {
		throw new Error(`invalid style: ${name}`);
	}
	return await readFile(join(styleDir, `${name}.min.css`), "utf-8");
}

export async function getStyleNames(): Promise<string[]> {
	const files = await readdir(styleDir, { withFileTypes: false });
	return files.filter((name) => name.endsWith(".min.css")).map((name) => name.slice(0, -8));
}
