'use strict';

var test = require('tape');
var md = require('../lib');

test('markdown test', function (t) {
  t.plan(18);

  t.equal(
    md.render('`x = 2`'),
    '<p><code>x = 2</code></p>\n'
  );

  t.equal(
    md.render('```javascript\nx = 2\n```'),
    '<pre class="hljs"><code>x = <span class="hljs-number">2</span>\n</code></pre>\n'
  );

  t.equal(
    md.render('www.yahoo.com'),
    '<p><a href="http://www.yahoo.com" target="_blank" rel="noopener">www.yahoo.com</a></p>\n'
  );

  t.equal(
    md.render('test ![](image.png)'),
    '<p>test <img src="image.png" alt=""></p>\n'
  );

  t.equal(
    md.render('![test](image.png =100x200)'),
    '<figure><img src="image.png" alt="test" width="100" height="200"><figcaption>test</figcaption></figure>\n'
  );

  t.equal(
    md.render('![test](image.png "title")'),
    '<figure><img src="image.png" alt="test" title="title"><figcaption>test</figcaption></figure>\n'
  );

  t.equal(
    md.render(':)'),
    '<p>😃</p>\n'
  );

  t.equal(
    md.render('::: warning\n*here be dragons*\n:::'),
    '<div role="alert" class="alert alert-warning">\n<p><em>here be dragons</em></p>\n</div>\n'
  );

  t.equal(
    md.render('- [ ] Mercury\n- [x] Venus'),
    '<ul class="task-list">\n<li class="task-list-item"><input class="task-list-item-checkbox" disabled="" type="checkbox"> Mercury</li>\n<li class="task-list-item"><input class="task-list-item-checkbox" checked="" disabled="" type="checkbox"> Venus</li>\n</ul>\n'
  );

  t.equal(
    md.render('# Title'),
    '<h1 id="title">Title <a class="markdownIt-Anchor" href="#title">#</a></h1>\n'
  );

  t.equal(
    md.render('# Title\n## Title'),
    '<h1 id="title">Title <a class="markdownIt-Anchor" href="#title">#</a></h1>\n<h2 id="title-1">Title <a class="markdownIt-Anchor" href="#title-1">#</a></h2>\n'
  );

  t.equal(
    md.render('# 中文标题，你好 世界'),
    '<h1 id="中文标题，你好-世界">中文标题，你好 世界 <a class="markdownIt-Anchor" href="#中文标题，你好-世界">#</a></h1>\n'
  );

  t.equal(
    md.render('[TOC]\n## title1\n### 标题2\n#### title3\n## title4'),
    '<p><div id="toc" class="toc"><ul class="markdownIt-TOC">\n<li><a href="#title1">title1</a>\n<ul>\n<li><a href="#%E6%A0%87%E9%A2%982">标题2</a></li>\n</ul>\n</li>\n<li><a href="#title4">title4</a></li>\n</ul>\n</div></p>\n<h2 id="title1">title1 <a class="markdownIt-Anchor" href="#title1">#</a></h2>\n<h3 id="标题2">标题2 <a class="markdownIt-Anchor" href="#标题2">#</a></h3>\n<h4 id="title3">title3 <a class="markdownIt-Anchor" href="#title3">#</a></h4>\n<h2 id="title4">title4 <a class="markdownIt-Anchor" href="#title4">#</a></h2>\n'
  );

  t.equal(
    md.render('$\sqrt{3x-1}+(1+x)^2$'),
    '<p><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>s</mi><mi>q</mi><mi>r</mi><mi>t</mi><mrow><mn>3</mn><mi>x</mi><mo>−</mo><mn>1</mn></mrow><mo>+</mo><mo>(</mo><mn>1</mn><mo>+</mo><mi>x</mi><msup><mo>)</mo><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">sqrt{3x-1}+(1+x)^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height:0.8141079999999999em;"></span><span class="strut bottom" style="height:1.064108em;vertical-align:-0.25em;"></span><span class="base textstyle uncramped"><span class="mord mathit">s</span><span class="mord mathit" style="margin-right:0.03588em;">q</span><span class="mord mathit" style="margin-right:0.02778em;">r</span><span class="mord mathit">t</span><span class="mord textstyle uncramped"><span class="mord mathrm">3</span><span class="mord mathit">x</span><span class="mbin">−</span><span class="mord mathrm">1</span></span><span class="mbin">+</span><span class="mopen">(</span><span class="mord mathrm">1</span><span class="mbin">+</span><span class="mord mathit">x</span><span class="mclose"><span class="mclose">)</span><span class="vlist"><span style="top:-0.363em;margin-right:0.05em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span><span class="reset-textstyle scriptstyle uncramped"><span class="mord mathrm">2</span></span></span><span class="baseline-fix"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span>​</span></span></span></span></span></span></p>\n'
  );

  t.equal(
    md.render('a** b **c'),
    '<p>a<strong> b </strong>c</p>\n'
  );

  t.equal(
    md.render('@[youtube](lJIrF4YjHfQ)'),
    '<div class="block-embed block-embed-service-youtube"><iframe type="text/html" src="//www.youtube.com/embed/lJIrF4YjHfQ" frameborder="0" width="640" height="390" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>\n'
  );

  t.equal(
    md.render('@[youtube](https://nodejs.org/api/url.html)'),
    '<div class="block-embed block-embed-service-youtube"><iframe type="text/html" src="//www.youtube.com/embed/https://nodejs.org/api/url.html" frameborder="0" width="640" height="390" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>\n'
  );

  t.equal(
    md.render('@[pdf](https://papers.nips.cc/paper/5346-sequence-to-sequence-learning-with-neural-networks.pdf)'),
    '<div class="block-embed block-embed-service-pdf"><iframe type="text/html" src="https://papers.nips.cc/paper/5346-sequence-to-sequence-learning-with-neural-networks.pdf" frameborder="0" width="640" height="390"></iframe></div>\n'
  );
});
