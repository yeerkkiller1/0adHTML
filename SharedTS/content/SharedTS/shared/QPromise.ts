import _ = require("underscore");

//Dammit... I need to do this because it needs to work both serverside and clientside.
//  And on the client it needs to use $q, and... this isn't that hard to do so I am going to just write it.
class QPromise<T> {
    private destroyed = false;

    constructor(private value?: T, private error?, private keepAliveOnNoSubs?: boolean) {
        for (var key in QPromise.prototype) this[key] = this[key].bind(this);
    }

    public get(): T {
        return this.value;
    }

    //Just immediately unsubscribes when it has the value
    public once(callback: (value: T) => void, errorCallback?: (err) => void) {
        this.subscribe((value, unsub) => {
            unsub();
            callback(value);
        }, errorCallback);
        return this;
    }

    //Returns an unsubscribe function
    public subscribe(callback: (value: T, unsub: () => void) => void, errorCallback?: (err, unsub: () => void) => void, forceInitialTrigger?: boolean): () => void {
        if (this.inCallback) throw new Error("This promise does not support recursive subscriptions (as in, you triggered tried to subscribe when value " + this.value + " was being set).");
        if (this.destroyed) {
            //Hmm... not sure if I should just return or not. If this happens in any borderline cases, I should change this to just return.
            throw new Error("Trying to subscribe to a destroyed QPromise");
        }

        this.hadSubscriptions = true;

        var ID = (this.nextID++).toString();
        this.callbacks[ID] = callback;
        if (errorCallback) this.errorCallbacks[ID] = errorCallback;

        var unsubscribe = () => {
            delete this.callbacks[ID];
            if (errorCallback) delete this.errorCallbacks[ID];
            delete this.unsubscribe[ID];

            if (_.isEmpty(this.callbacks) && !this.keepAliveOnNoSubs) {
                this.destroy();
            }
        };
        this.unsubscribe[ID] = unsubscribe;

        if (this.value !== undefined || forceInitialTrigger) {
            callback(this.value, unsubscribe);
        }

        return unsubscribe;
    }
    public updateError(error): void {
        this.update(null, error);
    }
    public updateValue(value: T) {
        this.update(value);
    }
    public update(value: T, error?): void {
        if (this.inCallback) throw new Error("This promise does not support recursive callbacks (as in, you triggered it with " + value + " as the result of handling callbacks for " + this.value + ").");

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
            callbacks.forEach((callback, index) => callback(value, unsubs[index]));
        } finally {
            this.inCallback = false;
        }
    }

    public destroy() {
        this.destroyed = true;
        //Wipe everything out... hopefully this will cause our memory to be freed?
        this.callbacks = {};
        this.errorCallbacks = {};
        this.unsubscribe = {};
        var noSubsCallbacks = this.noSubsCallbacks.slice(0);
        this.noSubsCallbacks = [];
        noSubsCallbacks.forEach(callback => {
            callback();
        });
    }

    private hadSubscriptions = false;
    private noSubsCallbacks: (() => void)[] = [];
    //Calls the callback once we have had subscriptions, but they have all unsubscribed
    public onNoSubscriptions(callback: () => void) {
        if (this.destroyed) {
            callback();
        } else {
            this.noSubsCallbacks.push(callback);
        }
    }

    private inCallback = false;

    private nextID: number = 1;
    private callbacks: { [id: string]: (value: T, unsub: () => void) => void } = {};
    private errorCallbacks: { [id: string]: (err, unsub: () => void) => void } = {};

    private unsubscribe: { [id: string]: () => void } = {};
}

export = QPromise