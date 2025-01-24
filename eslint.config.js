import cyf from "@codeyourfuture/eslint-config-standard";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		languageOptions: {
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
		ignores: ["lib/", "snippets/"],
	},
);
