/// <amd-dependency path="angular">
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "angular", "./Directive", "angular"], function (require, exports, angular, Directive) {
    //Copies the new data into the old data, preserving all existing objects where possible.
    //	This prevent angular from regenerating markup, as when markup is regenerate the focused
    //	element is lost.
    function integrateData(newObj, existingObj) {
        if (newObj === existingObj)
            return existingObj;
        if (typeof newObj !== "object" || typeof existingObj !== "object") {
            return newObj;
        }
        if (!newObj || !existingObj)
            return newObj;
        //For arrays preserve the array, use splice to keep it array like
        if ('splice' in newObj && 'length' in existingObj) {
            var oldObjs = existingObj.splice(0, existingObj.length);
            //We can't easily integrate an array, items can be rearranged quite easily and their index
            //	doesn't really have any significance... so for now we will just preserve the array but
            //	replace all the contents.
            newObj.forEach(function (newItem) {
                existingObj.push(newItem);
            });
        }
        else {
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
    exports.integrateData = integrateData;
    //Given an input creates an output that will be the same object
    //  even if the input changes. The value of the object should be the same
    //  ((JSON.stringify(input) === JSON.stringify(output), if stringify has consistent object ordering).
    //  Also nested objects should be the same... although it is done with a best effort approach...
    //  so no guarantees.
    var objIntegrate = (function (_super) {
        __extends(objIntegrate, _super);
        function objIntegrate() {
            _super.apply(this, arguments);
            this.input = "@";
            this.output = "=";
        }
        //This would be used to preserve the object across multiple instances, that way if our directive is recreated
        //  with the same data (in the same path), we still use the same object. But then again... maybe this isn't that
        //  useful...
        //public path: any[] = <any>"=";
        objIntegrate.prototype.construct = function (element) {
            var _this = this;
            var update = function () {
                var input = _this.$parent.$eval(_this.input);
                _this.output = integrateData(input, _this.output);
            };
            this.$watch("input", update);
            var unsub = this.$parent.$watch(this.input, update);
            this.$on("$destroy", function () { return unsub(); });
        };
        return objIntegrate;
    })(Directive);
    var mod = angular.module("objIntegrate", []);
    mod.directive("objIntegrate", function () {
        return (new objIntegrate().createScope());
    });
});
