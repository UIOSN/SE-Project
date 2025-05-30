"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkV7E5BH3Ycjs = require('./chunk-V7E5BH3Y.cjs');
require('./chunk-5RDO6MHS.cjs');
require('./chunk-OBGZSXTJ.cjs');
require('./chunk-ZBPRDZS4.cjs');

// src/nuxt.ts
var _kit = require('@nuxt/kit');
var nuxt_default = _kit.defineNuxtModule.call(void 0, {
  setup(options) {
    _kit.addWebpackPlugin.call(void 0, _chunkV7E5BH3Ycjs.unplugin_default.webpack(options));
    _kit.addVitePlugin.call(void 0, _chunkV7E5BH3Ycjs.unplugin_default.vite(options));
  }
});


exports.default = nuxt_default;
