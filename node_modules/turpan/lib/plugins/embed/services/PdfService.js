"use strict";

const VideoServiceBase = require("./VideoServiceBase");


class PdfService extends VideoServiceBase {

  getDefaultOptions() {
    return {
      width: 640,
      height: 390,
      allowFullScreen: false,
    };
  }

  getVideoUrl(videoID) {
    return videoID;
  }
}


module.exports = PdfService;
