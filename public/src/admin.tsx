/**
 * The entry point for the admin side wp-admin resource.
 */

import Vue from "vue";
import "setimmediate"; // Polyfill for yielding
import { pluginOptions } from "./util";
import App from "./components/admin/index.vue";
import { store } from "./store/";

new Vue({
    store,
    //el: pluginOptions.slug + "-component",
    render: (h) => h(App)
}).$mount(pluginOptions.slug + "-component");
