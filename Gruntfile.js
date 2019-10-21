"use strict";

module.exports = function(grunt) {
    // Project configuration
    grunt.initConfig({
        SERVE_POST_TASKS: ["serveReadmeTxt", "clean:productionSource", "compress:installablePlugin"], // This grunt tasks runs after the serve is complete (some are defined in build/grunt.js)
        clean: {
            /**
             * Task to clean the already copied node modules to the public library folder.
             * This is needed for the copy-npmLibs task.
             */
            npmLibs: {
                expand: true,
                cwd: "public/lib/",
                src: ["react", "react-dom", "mobx", "mobx-state-tree"]
            },
            /**
             * Task to clean sourcemap ".map" and non-minified files from libraries which are not needed
             * on production build. This is useful for example to reduce the size of the plugin
             * itself because some hosting providers only allow an upload size of 2 MB if it
             * is sold outside of wordpress.org. See also strip_code:sourcemaps.
             */
            productionLibs: {
                expand: true,
                cwd: "<%= SERVE_DIR %>/public/lib",
                src: [
                    "mobx/lib/mobx.umd.js",
                    "mobx-state-tree/dist/mobx-state-tree.umd.js",
                    "react/umd/react.development.js",
                    "react-dom/umd/react-dom.development.js"
                ]
            }
        },
        strip_code: {
            /**
             * With clean:productionLibs all sourcemap files are cleaned. To avoid 404 errors
             * on client side you also need to remove the link to the sourcemap.
             */
            sourcemaps: {
                options: {
                    patterns: /^\/{2}#\s*sourceMappingURL=.*\.map\s*$/gim
                },
                expand: true,
                src: ["<%= SERVE_DIR %>/public/lib/mobx/lib/mobx.umd.min.js"]
            }
        },
        copy: {
            /**
             * Task to copy npm modules to the public library folder. This are mostly libraries you
             * enqueue in your Assets.class.php file and is added as "external" in your webpack config.
             */
            npmLibs: {
                expand: true,
                cwd: "node_modules",
                src: [
                    "react/umd/react.?(development|production.min).js",
                    "react-dom/umd/react-dom.?(development|production.min).js",
                    "mobx/lib/mobx.umd*.js",
                    "mobx-state-tree/dist/mobx-state-tree.umd*.js",
                    "?(react|react-dom|mobx)/LICENSE*"
                ],
                dest: "public/lib/"
            }
        }
    });

    // Load WP ReactJS Starter initial tasks
    require("./build/grunt.js")(grunt);
};
