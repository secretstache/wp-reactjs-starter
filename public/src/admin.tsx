/**
 * The entry point for the admin side wp-admin resource.
 */

import React from "react";
import ReactDOM from "react-dom";
import { ComponentLibrary } from "./component-library";
import "setimmediate"; // Polyfill for yielding
import { pluginOptions } from "./util";

const node = document.getElementById(pluginOptions.slug + "-component");

if (node) {
    ReactDOM.render(<ComponentLibrary />, node);
}

// Expose this functionalities to add-ons, but you need to activate the library functionality
// in your webpack configuration, see also https://webpack.js.org/guides/author-libraries/
export * from "./util";
export * from "./rest";
export * from "./store";
