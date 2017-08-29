// Copyright (c) Rotorz Limited and portions by original markdown-it-video authors
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";

const YouTubeService = require("./services/YouTubeService");
const VimeoService = require("./services/VimeoService");
const VineService = require("./services/VineService");
const PreziService = require("./services/PreziService");
const PdfService = require("./services/PdfService");


class PluginEnvironment {

  constructor(md, options) {
    this.md = md;
    this.options = Object.assign(this.getDefaultOptions(), options);

    this._initServices();
  }

  _initServices() {
    let defaultServiceBindings = {
      "youtube": YouTubeService,
      "vimeo": VimeoService,
      "vine": VineService,
      "prezi": PreziService,
      "pdf": PdfService
    };

    let serviceBindings = Object.assign({}, defaultServiceBindings, this.options.services);
    let services = {};
    for (let serviceName of Object.keys(serviceBindings)) {
      let _serviceClass = serviceBindings[serviceName];
      services[serviceName] = new _serviceClass(serviceName, this.options[serviceName], this);
    }

    this.services = services;
  }

  getDefaultOptions() {
    return {
      containerClassName: "block-embed",
      serviceClassPrefix: "block-embed-service-",
      outputPlayerSize: true,
      allowFullScreen: true,
      filterUrl: null
    };
  }

}


module.exports = PluginEnvironment;
