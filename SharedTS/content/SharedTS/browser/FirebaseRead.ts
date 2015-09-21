import angular = require("angular");
import Directive = require("./Directive");
import $ = require("jquery");
import _ = require("underscore");

import Firebase = require("firebase");

function refPath(ref: Firebase) {
    if (!ref.parent()) return "";
    return refPath(ref.parent()) + "/" + ref.key();
}

//Allows you do to firebase queries directly in your markup. This is really handy, as it means the queries
//  only occur when the data is rendered, and you can subscribe and unsubscribe automatically.
var subscriptions = 0;
class FirebaseRead extends Directive {
    public refBase: Firebase = <any>"=";
    public refPath: string = <any>"=";
    public value = <any>"=";

    public limitToLast: number = <any>"=?";
    public isArray: boolean = <any>"=?";
    public reverse: boolean = <any>"=?";

    public orderByChild: string = <any>"=?";
    public startAt: string = <any>"=?";
    public endAt: string = <any>"=?";

    public orderByKey: boolean = <any>"=?";

    public throttle: number = <any>"=?";

    public transform: (x) => any = <any>"=?";
    public flattenTransform: boolean = <any>"=?";

    public construct(element: angular.IAugmentedJQuery, attrs: angular.IAttributes) {
        var previousUnsub = () => { };
        this.$watchGroup(["refBase", "refPath", "limitToLast", "orderByChild", "startAt", "endAt", "reverse"], () => {
            previousUnsub();
            if (!this.refPath || !this.refBase) return;
            var refPathSafe = this.refPath;
            var fireURL = "firebaseio.com";
            if (refPathSafe.indexOf(fireURL) >= 0) {
                refPathSafe = refPathSafe.slice(refPathSafe.indexOf(fireURL) + fireURL.length);
            }
            var ref: FirebaseQuery = this.refBase.child(refPathSafe);
            if (this.limitToLast) {
                ref = ref.limitToLast(this.limitToLast);
            }
            if (this.orderByKey) {
                ref = ref.orderByKey();
            }
            if (this.orderByChild) {
                ref = ref.orderByChild(this.orderByChild);
            }
            if (this.startAt) {
                ref = ref.startAt(this.startAt);
            }
            if (this.endAt) {
                ref = ref.endAt(this.endAt);
            }
            var sync = (snapshot: FirebaseDataSnapshot) => {
                if (this.isArray) {
                    var arr = this.value = [];
                    snapshot.forEach(val => {
                        var value = val.val();
                        if (this.transform) {
                            value = this.transform(value);
                        }
                        if (this.flattenTransform) {
                            value.forEach(val => {
                                arr.push(val);
                            });
                        } else {
                            value["$key"] = val.key();
                            arr.push(value);
                        }
                    });
                    if (this.reverse) {
                        arr = arr.reverse();
                    }
                    this.value = arr;
                } else {
                    this.value = snapshot.val();
                    if (this.transform) {
                        this.value = this.transform(this.value);
                    }
                }
                
                //console.log("Got value for " + refPath(ref) + " " + this.value);
                this.safeApply();
            };

            if (this.throttle) {
                sync = _.throttle(sync, this.throttle);
            }

            subscriptions++;
            console.log("Subscribed (" + subscriptions + ") to " + refPath(ref.ref()));
            ref.on("value", sync);
            var didUnsub = false;
            var unsub = () => {
                if (didUnsub) return;
                didUnsub = true;
                subscriptions--;
                console.log("Unsubscribed (" + subscriptions + ") from " + refPath(ref.ref()));
                ref.off("value", sync);
            };
            previousUnsub = unsub;
            this.$on("$destroy", unsub);
        });
    }
}

var mod = angular.module("FirebaseRead", []);
mod.directive("firebaseRead", function () {
    return <any>(new FirebaseRead().createScope());
});
