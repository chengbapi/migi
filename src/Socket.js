(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        // AMD
        define(["underscore", "./PubSub", './util'], function(underscore, PubSub, util){
            return factory(underscore, PubSub, util);
        });
    } else if(typeof module === "object" && module.exports) {
        // CMD
        module.exports = factory(
            require("underscore"),
            require("./PubSub"),
            require("./util")
        );
    } else {
        // Browser
        root.Socket = factory(root._, root.PubSub, root.util);
    }
}(this, function(_, PubSub, util) {

    function Socket() {
        var c2s = new PubSub();
        var s2c = new PubSub();

        this.client = {
            on: function() {
                return s2c.on.apply(s2c, arguments);
            },
            off: function() {
                return s2c.off.apply(s2c, arguments);
            },
            trigger: function() {
                var args = Array.prototype.slice.call(arguments, 0);
                return c2s.trigger.apply(c2s, util.deepCopy(args));
            },
            emit: function() {
                return c2s.trigger.apply(c2s, arguments);
            }
        };

        this.server = {
            on: function() {
                return c2s.on.apply(c2s, arguments);
            },
            off: function() {
                return c2s.off.apply(c2s, arguments);
            },
            trigger: function() {
                var args = Array.prototype.slice.call(arguments, 0);
                return s2c.trigger.apply(s2c, util.deepCopy(args));
            },
            emit: function() {
                return s2c.trigger.apply(s2c, arguments);
            }
        };
    }

    return Socket;
}));

