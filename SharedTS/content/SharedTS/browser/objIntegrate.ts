/// <amd-dependency path="angular">

import angular = require("angular");
import Directive = require("./Directive");
import $ = require("jquery");

//Copies the new data into the old data, preserving all existing objects where possible.
//	This prevent angular from regenerating markup, as when markup is regenerate the focused
//	element is lost.
export function integrateData(newObj, existingObj) {
    if (newObj === existingObj) return existingObj;
    if (typeof newObj !== "object" || typeof existingObj !== "object") {
        return newObj;
    }
    if (!newObj || !existingObj) return newObj;

    //For arrays preserve the array, use splice to keep it array like
    if ('splice' in newObj && 'length' in existingObj) {
        var oldObjs = existingObj.splice(0, existingObj.length);
        //We can't easily integrate an array, items can be rearranged quite easily and their index
        //	doesn't really have any significance... so for now we will just preserve the array but
        //	replace all the contents.
        newObj.forEach(function (newItem) {
            existingObj.push(newItem);
        });
    } else {
        var removedKeys = {};
        for (var key in existingObj) {
            removedKeys[key] = true;
        }

        for (var key in newObj) {
            if (!(key in existingObj)) {
                existingObj[key] = newObj[key];
                continue;
            }

            existingObj[key] = integrateData(newObj[key], existingObj[key]);
            delete removedKeys[key];
        }

        for (var removedKey in removedKeys) {
            delete existingObj[removedKey];
        }
    }

    return existingObj;
}


//Given an input creates an output that will be the same object
//  even if the input changes. The value of the object should be the same
//  ((JSON.stringify(input) === JSON.stringify(output), if stringify has consistent object ordering).
//  Also nested objects should be the same... although it is done with a best effort approach...
//  so no guarantees.
class objIntegrate extends Directive {
    public input: any = <any>"@";
    public output: any = <any>"=";

    //This would be used to preserve the object across multiple instances, that way if our directive is recreated
    //  with the same data (in the same path), we still use the same object. But then again... maybe this isn't that
    //  useful...
    //public path: any[] = <any>"=";

    public construct(element: angular.IAugmentedJQuery) {
        var update = () => {
            var input = this.$parent.$eval(this.input);
            this.output = integrateData(input, this.output);
        };
        this.$watch("input", update);
        var unsub = this.$parent.$watch(this.input, update);
        this.$on("$destroy", () => unsub());
    }
}

var mod = angular.module("objIntegrate", []);
mod.directive("objIntegrate", function () {
    return <any>(new objIntegrate().createScope());
});