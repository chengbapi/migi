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
    function Socket() {}
    _.extend(Socket.prototype, Events);

    Socket.prototype.emit = Socket.trigger;

    var c2s = new Socket();
    var s2c = new Socket();

    return {
        client: {
            on: function() {
                return s2c.on.apply(s2c, arguments);
            },
            off: function() {
                return s2c.off.apply(s2c, arguments);
            },
            emit: function() {
                return c2s.emit.apply(c2s, arguments);
            },
            trigger: function() {
                return c2s.emit.apply(c2s, arguments);
            }
        },
        server: {
            on: function() {
                return c2s.on.apply(c2s, arguments);
            },
            off: function() {
                return c2s.off.apply(c2s, arguments);
            },
            emit: function() {
                return s2c.emit.apply(s2c, arguments);
            },
            trigger: function() {
                return s2c.emit.apply(s2c, arguments);
            }

        }
    };
}));

