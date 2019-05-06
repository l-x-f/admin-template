import Vue from "vue";

import Cookies from "js-cookie";

import "font-awesome/css/font-awesome.min.css";
import "normalize.css/normalize.css"; // a modern alternative to CSS resets

import Element from "element-ui";
import "./styles/element-variables.scss";

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "./icons"; // icon
import "./permission"; // permission control

import * as filters from "./filters"; // global filters

import "@/globalComponents"; //global  components

import "@babel/polyfill"; //   Compatible with IE

import locale from "element-ui/lib/locale/lang/zh-CN";
Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
  locale
});

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
