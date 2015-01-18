(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        // AMD
        define(["underscore", "./Events", './util'], function(underscore, Events, util){
            return factory(underscore, Events, util);
        });
    } else if(typeof module === "object" && module.exports) {
        // CMD
        module.exports = factory(
            require("underscore"),
            require("./Events"),
            require("./util")
        );
    } else {
        // Browser
        root.Socket = factory(root._, root.Events, root.util);
    }
}(this, function(_, Events, util) {
    function OneWay() {}
    _.extend(OneWay.prototype, Events);

    OneWay.prototype.emit = OneWay.prototype.trigger;


    function Socket() {
        var c2s = new OneWay();
        var s2c = new OneWay();

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

        this.client.sub = this.client.on;
        this.client.unsub = this.client.off;
        this.client.pub = this.client.emit;

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

        this.server.sub = this.server.on;
        this.server.unsub = this.server.off;
        this.server.pub = this.server.emit;
    }

    return Socket;
}));

