import { pluginOptions, trailingslashit } from ".";
import Url from "url-parse";
import $ from "jquery";

// Use _method instead of Http verb
const WP_REST_API_USE_GLOBAL_METHOD = true;

enum ERouteHttpVerb {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

interface IRouteLocationInterface {
    path: string;
    namespace?: string;
    method?: ERouteHttpVerb;
}
interface IRouteRequestInterface {} // POST-Query in JSON-format
interface IRouteParamsInterface {} // Parameters in IRouteLocationInterface#path which gets resolved like "example/:id", items not found in the URL are appended as GET
interface IRouteResponseInterface {} // Result in JSON-format

function urlBuilder({
    location,
    params = {},
    nonce = true
}: {
    location: IRouteLocationInterface;
    params?: IRouteParamsInterface;
    nonce?: boolean;
}) {
    const apiUrl = new Url(pluginOptions.restRoot, window.location.href, true), // uri(pluginOptions.restRoot),
        query = apiUrl.query,
        permalinkPath = (query.rest_route as string) || apiUrl.pathname; // Determine path from permalink settings

    // Generate dynamic path
    const foundParams: string[] = [],
        path = location.path.replace(/\:([A-Za-z0-9-_]+)/g, (match: string, group: string) => {
            foundParams.push(group);
            return (params as any)[group];
        }),
        getParams: any = {};
    Object.keys(params)
        .filter((x) => foundParams.indexOf(x) === -1)
        .forEach((x) => {
            getParams[x] = encodeURIComponent((params as any)[x]);
        });

    const usePath = trailingslashit(permalinkPath) + trailingslashit(location.namespace || "wprjss/v1") + path;

    // Set https if site url is SSL
    if (new Url(window.location.href).protocol === "https:") {
        apiUrl.set("protocol", "https");
    }

    // Set path depending on permalink settings
    if (query.rest_route) {
        query.rest_route = usePath;
    } else {
        apiUrl.set("pathname", usePath); // Set path
    }

    // Append others
    if (nonce) {
        query._wpnonce = pluginOptions.restNonce;
    }
    if (WP_REST_API_USE_GLOBAL_METHOD && location.method !== ERouteHttpVerb.GET) {
        query._method = location.method;
    }

    return apiUrl.set("query", $.extend(true, {}, pluginOptions.restQuery, getParams, query));
}

async function ajax<
    Request extends IRouteRequestInterface,
    Params extends IRouteParamsInterface,
    Response extends IRouteResponseInterface
>({
    location,
    request,
    params,
    settings = {}
}: {
    location: IRouteLocationInterface;
    request?: Request;
    params?: Params;
    settings?: JQuery.AjaxSettings<any>;
}) {
    const builtUrl = urlBuilder({ location, params, nonce: false });

    // Use global parameter (see https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/)
    if (WP_REST_API_USE_GLOBAL_METHOD && location.method !== ERouteHttpVerb.GET) {
        settings.method = "POST";
    }

    const result = await $.ajax(
        $.extend(true, settings, {
            url: builtUrl.toString(),
            headers: {
                "X-WP-Nonce": pluginOptions.restNonce
            },
            data: request
        })
    );
    return result as Response;
}

export {
    ERouteHttpVerb,
    IRouteLocationInterface,
    IRouteRequestInterface,
    IRouteParamsInterface,
    IRouteResponseInterface,
    urlBuilder,
    ajax,
    Url
};
