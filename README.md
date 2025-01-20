# Presentable

Easily create formatted code snippets for presentations.

## Usage

```bash
presentable --style 'stackoverflow-light' snippets/*.js
```

would create an image (`test.png`) like:

[![][1]][1]

as well as the HTML (`test.html`) used to render the image.

### Arguments

As well as a positional list of files to process, the CLI accepts the following flags:

- `--style`/`-s`: the Highlight.js style to use (default: `"default"`) - you can preview these [here][2]
- `--output`/`-o`: the directory to output to (default: `output/`)

[1]: docs/test.png
[2]: https://highlightjs.org/demo
