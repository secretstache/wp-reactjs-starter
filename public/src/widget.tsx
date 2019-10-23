/**
 * The entrypoint for the WordPress frontend widget.
 */

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/widget/index.vue";
import "setimmediate"; // Polyfill for yielding
import { store } from "./store/";

// Query DOM for all widget wrapper divs
const widgets = document.querySelectorAll("div.react-demo-wrapper");

// Iterate over the DOM nodes and render a React component into each node
widgets.forEach((item) => {
    new Vue({
        store,
        el: item,
        render: (h) => h(item)
    });
});
