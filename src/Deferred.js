(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        // AMD
        define(['jquery', './util'], function(jquery, util){
            return factory(jquery, util);
        });
    } else if(typeof module === "object" && module.exports) {
        // CMD
        module.exports = factory(
            require('jquery'),
            require('./util')
        );
    } else {
        // Browser
        root.Deferred = factory(root.jQuery, root.util);
    }
}(this, function($, util) {

    function Deferred() {
        var def = $.Deferred();

        def._resolve = def.resolve;
        def._reject = def.reject;
        def.resolve = function() {
            var args = Array.prototype.slice.call(arguments, 0);
            def._resolve.apply(this, util.deepCopy(args));
        };
        def.reject = function() {
            var args = Array.prototype.slice.call(arguments, 0);
            def._reject.apply(this, util.deepCopy(args));
        };

        return def;
    }

    return Deferred;
}));
