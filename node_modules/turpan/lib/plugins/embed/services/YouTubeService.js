// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";

const VideoServiceBase = require("./VideoServiceBase");


class YouTubeService extends VideoServiceBase {

  getDefaultOptions() {
    return { width: 640, height: 390 };
  }

  extractVideoID(reference) {
    let match = reference.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&\?]*).*/);
    return match && match[7].length === 11 ? match[7] : reference;
  }

  getVideoUrl(videoID) {
    let escapedVideoID = this.env.md.utils.escapeHtml(videoID);
    return `//www.youtube.com/embed/${escapedVideoID}`;
  }

}


module.exports = YouTubeService;
