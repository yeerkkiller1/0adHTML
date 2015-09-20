/// <amd-dependency path="angular">
/// <amd-dependency path="angular-sanitize">
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "angular", "./Directive", "angular", "angular-sanitize"], function (require, exports, angular, Directive) {
    var parse;
    //Synchronizes assuming the function is idempotent, and the output is a QPromise, and then sets the value
    //  of the QPromise in the parent as variableName
    var createQPromise = (function (_super) {
        __extends(createQPromise, _super);
        function createQPromise() {
            _super.apply(this, arguments);
            this.arguments = "=";
            this.function = "=";
            this.variableName = "=";
        }
        createQPromise.prototype.construct = function (element) {
            var _this = this;
            var unsub = function () { };
            this.$watch(function () { return [_this.arguments, _this.function, _this.variableName]; }, function () {
                if (!_this.arguments)
                    return;
                if (!_this.function)
                    return;
                if (!_this.variableName)
                    return;
                var getter = parse(_this.variableName);
                var qPromise = _this.function.apply(_this.$parent, _this.arguments);
                unsub();
                unsub = qPromise.subscribe(function (newValue) {
                    getter.assign(_this.$parent, newValue);
                    _this.$parent["safeApply"]();
                });
            }, true);
            this.$on("$destroy", function () {
                unsub();
            });
        };
        return createQPromise;
    })(Directive);
    var mod = angular.module("createQPromise", []);
    mod.directive("createQPromise", function ($parse) {
        parse = $parse;
        return (new createQPromise().createScope());
    });
});
