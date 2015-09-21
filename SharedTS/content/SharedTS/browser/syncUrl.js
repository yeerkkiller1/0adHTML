/// <amd-dependency path="angular">
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "angular", "./Directive", "./urlHelper", "angular"], function (require, exports, angular, Directive, urlHelper) {
    var parse;
    var syncUrl = (function (_super) {
        __extends(syncUrl, _super);
        function syncUrl() {
            _super.apply(this, arguments);
            //These should all be constant
            this.varName = "=";
            this.urlName = "=";
            this.kind = "=?"; //"number"
        }
        syncUrl.prototype.construct = function (element) {
            var unsub;
            switch (this.kind) {
                default:
                    urlHelper.bindObjToUrl(this.$parent, this.varName, this.urlName, JSON.parse, JSON.stringify, parse);
                    break;
                case "number":
                    urlHelper.bindNumberToUrl(this.$parent, this.varName, this.urlName, parse);
                    break;
            }
            this.$on("$destroy", function () {
                unsub();
            });
        };
        return syncUrl;
    })(Directive);
    var mod = angular.module("syncUrl", []);
    mod.directive("syncUrl", function ($parse) {
        parse = $parse;
        return (new syncUrl().createScope());
    });
});
