define(["require", "exports", "./QPromise"], function (require, exports, QPromise) {
    //Unsubscribes from firebase when all subscriptions on the returned promise are unsubscribed
    function CreatePromise(ref, triggerOnNull) {
        var promise = new QPromise();
        var callback = ref.on("value", function (snapshot) {
            var val = snapshot.val();
            if (!triggerOnNull && val === null)
                return;
            promise.update(val);
        }, promise.updateError);
        promise.onNoSubscriptions(function () {
            ref.off("value", callback);
        });
        return promise;
    }
    return CreatePromise;
});
