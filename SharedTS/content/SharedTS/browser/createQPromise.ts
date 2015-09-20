/// <amd-dependency path="angular">
/// <amd-dependency path="angular-sanitize">

import angular = require("angular");
import Directive = require("./Directive");
import $ = require("jquery");

import QPromise = require("../shared/QPromise");

var parse;

//Synchronizes assuming the function is idempotent, and the output is a QPromise, and then sets the value
//  of the QPromise in the parent as variableName
class createQPromise extends Directive {
    public arguments: any[] = <any>"=";
    public function: Function = <any>"=";
    public variableName: string = <any>"=";

    public construct(element: angular.IAugmentedJQuery) {
        var unsub = () => { };
        this.$watch(() => [this.arguments, this.function, this.variableName], () => {
            if (!this.arguments) return;
            if (!this.function) return;
            if (!this.variableName) return;

            var getter = parse(this.variableName);
            var qPromise: QPromise<any> = this.function.apply(this.$parent, this.arguments);
            unsub();
            unsub = qPromise.subscribe(newValue => {
                getter.assign(this.$parent, newValue);
                this.$parent["safeApply"]();
            });
        }, true);
        this.$on("$destroy", () => {
            unsub();
        });
    }
}

var mod = angular.module("createQPromise", []);
mod.directive("createQPromise", function ($parse) {
    parse = $parse;
    return <any>(new createQPromise().createScope());
});
