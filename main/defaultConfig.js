function g() {
    return this;
}
g().requirejs.config({
    baseUrl: "/",
    paths: {
        "underscore": "libs/underscore",
        "angular": "libs/angular",
        "firebase": "libs/firebase",
        "Directive": "SharedTS/browser/Directive"
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
