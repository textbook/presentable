import cyf from "@codeyourfuture/eslint-config-standard";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		languageOptions: {
			globals: globals.node,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	cyf.configs.standard,
	tseslint.configs.recommendedTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	prettier,
	{
		files: ["**/*.js"],
		extends: [tseslint.configs.disableTypeChecked],
	},
	{
		files: ["**/*.test.ts"],
		rules: {
			"@typescript-eslint/no-floating-promises": [
				"error",
				{
					allowForKnownSafeCalls: [
						{
							from: "package",
							name: [
								"after",
								"afterEach",
								"before",
								"beforeEach",
								"describe",
								"it",
								"only",
								"skip",
								"suite",
								"todo"
							],
							package: "node:test",
						},
					],
				},
			],
		},
	},
	{
		ignores: ["lib/", "snippets/"],
	},
);
