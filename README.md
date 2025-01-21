# Presentable

Easily create formatted code snippets for presentations.

## Installation

```bash
npm install --global presentable
```

Alternatively, prefix the below command with [`npx --yes`][3].

## Usage

```bash
presentable --style 'stackoverflow-light' path/to/snippets/*.js
```

would create an image (`test-1.png`) like:

[![Image of a formatted code sample][1]][1]

along with the HTML (`test-1.html`) used to render the image.

### Arguments

As well as a positional list of files to process, the CLI accepts the following flags:

- `--background`/`-b`: whether to include the background (default: `true`)
- `--output`/`-o`: the directory to output to (default: `"output/"`)
- `--style`/`-s`: the Highlight.js style to use (default: `"default"`) - you can preview these [here][2]

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
