import hljs from "highlight.js";
import { format } from "prettier";

interface Options {
	prettier?: import("prettier").Options;
}

const prettierSupported: string[] = [
	"css",
	"graphql",
	"handlebars",
	"html",
	"javascript",
	"json",
	"less",
	"markdown",
	"scss",
	"typescript",
	"yaml",
];

export async function formatSnippet(
	code: string,
	{ prettier }: Options,
): Promise<{ content: string; language?: string; }> {
	const formatted = await format(code, prettier);
	const result = hljs.highlightAuto(formatted, prettierSupported);
	return { content: result.value, language: result.language };
}
