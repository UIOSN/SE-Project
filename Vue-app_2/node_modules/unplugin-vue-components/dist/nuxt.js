import {
  unplugin_default
} from "./chunk-YOHL3P33.js";
import "./chunk-4KHLF5I7.js";
import "./chunk-3RG5ZIWI.js";
import "./chunk-6F4PWJZI.js";

// src/nuxt.ts
import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from "@nuxt/kit";
var nuxt_default = defineNuxtModule({
  setup(options) {
    addWebpackPlugin(unplugin_default.webpack(options));
    addVitePlugin(unplugin_default.vite(options));
  }
});
export {
  nuxt_default as default
};
