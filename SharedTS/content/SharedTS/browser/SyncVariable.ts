import angular = require("angular");
import Directive = require("./Directive");
import $ = require("jquery");
import _ = require("underscore");

import Firebase = require("firebase");

var parse;
class SyncVariable extends Directive {
    public value = "=";
    public variableName = "=";
    public deepComparison = "=?";
    //This value is not watched properly... so it better be constant
    //This evaluates value as a string in the parent scope, but deep watches it
    public deepComparisonValue = "=?";
    public ignoreUndefined = "=?";
    public construct(element: angular.IAugmentedJQuery, attrs: angular.IAttributes) {
        var onChange = () => {
            if (!this.variableName) return;
            var value = this.deepComparisonValue ? this.$parent.$eval(this.value) : this.value;
            var getter = parse(this.variableName);

            var oldValue = getter(this.$parent);
            if (this.deepComparison) {
                if (angular.equals(value, oldValue)) return;
            } else {
                if (value === oldValue) return;
            }
            if (this.ignoreUndefined && value === undefined) return;

            getter.assign(this.$parent, value);
            this.$parent["safeApply"]();
        };
        this.$watchGroup(["variableName", "deepComparison"], onChange);
        if (this.deepComparisonValue) {
            this.$parent.$watch(this.value, onChange, true);
        } else {
            this.$watch("value", onChange);
        }
    }
}

var mod = angular.module("SyncVariable", []);
mod.directive("syncVariable", function ($parse) {
    parse = $parse;
    return <any>(new SyncVariable().createScope());
});