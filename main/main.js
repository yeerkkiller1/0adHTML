/// <amd-dependency path="SharedTS/content/SharedTS/browser/FirebaseRead.js">
/// <amd-dependency path="SharedTS/content/SharedTS/browser/syncUrl.js">
/// <amd-dependency path="SharedTS/content/SharedTS/browser/SyncVariable.js">
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "SharedTS/content/SharedTS/browser/Directive", "underscore", "angular", "firebase", "SharedTS/content/SharedTS/browser/FirebaseRead.js", "SharedTS/content/SharedTS/browser/syncUrl.js", "SharedTS/content/SharedTS/browser/SyncVariable.js", "SharedTS/content/SharedTS/browser/objIntegrate.js"], function (require, exports, Directive, _, angular, Firebase) {
    var Base = (function (_super) {
        __extends(Base, _super);
        function Base() {
            _super.apply(this, arguments);
            this.templateUrl = "main/main.html";
            this.cssUrl = "main/main.css";
        }
        Base.prototype.construct = function () {
            this.ref = new Firebase("https://0ad.firebaseio.com/");
        };
        Base.prototype.countKeys = function (obj) {
            var count = 0;
            for (var key in obj)
                count++;
            return count;
        };
        Base.prototype.max = function (obj, key) {
            var fnc = key && (function (k) { return k[key]; });
            return _.max(obj, fnc);
        };
        Base.prototype.min = function (obj, key) {
            var fnc = key && (function (k) { return k[key]; });
            return _.min(obj, fnc);
        };
        Base.prototype.flatten = function (obj) {
            var arr = [];
            _.forEach(obj, function (x) { return _.forEach(x, function (k) { return arr.push(k); }); });
            return arr;
        };
        Base.prototype.select = function (obj, key) {
            return _.map(obj, function (x) { return x[key]; });
        };
        return Base;
    })(Directive);
    var mod = angular.module("Base", ["FirebaseRead", "syncUrl", "SyncVariable", "objIntegrate"]);
    mod.directive("base", function () {
        return (new Base().createScope());
    });
});
