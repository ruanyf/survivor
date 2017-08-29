# markdown-it-emphasis-alt

[![Build Status](https://img.shields.io/travis/jay-hodgson/markdown-it-emphasis-alt/master.svg?style=flat)](https://travis-ci.org/jay-hodgson/markdown-it-emphasis-alt)
[![NPM version](https://img.shields.io/npm/v/markdown-it-emphasis-alt.svg?style=flat)](https://www.npmjs.org/package/markdown-it-emphasis-alt)
[![Coverage Status](https://img.shields.io/coveralls/jay-hodgson/markdown-it-emphasis-alt/master.svg?style=flat)](https://coveralls.io/r/jay-hodgson/markdown-it-emphasis-alt?branch=master)

> Alternative parser for emphasis (`<em>` and `<strong>`) tag plugin for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.  Does not abide by the markdown spec - this plugin does not rely on whitespace to determine if the marker is an open or close tag.

__v1.+ requires `markdown-it` v4.+, see changelog.__

`*italic* and ** bold ** or _italic_ and __bold__` => `<em>italic</em> and <strong> bold </strong> or <em>italic</em> and <strong>bold</strong>`

## Install

node.js, browser:

```bash
npm install markdown-it-emphasis-alt --save
bower install markdown-it-emphasis-alt --save
```

## Use

```js
var md = require('markdown-it')()
            .use(require('markdown-it-emphasis-alt'));

md.render('*italic* and **bold**') // => '<em>italic</em> and <strong>bold</strong>'
```

_Differences in browser._ If you load script directly into the page, without
package system, module will add itself globally as `window.markdownitEmphasisAlt`.


## License

[MIT](https://github.com/markdown-it/markdown-it-emphasis-alt/blob/master/LICENSE)
