define(function(require) {
    var $ = require('jquery');
    var pError = require('./Error');

    function Model(obj) {
        return createObject(Model.defaults, obj);
    }

    Model.defaults = {};

    Model.extend = function(defaults) {
        var SuperClass = this;
        var SubClass = function () {
            return createObject(SubClass.defaults, obj);
        };
        SubClass.prototype._superclass_ = SubClass;

        SubClass.defaults = createObject(SuperClass.defaults, defaults);

        SubClass.extend = Model.extend;

        return SubClass;
    };

    function createObject(defaults, obj) {
        return $.extend({}, deepCopy(defaults), deepCopy(obj));
    }

    function deepCopy(object) {
        return $.extend(true, {}, object);
    }


    return Model;

});

