var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "angular", "./Directive"], function (require, exports, angular, Directive) {
    var parse;
    var SyncVariable = (function (_super) {
        __extends(SyncVariable, _super);
        function SyncVariable() {
            _super.apply(this, arguments);
            this.value = "=";
            this.variableName = "=";
            this.deepComparison = "=?";
            //This value is not watched properly... so it better be constant
            //This evaluates value as a string in the parent scope, but deep watches it
            this.deepComparisonValue = "=?";
            this.ignoreUndefined = "=?";
        }
        SyncVariable.prototype.construct = function (element, attrs) {
            var _this = this;
            var onChange = function () {
                if (!_this.variableName)
                    return;
                var value = _this.deepComparisonValue ? _this.$parent.$eval(_this.value) : _this.value;
                var getter = parse(_this.variableName);
                var oldValue = getter(_this.$parent);
                if (_this.deepComparison) {
                    if (angular.equals(value, oldValue))
                        return;
                }
                else {
                    if (value === oldValue)
                        return;
                }
                if (_this.ignoreUndefined && value === undefined)
                    return;
                getter.assign(_this.$parent, value);
                _this.$parent["safeApply"]();
            };
            this.$watchGroup(["variableName", "deepComparison"], onChange);
            if (this.deepComparisonValue) {
                this.$parent.$watch(this.value, onChange, true);
            }
            else {
                this.$watch("value", onChange);
            }
        };
        return SyncVariable;
    })(Directive);
    var mod = angular.module("SyncVariable", []);
    mod.directive("syncVariable", function ($parse) {
        parse = $parse;
        return (new SyncVariable().createScope());
    });
});
