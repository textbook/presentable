# Presentable

Easily create formatted code snippets for presentations.

## Installation

```bash
npm install --global presentable
```

Alternatively, prefix the below command with [`npx --yes`][3].

## Usage

```bash
presentable \
  --font 'JetBrains Mono' \
  --style 'stackoverflow-light' \
  path/to/snippets/*.js
```

would create an image (`test-1.png`) like:

[![Image of a formatted code sample][1]][1]

along with the HTML (`test-1.html`) used to render the image.

### Arguments

As well as a positional list of files to process, the CLI accepts the following flags:

- `--background`/`-b`: whether to include the background (default: `true`)
- `--font`/`-f`: the name of a font on [Google Fonts][4] to use (default: `undefined`, accept Chrome's default)
- `--output`/`-o`: the directory to output to (default: `"output/"`)
- `--style`/`-s`: the Highlight.js style to use (default: `"default"`) - you can preview these [here][2]
- `--width`/`-w`: the target [print width][5] (default: `50`, a reasonable fit for half a slide)

## Snippets

If a file contains folding regions, e.g.:

```javascript
// ... imports and setup

//#region: snippet
console.log("this is my example");
//#endregion
```

the code from each region is extracted and saved into a separate file.

[1]: docs/test.png
[2]: https://highlightjs.org/demo
[3]: https://docs.npmjs.com/cli/v10/commands/npx
[4]: https://fonts.google.com/?categoryFilters=Appearance:%2FMonospace%2FMonospace
[5]: https://prettier.io/docs/en/options.html#print-width
