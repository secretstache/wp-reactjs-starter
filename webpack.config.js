"use strict";
const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");

var NODE_ENV = process.env.NODE_ENV || "development";
var dist = path.join(__dirname, "public", NODE_ENV === "production" ? "dist" : "dev");

module.exports = {
    mode: NODE_ENV,
    entry: {
        widget: "./public/src/widget.tsx",
        admin: "./public/src/admin.tsx"
    },
    output: {
        path: dist,
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                exclude: /(disposables)/,
                use: "babel-loader?cacheDirectory"
            },
            {
                test: /\.vue$/,
                use: "vue-loader"
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        modules: ["node_modules", "public/src"]
    },
    plugins: [new VueLoaderPlugin()]
};
