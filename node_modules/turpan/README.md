Turpan is a wrapped markdown renderer based on [markdown-it](https://github.com/markdown-it/markdown-it) and a lot of its plugins.

- [markdown-it-abbr](https://github.com/markdown-it/markdown-it-abbr)
- [markdown-it-block-embed](https://github.com/rotorz/markdown-it-block-embed)
- [markdown-it-container](https://github.com/markdown-it/markdown-it-container)
- [markdown-it-deflist](https://github.com/markdown-it/markdown-it-deflist)
- [markdown-it-emoji](https://github.com/markdown-it/markdown-it-emoji)
- [markdown-it-emphasis-alt](https://github.com/jay-hodgson/markdown-it-emphasis-alt)
- [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)
- [markdown-it-implicit-figures](https://github.com/arve0/markdown-it-implicit-figures)
- [markdown-it-imsize](https://github.com/tatsy/markdown-it-imsize)
- [markdown-it-ins](https://github.com/markdown-it/markdown-it-ins)
- [markdown-it-katex](https://github.com/waylonflinn/markdown-it-katex)
- [markdown-it-link-attributes](https://github.com/crookedneighbor/markdown-it-link-attributes)
- [markdown-it-mark](https://github.com/markdown-it/markdown-it-mark)
- [markdown-it-sub](https://github.com/markdown-it/markdown-it-sub)
- [markdown-it-sup](https://github.com/markdown-it/markdown-it-sup)
- [markdown-it-task-lists](https://github.com/revin/markdown-it-task-lists)
- [markdown-it-toc-and-anchor](https://github.com/medfreeman/markdown-it-toc-and-anchor)

## How to use

First, install it.

```bash
$ npm install -S turpan
```

Then require it in your script.

```javascript
var md = require('turpan');
console.log(md.render('# Hello world'));
// <h1 id="hello-world">Hello world <a class="markdownIt-Anchor" href="#hello-world">#</a></h1>
```

## License

MIT
