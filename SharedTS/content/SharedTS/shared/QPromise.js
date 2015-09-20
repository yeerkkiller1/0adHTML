define(["require", "exports", "underscore"], function (require, exports, _) {
    //Dammit... I need to do this because it needs to work both serverside and clientside.
    //  And on the client it needs to use $q, and... this isn't that hard to do so I am going to just write it.
    var QPromise = (function () {
        function QPromise(value, error, keepAliveOnNoSubs) {
            this.value = value;
            this.error = error;
            this.keepAliveOnNoSubs = keepAliveOnNoSubs;
            this.destroyed = false;
            this.hadSubscriptions = false;
            this.noSubsCallbacks = [];
            this.inCallback = false;
            this.nextID = 1;
            this.callbacks = {};
            this.errorCallbacks = {};
            this.unsubscribe = {};
            for (var key in QPromise.prototype)
                this[key] = this[key].bind(this);
        }
        QPromise.prototype.get = function () {
            return this.value;
        };
        //Just immediately unsubscribes when it has the value
        QPromise.prototype.once = function (callback, errorCallback) {
            this.subscribe(function (value, unsub) {
                unsub();
                callback(value);
            }, errorCallback);
            return this;
        };
        //Returns an unsubscribe function
        QPromise.prototype.subscribe = function (callback, errorCallback, forceInitialTrigger) {
            var _this = this;
            if (this.inCallback)
                throw new Error("This promise does not support recursive subscriptions (as in, you triggered tried to subscribe when value " + this.value + " was being set).");
            if (this.destroyed) {
                //Hmm... not sure if I should just return or not. If this happens in any borderline cases, I should change this to just return.
                throw new Error("Trying to subscribe to a destroyed QPromise");
            }
            this.hadSubscriptions = true;
            var ID = (this.nextID++).toString();
            this.callbacks[ID] = callback;
            if (errorCallback)
                this.errorCallbacks[ID] = errorCallback;
            var unsubscribe = function () {
                delete _this.callbacks[ID];
                if (errorCallback)
                    delete _this.errorCallbacks[ID];
                delete _this.unsubscribe[ID];
                if (_.isEmpty(_this.callbacks) && !_this.keepAliveOnNoSubs) {
                    _this.destroy();
                }
            };
            this.unsubscribe[ID] = unsubscribe;
            if (this.value !== undefined || forceInitialTrigger) {
                callback(this.value, unsubscribe);
            }
            return unsubscribe;
        };
        QPromise.prototype.updateError = function (error) {
            this.update(null, error);
        };
        QPromise.prototype.updateValue = function (value) {
            this.update(value);
        };
        QPromise.prototype.update = function (value, error) {
            if (this.inCallback)
                throw new Error("This promise does not support recursive callbacks (as in, you triggered it with " + value + " as the result of handling callbacks for " + this.value + ").");
            this.inCallback = true;
            try {
                this.value = value;
                this.error = error;
                var callbackList = this.callbacks;
                if (error) {
                    callbackList = this.errorCallbacks;
                    value = error;
                }
                var callbacks = [];
                var unsubs = [];
                for (var ID in callbackList) {
                    callbacks.push(callbackList[ID]);
                    unsubs.push(this.unsubscribe[ID]);
                }
                callbacks.forEach(function (callback, index) { return callback(value, unsubs[index]); });
            }
            finally {
                this.inCallback = false;
            }
        };
        QPromise.prototype.destroy = function () {
            this.destroyed = true;
            //Wipe everything out... hopefully this will cause our memory to be freed?
            this.callbacks = {};
            this.errorCallbacks = {};
            this.unsubscribe = {};
            var noSubsCallbacks = this.noSubsCallbacks.slice(0);
            this.noSubsCallbacks = [];
            noSubsCallbacks.forEach(function (callback) {
                callback();
            });
        };
        //Calls the callback once we have had subscriptions, but they have all unsubscribed
        QPromise.prototype.onNoSubscriptions = function (callback) {
            if (this.destroyed) {
                callback();
            }
            else {
                this.noSubsCallbacks.push(callback);
            }
        };
        return QPromise;
    })();
    return QPromise;
});
