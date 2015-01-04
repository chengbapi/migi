(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        // AMD
        define(["underscore", "./util"], function(_, util){
            return factory(_, util);
        });
    } else if(typeof module === "object" && module.exports) {
        // CMD
        module.exports = factory(
            require("underscore"),
            require("./util")
        );
    } else {
        // Browser
        root.Model = factory(root._, root.util);
    }
}(this, function(_, util) {
    var deepCopy = util.deepCopy;

    function Model(obj) {
        return createObject(Model.defaults, obj);
    }

    Model.defaults = {};

    Model.extend = function(defaults) {
        var SuperClass = this;
        var SubClass = function (obj) {
            return createObject(SubClass.defaults, obj);
        };
        SubClass.prototype._superclass_ = SuperClass;

        SubClass.defaults = createObject(SuperClass.defaults, defaults);

        SubClass.extend = Model.extend;

        return SubClass;
    };

    function createObject(defaults, obj) {
        return _.extend({}, deepCopy(defaults), deepCopy(obj));
    }

    return Model;
}));

