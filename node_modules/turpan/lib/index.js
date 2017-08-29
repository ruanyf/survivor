'use strict';

var MarkdownIt = require('markdown-it');
var hljs = require('highlight.js');

var md = new MarkdownIt({
  html:         true,        // Enable HTML tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />).
                              // This is only for full CommonMark compatibility.
  breaks:       true,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                              // useful for external highlighters.
  linkify:      true,        // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  typographer:  false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externaly.
  // If result starts with <pre... internal wrapper is skipped.
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

// Link attributes plugin for markdown-it markdown parser.
md.use(require('./plugins/link-attributes'), {
  target: '_blank',
  rel: 'noopener'
});

// A markdown-it plugin for size-specified image markups
md.use(require('markdown-it-imsize'));

// Render images occurring by itself in a paragraph as <figure><img ...></figure>
var implicitFigures = require('markdown-it-implicit-figures');
md.use(implicitFigures, {
  dataType: false,  // <figure data-type="image">, default: false 
  figcaption: true  // <figcaption>alternative text</figcaption>, default: false 
});

// adding emoji & emoticon syntax support.
var plugin_emoji = require('markdown-it-emoji');
md.use(plugin_emoji);

// Plugin for creating block-level custom containers
var plugin_container = require('markdown-it-container');
function renderContainer(tokens, idx, options, env, self) {
  if (tokens[idx].nesting === 1) {
    tokens[idx].attrJoin('role', 'alert');
    tokens[idx].attrJoin('class', 'alert');
    tokens[idx].attrJoin('class', `alert-${tokens[idx].info.trim()}`);
  }
  return self.renderToken(tokens, idx, options, env, self);
}
md.use(plugin_container, 'success', { render: renderContainer });
md.use(plugin_container, 'info', { render: renderContainer });
md.use(plugin_container, 'warning', { render: renderContainer });
md.use(plugin_container, 'danger', { render: renderContainer });

// create GitHub-style task lists
var plugin_taskLists = require('markdown-it-task-lists');
md.use(plugin_taskLists);

// Subscript (<sub>) tag plugin
md.use(require('markdown-it-sub'));

// Superscript (<sup>) tag plugin
md.use(require('markdown-it-sup'));

// Footnotes plugin
md.use(require('markdown-it-footnote'));

// Definition list (<dl>) tag
md.use(require('markdown-it-deflist'));

// Abbreviation (<abbr>) tag plugin
md.use(require('markdown-it-abbr'));

// <ins> tag plugin
md.use(require('markdown-it-ins'));

// <mark> tag plugin
md.use(require('markdown-it-mark'));

//  Does not abide by the markdown spec
//  this plugin does not rely on whitespace to determine if the marker is an open or close tag.
md.use(require('markdown-it-emphasis-alt'));

// detects and outputs block level embeds
md.use(require('./plugins/embed'), {});

/*
// Header anchors
var GithubSlugger = require('github-slugger');
var slugger = new GithubSlugger();
md.slugger = slugger;
md.use(require('markdown-it-anchor'), {
  level: 1,
  permalink: true,
  slugify: slugger.slug.bind(slugger),
  permalinkBefore: true,
});

// A table of contents plugin
md.use(require('markdown-it-table-of-contents'), {
  "includeLevel": [2, 3],
  // "slugify": slugger.slug.bind(slugger),
});

md.originRender = md.render;
md.render = function () {
  md.slugger.reset();
  return md.originRender.apply(md, arguments);
};
*/

// toc
var plugin_toc = require('./plugins/toc').default;
md.use(plugin_toc, {
  tocFirstLevel: 2,
  tocLastLevel: 3,
  anchorLinkBefore: false,
});

// Add Math to your Markdown
md.use(require('markdown-it-katex'));

module.exports = md;

