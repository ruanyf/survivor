/*
 * copied from https://github.com/crookedneighbor/markdown-it-link-attributes/blob/master/index.js
 */

'use strict'

function markdownitLinkAttributes (md, config) {
  config = config || {}

  var defaultRender = md.renderer.rules.link_open || this.defaultRender
  var attributes = Object.keys(config)

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {

    function attrIndex(arr, attr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][0] === attr) {
          return i;
        }
        return -1;
      }
    }

    var href = tokens[idx].attrs[attrIndex(tokens[idx].attrs, 'href')];
    if (!href || !href[1] || (href[1][0] === '#')) {
      return defaultRender(tokens, idx, options, env, self);
    }


    attributes.forEach(function (attr) {
      var value = config[attr]
      var aIndex = attrIndex(tokens[idx].attrs, attr)

      if (aIndex < 0) { // attr doesn't exist, add new attribute
        tokens[idx].attrPush([attr, value])
      } else { // attr already exists, overwrite it
        tokens[idx].attrs[aIndex][1] = value // replace value of existing attr
      }
    })

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self)
  }
}

markdownitLinkAttributes.defaultRender = function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

module.exports = markdownitLinkAttributes
