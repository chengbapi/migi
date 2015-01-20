(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        // AMD
        define(["underscore", "./Events"], function(underscore, Events){
            return factory(underscore, Events);
        });
    } else if(typeof module === "object" && module.exports) {
        // CMD
        module.exports = factory(
            require("underscore"),
            require("./Events")
        );
    } else {
        // Browser
        root.Socket = factory(root._, root.Events);
    }
}(this, function(_, Events) {
    function PubSub() {}
    _.extend(PubSub.prototype, Events);

    PubSub.prototype.sub = PubSub.prototype.subscribe = PubSub.prototype.on;
    PubSub.prototype.unsub = PubSub.prototype.unsubscribe = PubSub.prototype.off;

    PubSub.prototype.pub = PubSub.prototype.emit = PubSub.prototype.trigger;

    return PubSub;
}));

