/*! markdown-it-emphasis-alt 1.0.8 https://github.com/jay-hodgson/markdown-it-emphasis-alt @license MIT */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownitEmphasisAlt = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Process emphasis

'use strict';
// single or double marker is toggled
var isSingleOpen;
var isDoubleOpen;
var newlinePos;
var newlinePosSrc;
var initialized = false;
var WORD_CHAR_TEST_RE = /[a-zA-Z0-9]/;

function reset(_newSrc, _newlinePos) {
  isSingleOpen = false;
  isDoubleOpen = false;
  if (_newlinePos) {
    newlinePos = _newlinePos;
  } else {
    newlinePos = 0;
  }
  newlinePosSrc = _newSrc;
}

function tokenize(state, silent) {
  var token,
    lastChar, nextChar,
    start = state.pos,
    marker = state.src.charCodeAt(start),
    isDouble = false,
    nextNewlinePos = start;
  if (silent) { return false; }

  if (marker !== 0x5F /* _ */ && marker !== 0x2A /* * */) { return false; }
  lastChar = start > 0 ? String.fromCharCode(state.src.charCodeAt(start - 1)) : ' ';
  nextChar = state.pos + 1 < state.posMax ? String.fromCharCode(state.src.charCodeAt(state.pos + 1)) : ' ';

  if (marker === 0x5F /* _ */ &&
      WORD_CHAR_TEST_RE.test(lastChar) &&
      WORD_CHAR_TEST_RE.test(nextChar)) {
    // this could be a filename
    return false;
  }

  if (start + 1 <= state.posMax) {
    if (state.src.charCodeAt(start + 1) === marker) {
      isDouble = true;
    }
  }
  while (nextNewlinePos < state.posMax) {
    if (state.src.charAt(nextNewlinePos) === '\n') {
      break;
    }
    nextNewlinePos++;
  }
  if (state.src !== newlinePosSrc || nextNewlinePos > newlinePos) {
    reset(state.src, nextNewlinePos);
  }

  token         = state.push('text', '', 0);
  token.content = String.fromCharCode(marker);
  if (isDouble) {
    isDoubleOpen = !isDoubleOpen;
    token.content += String.fromCharCode(marker);
  } else {
    isSingleOpen = !isSingleOpen;
  }

  state.delimiters.push({
    // Char code of the starting marker (number).
    //
    marker: marker,

    // An amount of characters before this one that's equivalent to
    // current one. In plain English: if this delimiter does not open
    // an emphasis, neither do previous `jump` characters.
    //
    // Used to skip sequences like "*****" in one step, for 1st asterisk
    // value will be 0, for 2nd it's 1 and so on.
    //
    jump:   0,

    // A position of the token this delimiter corresponds to.
    //
    token:  state.tokens.length - 1,

    // Token level.
    //
    level:  state.level,

    // If this delimiter is matched as a valid opener, `end` will be
    // equal to its position, otherwise it's `-1`.
    //
    end:    -1,

    // Boolean flags that determine if this delimiter could open or close
    // an emphasis.
    //
    open:   isDouble ? isDoubleOpen : isSingleOpen,
    close:  isDouble ? !isDoubleOpen : !isSingleOpen,
    isDoubleMarker: isDouble
  });
  state.pos++;
  if (isDouble) {
    state.pos++;
  }

  return true;
}

function postProcess(state) {
  var i,
      startDelim,
      endDelim,
      token,
      ch,
      isStrong,
      delimiters = state.delimiters,
      max = state.delimiters.length;

  for (i = 0; i < max; i++) {
    startDelim = delimiters[i];

    if (startDelim.marker !== 0x5F/* _ */ && startDelim.marker !== 0x2A/* * */) {
      continue;
    }

    // Process only opening markers
    if (startDelim.end === -1) {
      continue;
    }

    endDelim = delimiters[startDelim.end];

    isStrong = startDelim.isDoubleMarker;

    ch = String.fromCharCode(startDelim.marker);

    token         = state.tokens[startDelim.token];
    token.type    = isStrong ? 'strong_open' : 'em_open';
    token.tag     = isStrong ? 'strong' : 'em';
    token.nesting = 1;
    token.markup  = isStrong ? ch + ch : ch;
    token.content = '';

    token         = state.tokens[endDelim.token];
    token.type    = isStrong ? 'strong_close' : 'em_close';
    token.tag     = isStrong ? 'strong' : 'em';
    token.nesting = -1;
    token.markup  = isStrong ? ch + ch : ch;
    token.content = '';
  }
}
module.exports = function emphasis_alt(md) {
  reset(0);
  if (!initialized) {
    md.disable('emphasis');
    md.inline.ruler.before('emphasis', 'emphasis_alt', tokenize);
    md.inline.ruler2.before('emphasis', 'emphasis_alt', postProcess);
    initialized = true;
  }
};

},{}]},{},[1])(1)
});