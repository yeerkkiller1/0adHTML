function g() {
    return this;
}
g().requirejs.config({
    baseUrl: "/",
    paths: {
        "underscore": "SharedTS/content/libs/underscore",
        "angular": "SharedTS/content/libs/angular",
        "firebase": "SharedTS/content/libs/firebase",
        "Directive": "SharedTS/content/SharedTS/browser/Directive"
    },
    shim: {
        angular: {
            exports: "angular"
        },
        firebase: {
            exports: "Firebase"
        }
    }
});
