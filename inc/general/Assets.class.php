<?php
namespace MatthiasWeb\WPRJSS\general;
use MatthiasWeb\WPRJSS\base;
use MatthiasWeb\WPRJSS\rest;

defined('ABSPATH') or die('No script kiddies please!'); // Avoid direct file request

/**
 * Asset management for frontend scripts and styles.
 */
class Assets extends base\Assets {
    /**
     * Enqueue scripts and styles depending on the type. This function is called
     * from both admin_enqueue_scripts and wp_enqueue_scripts. You can check the
     * type through the $type parameter. In this function you can include your
     * external libraries from public/lib, too.
     *
     * @param string $type The type (see base\Assets constants)
     */
    public function enqueue_scripts_and_styles($type) {
        $publicFolder = $this->getPublicFolder();
        $isDebug = $this->isScriptDebug();
        $dpSuffix = $isDebug ? 'development' : 'production.min';
        $minSuffix = $isDebug ? '' : '.min';

        // React (first check version is minium 16.8 so hooks work correctly)
        $coreReact = wp_scripts()->query('react');
        if ($coreReact !== false && version_compare($coreReact->ver, '16.8', '<')) {
            wp_deregister_script('react');
            wp_deregister_script('react-dom');
        }

        // Both in admin interface (page) and frontend (widgets)
        $this->enqueueLibraryScript('react', 'react/umd/react.' . $dpSuffix . '.js');
        $this->enqueueLibraryScript('react-dom', 'react-dom/umd/react-dom.' . $dpSuffix . '.js', 'react');

        // mobx
        $this->enqueueLibraryScript('mobx', 'mobx/lib/mobx.umd' . $minSuffix . '.js');

        // mobx-state-tree
        $this->enqueueLibraryScript('mobx-state-tree', 'mobx-state-tree/dist/mobx-state-tree.umd.js', ['mobx']);

        // Your assets implementation here... See base\Assets for enqueue* methods
        $scriptDeps = ['react-dom', 'lodash', 'moment', 'wp-i18n'];
        if ($type === base\Assets::TYPE_ADMIN) {
            $handle = WPRJSS_SLUG . '-admin';
            $this->enqueueScript($handle, 'admin.js', $scriptDeps);
            $this->enqueueStyle($handle, 'admin.css');
            wp_set_script_translations($handle, WPRJSS_TD, path_join(WPRJSS_PATH, base\Assets::PUBLIC_JSON_I18N));
            wp_localize_script($handle, WPRJSS_OPT_PREFIX . 'Opts', $this->localizeScript($type));
        } else {
            $handle = WPRJSS_SLUG . '-widget';
            $this->enqueueScript($handle, 'widget.js', $scriptDeps);
            $this->enqueueStyle($handle, 'widget.css');
            wp_set_script_translations($handle, WPRJSS_TD, path_join(WPRJSS_PATH, base\Assets::PUBLIC_JSON_I18N));
            wp_localize_script($handle, WPRJSS_OPT_PREFIX . 'Opts', $this->localizeScript($type));
        }

        // Localize with a window.process.env variable for libraries relying on it (MST for example)
        wp_localize_script('react', 'process', [
            'env' => ['NODE_ENV' => $isDebug ? 'development' : 'production']
        ]);
    }

    /**
     * Localize the WordPress backend and frontend. If you want to provide URLs to the
     * frontend you have to consider that some JS libraries do not support umlauts
     * in their URI builder. For this you can use base\Assets#getAsciiUrl.
     *
     * @returns array
     */
    public function localizeScript($context) {
        $common = [
            'slug' => WPRJSS_SLUG,
            'textDomain' => WPRJSS_TD,
            'version' => WPRJSS_VERSION
        ];

        // We put custom variables to "others" because if you put for example
        // a boolean to the first-level it is interpreted as "1" instead of true.
        if ($context === base\Assets::TYPE_ADMIN) {
            return array_merge($common, [
                'others' => [
                    // Put your custom variables here
                ],
                'restUrl' => $this->getAsciiUrl(rest\Service::getUrl(rest\Service::SERVICE_NAMESPACE)),
                'restRoot' => $this->getAsciiUrl(get_rest_url()),
                'restQuery' => ['_v' => WPRJSS_VERSION],
                'restNonce' => wp_installing() && !is_multisite() ? '' : wp_create_nonce('wp_rest'),
                'publicUrl' => trailingslashit(plugins_url('public', WPRJSS_FILE))
            ]);
        } else {
            return array_merge($common, [
                /* Your frontend variables for the widget */
                'others' => [
                    // Put your custom variables here
                ]
            ]);
        }
    }

    /**
     * Enqueue scripts and styles for admin pages.
     */
    public function admin_enqueue_scripts() {
        $this->enqueue_scripts_and_styles(base\Assets::TYPE_ADMIN);
    }

    /**
     * Enqueue scripts and styles for frontend pages.
     */
    public function wp_enqueue_scripts() {
        $this->enqueue_scripts_and_styles(base\Assets::TYPE_FRONTEND);
    }
}
