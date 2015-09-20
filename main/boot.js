(function () {
    var g = (function g() {
        return this;
    })();
    g.require(["./defaultConfig"], function () {
        g.require(["main/main"], function () {
            angular.bootstrap(document, ["Base"]);
        });
    });
})();
