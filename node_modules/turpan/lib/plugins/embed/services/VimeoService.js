// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";

const VideoServiceBase = require("./VideoServiceBase");


class VimeoService extends VideoServiceBase {

  getDefaultOptions() {
    return { width: 500, height: 281 };
  }

  extractVideoID(reference) {
    let match = reference.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    return match && typeof match[3] === "string" ? match[3] : reference;
  }

  getVideoUrl(videoID) {
    let escapedVideoID = this.env.md.utils.escapeHtml(videoID);
    return `//player.vimeo.com/video/${escapedVideoID}`;
  }

}


module.exports = VimeoService;
