define(["require", "exports", "./loadCss"], function (require, exports, loadCss) {
    var Directive = (function () {
        function Directive() {
            var _this = this;
            for (var key in Directive.prototype) {
                if (key === "link" || key === "createScope" || key === "construct" || key === "safeApply")
                    continue;
                if (typeof this[key] === "function") {
                    (function (key) {
                        var self = _this;
                        _this[key] = function () {
                            self.scope[key].apply(self.scope, arguments);
                        };
                    })(key);
                }
            }
        }
        Directive.prototype.$apply = function (x) { throw new Error(); };
        Directive.prototype.$applyAsync = function (x) { };
        Directive.prototype.$broadcast = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return null;
        };
        Directive.prototype.$destroy = function () { };
        Directive.prototype.$digest = function () { };
        Directive.prototype.$emit = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return null;
        };
        Directive.prototype.$eval = function (x) { };
        Directive.prototype.$evalAsync = function (x) { };
        Directive.prototype.$new = function (isolate, parent) { return null; };
        Directive.prototype.$on = function (name, listener) { return null; };
        Directive.prototype.$watch = function (x, y, z) { };
        Directive.prototype.$watchCollection = function (x, y, z) { };
        Directive.prototype.$watchGroup = function (x, y, z) { };
        Directive.prototype.createScope = function () {
            var scope = {};
            for (var key in this) {
                if (key[0] === "$")
                    continue;
                var val = this[key];
                if (val === "=" || val === "=?"
                    || val === "&" || val === "&?"
                    || val === "@" || val === "@?") {
                    scope[key] = val;
                }
                else if (typeof val !== "function") {
                    scope[key] = "=?";
                }
            }
            this.scope = scope;
            this.link = this.link.bind(this);
            return this;
        };
        Directive.prototype.link = function (scope, element, attrs) {
            if ("cssUrl" in this) {
                var cssUrl = this["cssUrl"];
                if (typeof cssUrl === "function") {
                    cssUrl = cssUrl(element, attrs);
                }
                if (cssUrl) {
                    loadCss(cssUrl);
                }
            }
            this.scope = scope;
            for (var key in this) {
                if (key[0] === "$")
                    continue;
                var val = this[key];
                if (typeof val === "function") {
                    scope[key] = val.bind(scope);
                }
                else if (val !== "=" && val !== "=?") {
                    if (!(key in scope)) {
                        //Must be an optional param, or else it would have been set
                        scope[key] = val;
                    }
                }
            }
            scope.element = element;
            scope.construct(element, attrs);
        };
        Directive.prototype.safeApply = function () {
            if (!this.$root.$$phase)
                this.$apply();
        };
        Directive.prototype.construct = function (element, attrs) { };
        return Directive;
    })();
    return Directive;
});
