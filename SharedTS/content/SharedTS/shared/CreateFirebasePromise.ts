import Firebase = require("firebase");
import QPromise = require("./QPromise");

//Unsubscribes from firebase when all subscriptions on the returned promise are unsubscribed
function CreatePromise<T>(ref: FirebaseQuery, triggerOnNull?: boolean): QPromise<T> {
    var promise = new QPromise<T>();

    var callback = ref.on("value", snapshot => {
        var val = snapshot.val();
        if (!triggerOnNull && val === null) return;
        promise.update(val);
    }, promise.updateError);

    promise.onNoSubscriptions(() => {
        ref.off("value", callback);
    });

    return promise;
}

export = CreatePromise;