/// <amd-dependency path="angular">

import angular = require("angular");
import Directive = require("./Directive");
import $ = require("jquery");

import urlHelper = require("./urlHelper");

var parse;
class syncUrl extends Directive {
    //These should all be constant
    public varName = "=";
    public urlName = "=";
    public kind = "=?"; //"number"

    public construct(element: angular.IAugmentedJQuery) {
        var unsub;
        switch (this.kind) {
            default:
                urlHelper.bindObjToUrl(this.$parent, this.varName, this.urlName, JSON.parse, JSON.stringify, parse);
                break;
            case "number":
                urlHelper.bindNumberToUrl(this.$parent, this.varName, this.urlName, parse);
                break;
        }

        this.$on("$destroy", () => {
            unsub();
        });
    }
}

var mod = angular.module("syncUrl", []);
mod.directive("syncUrl", function ($parse) {
    parse = $parse;
    return <any>(new syncUrl().createScope());
});