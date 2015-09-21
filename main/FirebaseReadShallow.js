var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "angular", "SharedTS/content/SharedTS/browser/Directive", "jquery"], function (require, exports, angular, Directive, $) {
    //Does a shallow sync through the rest API. Which is slower, and requires polling.
    //  But if you have a lot of children and just want keys, it is a lot faster.
    var FirebaseReadShallow = (function (_super) {
        __extends(FirebaseReadShallow, _super);
        function FirebaseReadShallow() {
            _super.apply(this, arguments);
            this.firebaseUrl = "=";
            this.pollFrequency = "=?";
            this.output = "=?";
        }
        FirebaseReadShallow.prototype.construct = function (element, attrs) {
            var _this = this;
            var lastUpdateCount = 0;
            var curUpdateCount = 0;
            var update = function (count) {
                var url = _this.firebaseUrl;
                if (!url)
                    return;
                if (url.lastIndexOf("/") !== url.length - 1) {
                    url = url + "/";
                }
                $.get(url + ".json?shallow=true").then(function (data) {
                    if (count < lastUpdateCount) {
                        return;
                    }
                    lastUpdateCount = count;
                    _this.output = data;
                    _this.safeApply();
                });
            };
            function makeUpdate() {
                return function () {
                    update(curUpdateCount++);
                };
            }
            this.pollFrequency = this.pollFrequency || 1000;
            var intervalID = setInterval(makeUpdate(), this.pollFrequency);
            this.$watch("pollFrequency", function (pollFrequency) {
                clearInterval(intervalID);
                intervalID = setInterval(makeUpdate(), _this.pollFrequency);
            });
            this.$watch("firebaseUrl", function (firebaseUrl) {
                makeUpdate()();
            });
            this.$on("$destroy", function () {
                clearInterval(intervalID);
                lastUpdateCount = Number.POSITIVE_INFINITY;
            });
        };
        return FirebaseReadShallow;
    })(Directive);
    var mod = angular.module("FirebaseReadShallow", []);
    mod.directive("firebaseReadShallow", function () {
        return (new FirebaseReadShallow().createScope());
    });
});
