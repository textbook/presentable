import hljs from "highlight.js";
import { format } from "prettier";

interface Options {
	highlight: import("highlight.js").HighlightOptions;
	prettier?: import("prettier").Options;
}

export async function formatSnippet(code: string, { highlight, prettier }: Options): Promise<string> {
	const formatted = await format(code, prettier);
	return hljs.highlight(formatted, highlight).value;
}
