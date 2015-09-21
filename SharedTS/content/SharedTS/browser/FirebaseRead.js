var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "angular", "./Directive", "underscore"], function (require, exports, angular, Directive, _) {
    function refPath(ref) {
        if (!ref.parent())
            return "";
        return refPath(ref.parent()) + "/" + ref.key();
    }
    //Allows you do to firebase queries directly in your markup. This is really handy, as it means the queries
    //  only occur when the data is rendered, and you can subscribe and unsubscribe automatically.
    var subscriptions = 0;
    var FirebaseRead = (function (_super) {
        __extends(FirebaseRead, _super);
        function FirebaseRead() {
            _super.apply(this, arguments);
            this.refBase = "=";
            this.refPath = "=";
            this.value = "=";
            this.limitToLast = "=?";
            this.isArray = "=?";
            this.reverse = "=?";
            this.orderByChild = "=?";
            this.startAt = "=?";
            this.endAt = "=?";
            this.orderByKey = "=?";
            this.throttle = "=?";
            this.transform = "=?";
            this.flattenTransform = "=?";
        }
        FirebaseRead.prototype.construct = function (element, attrs) {
            var _this = this;
            var previousUnsub = function () { };
            this.$watchGroup(["refBase", "refPath", "limitToLast", "orderByChild", "startAt", "endAt", "reverse"], function () {
                previousUnsub();
                if (!_this.refPath || !_this.refBase)
                    return;
                var refPathSafe = _this.refPath;
                var fireURL = "firebaseio.com";
                if (refPathSafe.indexOf(fireURL) >= 0) {
                    refPathSafe = refPathSafe.slice(refPathSafe.indexOf(fireURL) + fireURL.length);
                }
                var ref = _this.refBase.child(refPathSafe);
                if (_this.limitToLast) {
                    ref = ref.limitToLast(_this.limitToLast);
                }
                if (_this.orderByKey) {
                    ref = ref.orderByKey();
                }
                if (_this.orderByChild) {
                    ref = ref.orderByChild(_this.orderByChild);
                }
                if (_this.startAt) {
                    ref = ref.startAt(_this.startAt);
                }
                if (_this.endAt) {
                    ref = ref.endAt(_this.endAt);
                }
                var sync = function (snapshot) {
                    if (_this.isArray) {
                        var arr = _this.value = [];
                        snapshot.forEach(function (val) {
                            var value = val.val();
                            if (_this.transform) {
                                value = _this.transform(value);
                            }
                            if (_this.flattenTransform) {
                                value.forEach(function (val) {
                                    arr.push(val);
                                });
                            }
                            else {
                                value["$key"] = val.key();
                                arr.push(value);
                            }
                        });
                        if (_this.reverse) {
                            arr = arr.reverse();
                        }
                        _this.value = arr;
                    }
                    else {
                        _this.value = snapshot.val();
                        if (_this.transform) {
                            _this.value = _this.transform(_this.value);
                        }
                    }
                    //console.log("Got value for " + refPath(ref) + " " + this.value);
                    _this.safeApply();
                };
                if (_this.throttle) {
                    sync = _.throttle(sync, _this.throttle);
                }
                subscriptions++;
                console.log("Subscribed (" + subscriptions + ") to " + refPath(ref.ref()));
                ref.on("value", sync);
                var didUnsub = false;
                var unsub = function () {
                    if (didUnsub)
                        return;
                    didUnsub = true;
                    subscriptions--;
                    console.log("Unsubscribed (" + subscriptions + ") from " + refPath(ref.ref()));
                    ref.off("value", sync);
                };
                previousUnsub = unsub;
                _this.$on("$destroy", unsub);
            });
        };
        return FirebaseRead;
    })(Directive);
    var mod = angular.module("FirebaseRead", []);
    mod.directive("firebaseRead", function () {
        return (new FirebaseRead().createScope());
    });
});
