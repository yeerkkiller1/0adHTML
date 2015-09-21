import angular = require("angular");
import Directive = require("./Directive");
import $ = require("jquery");
import _ = require("underscore");

import Firebase = require("firebase");

var subscribed = 0;
//Does a shallow sync through the rest API. Which is slower, and requires polling.
//  But if you have a lot of children and just want keys, it is a lot faster.
class FirebaseReadShallow extends Directive {
    public firebaseUrl: string = <any>"=";
    public pollFrequency: number = <any>"=?";

    public output: { [key: string]: any } = <any>"=?";

    public construct(element: angular.IAugmentedJQuery, attrs: angular.IAttributes) {
        var lastUpdateCount = 0;
        var curUpdateCount = 0;

        var update = (count) => {
            var url = this.firebaseUrl;
            if (!url) return;
            if (url.lastIndexOf("/") !== url.length - 1) {
                url = url + "/";
            }
            $.get(url + ".json?shallow=true").then(data => {
                if (count < lastUpdateCount) {
                    return;
                }
                lastUpdateCount = count;
                this.output = data;
                this.safeApply();
            });
        };
        function makeUpdate() {
            return () => {
                update(curUpdateCount++);
            }
        }

        this.pollFrequency = this.pollFrequency || 30000;
        subscribed++;
        console.log("Shallow subscribed to " + this.firebaseUrl + " " + subscribed + " subscriptions");
        var intervalID = setInterval(makeUpdate(), this.pollFrequency);

        this.$watch("pollFrequency", pollFrequency => {
            clearInterval(intervalID);
            intervalID = setInterval(makeUpdate(), this.pollFrequency);
        })

        this.$watch("firebaseUrl", firebaseUrl => {
            console.log("Shallow subscribed updated to " + this.firebaseUrl + " " + subscribed + " subscriptions");
            makeUpdate()();
        });

        this.$on("$destroy", () => {
            clearInterval(intervalID);
            lastUpdateCount = Number.POSITIVE_INFINITY;

            subscribed--;
            console.log("Shallow unsubscribed from " + this.firebaseUrl + " " + subscribed + " subscriptions");
        });
    }
}

var mod = angular.module("FirebaseReadShallow", []);
mod.directive("firebaseReadShallow", function () {
    return <any>(new FirebaseReadShallow().createScope());
});
