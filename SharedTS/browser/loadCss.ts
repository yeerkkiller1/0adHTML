function loadCss(url) {
    if (window["CacheBlowUrl"]) {
        url = window["CacheBlowUrl"](url);
    }

    if (document.querySelector("link[href='" + url + "']")) return;
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

export = loadCss;