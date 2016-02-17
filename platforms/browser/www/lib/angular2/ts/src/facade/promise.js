System.register([], function(exports_1) {
    var PromiseWrapper;
    return {
        setters:[],
        execute: function() {
            exports_1("Promise", Promise);
            PromiseWrapper = (function () {
                function PromiseWrapper() {
                }
                PromiseWrapper.resolve = function (obj) { return Promise.resolve(obj); };
                PromiseWrapper.reject = function (obj, _) { return Promise.reject(obj); };
                // Note: We can't rename this method into `catch`, as this is not a valid
                // method name in Dart.
                PromiseWrapper.catchError = function (promise, onError) {
                    return promise.catch(onError);
                };
                PromiseWrapper.all = function (promises) {
                    if (promises.length == 0)
                        return Promise.resolve([]);
                    return Promise.all(promises);
                };
                PromiseWrapper.then = function (promise, success, rejection) {
                    return promise.then(success, rejection);
                };
                PromiseWrapper.wrap = function (computation) {
                    return new Promise(function (res, rej) {
                        try {
                            res(computation());
                        }
                        catch (e) {
                            rej(e);
                        }
                    });
                };
                PromiseWrapper.scheduleMicrotask = function (computation) {
                    PromiseWrapper.then(PromiseWrapper.resolve(null), computation, function (_) { });
                };
                PromiseWrapper.isPromise = function (obj) { return obj instanceof Promise; };
                PromiseWrapper.completer = function () {
                    var resolve;
                    var reject;
                    var p = new Promise(function (res, rej) {
                        resolve = res;
                        reject = rej;
                    });
                    return { promise: p, resolve: resolve, reject: reject };
                };
                return PromiseWrapper;
            })();
            exports_1("PromiseWrapper", PromiseWrapper);
        }
    }
});
//# sourceMappingURL=promise.js.map