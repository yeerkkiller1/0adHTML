//Can't use $location, because it depends on the broken base attribute which breaks svg.
//	DAMMIT

import angular = require("angular");

function isEmpty(obj) {
    if (typeof obj !== "object" && typeof obj !== "string" && typeof obj !== "undefined") return false;
    for (var key in obj) return false;
    return true;
}
export function getUrlParams(newObj?) {
    var obj = {};
    var params = window.location.search.slice(1);
    var parts = params.split("&");
    parts.forEach(function (part) {
        if (part.indexOf("=") < 0) {
            obj[part] = true;
            return;
        }
        var parts = part.split("=");
        if (!parts[0]) return;
        obj[parts[0]] = parts[1];
    });
    if (newObj) {
        for (var key in newObj) {
            obj[key] = newObj[key];
        }
    }
    return obj;
}
export function setUrlParams(obj) {
    var parts = [];
    obj = getUrlParams(obj);

    var url = toUrl(obj, true);

    if (pushNextState) {
        window.history.pushState('', '', url);
        pushNextState = false;
    } else {
        window.history.replaceState('', '', url);
        //angular.element(window).triggerHandler('popstate')
    }

    urlParamsLastValues = getUrlParams();
}
var pushNextState = false;
export function pushNextUrlChange() {
    pushNextState = true;
}

export function toUrl(obj, smartBooleans) {
    var parts = [];
    for (var key in obj) {
        if (!key) continue;
        var val = obj[key];
        if (val !== undefined && val !== null) {
            if (smartBooleans && typeof val === "boolean") {
                if (val) {
                    parts.push(key);
                }
            } else {
                parts.push(key + "=" + obj[key]);
            }
        }
    }
    if (parts.length === 0) return location["origin"] + location.pathname;
    return "?" + parts.join("&");
}

function identity(x) { return x; }
function simpleParse(varName) {
    var getter = function (context) {
        return context[varName];
    };

    getter["assign"] = function (context, newValue) {
        context[varName] = newValue;
    };

    return getter;
}

export function bindToUrl(scope, varName, urlName, $parse?) {
    bindObjToUrl(scope, varName, urlName, identity, identity, $parse);
}

export function bindObjToUrl(scope: angular.IScope, varName, urlName, parse, stringify, $parse) {
    scope.$on("$locationChangeStart", (event) => {
        //event.preventDefault();
        //event.defaultPrevented = true;
    });

    parse = parse || JSON.parse;
    stringify = stringify || JSON.stringify;
    $parse = $parse || simpleParse;

    var getter = $parse(varName);
    var setter = getter.assign;

    watchUrl(urlName, function (urlValue) {
        function applyToScope() {
            setter(scope, parse(decodeURIComponent(urlValue)));
        };
        if (scope.$root.$$phase) {
            applyToScope();
        } else {
            scope.$apply(applyToScope);
        }
    });
    scope.$watch(varName, function (newValue) {
        var urlObj = {};
        if (isEmpty(newValue)) {
            urlObj[urlName] = undefined;
        } else {
            var strValue = stringify(newValue);
            if (strValue === undefined) {
                urlObj[urlName] = strValue; //Don't encode undefined, it is special
            } else {
                urlObj[urlName] = encodeURIComponent(strValue);
            }
        }
        setUrlParams(urlObj);
    }, true);
}
var watchingUrl = false;
var urlParamsWatched = {};
var urlParamsLastValues = {};
function watchUrl(urlName, callback) {
    var callbacks = urlParamsWatched[urlName] = urlParamsWatched[urlName] || [];
    callbacks.push(callback);

    var urlValues = getUrlParams();

    if (urlName in urlValues) {
        callback(urlValues[urlName]);
    }

    if (watchingUrl) return;
    watchingUrl = true;
    urlParamsLastValues = urlValues;
    var onpopstate = window.onpopstate;
    window.onpopstate = function () {
        var urlValues = getUrlParams();

        for (var urlName in urlParamsWatched) {
            var callbacks = urlParamsWatched[urlName];
            if (urlValues[urlName] !== urlParamsLastValues[urlName]) {
                callbacks.forEach(function (callback) {
                    callback(urlValues[urlName])
                });
            }
        }

        urlParamsLastValues = urlValues;

        if (onpopstate) {
            onpopstate.apply(this, arguments);
        }
    };
}

export function bindHashSetToUrl(scope, varName, urlName, $parse?) {
    function setToString(set) {
        var arr = [];
        for (var key in set) {
            if (!set[key]) continue;
            arr.push(key);
        }
        if (arr.length === 0) return undefined;
        return arr.join(",");
    }
    function stringToSet(str) {
        var arr = str.split(",");
        var obj = {};
        arr.forEach(function (key) {
            obj[key] = true;
        });
        return obj;
    }

    bindObjToUrl(scope, varName, urlName, stringToSet, setToString, $parse);
}

export function bindBoolToUrl(scope, varName, urlName, $parse?) {
    function parseBool(str) {
        return (str === "false" || str === "0") ? undefined : true;
    }
    function stringifyBool(bool) {
        return bool;
    }
    bindObjToUrl(scope, varName, urlName, parseBool, stringifyBool, $parse);
}

export function bindNumberToUrl(scope, varName, urlName, $parse?) {
    function parse(str) {
        return +str;
    }
    function stringify(val) {
        return val.toString();
    }
    bindObjToUrl(scope, varName, urlName, parse, stringify, $parse);
}

/*
get: getUrlParams,
set: setUrlParams,
toUrl: toUrl,
//bindToUrl(scope, scopeVarName, urlName)
bindToUrl: bindToUrl,
bindObjToUrl: bindObjToUrl,
bindHashSetToUrl: bindHashSetToUrl,
bindBoolToUrl: bindBoolToUrl,
pushNextUrlChange: pushNextUrlChange
*/
