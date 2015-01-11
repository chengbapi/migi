(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        // AMD
        define(["underscore"], function(_){
            return factory(_);
        });
    } else if(typeof module === "object" && module.exports) {
        // CMD
        module.exports = factory(
            require("underscore")
        );
    } else {
        // Browser
        root.util = factory(root._);
    }
}(this, function(_) {
    var util = {
        // reference by jQuery.extend
        extend: function() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if ( typeof target === "boolean" ) {
                deep = target;

                // Skip the boolean and the target
                target = arguments[ i ] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if ( typeof target !== "object" && !_.isFunction(target) ) {
                target = {};
            }

            // Extend jQuery itself if only one argument is passed
            if ( i === length ) {
                target = this;
                i--;
            }

            for ( ; i < length; i++ ) {
                // Only deal with non-null/undefined values
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( name in options ) {
                        src = target[ name ];
                        copy = options[ name ];

                        // Prevent never-ending loop
                        if ( target === copy ) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if ( deep && copy && ( (copyIsArray = _.isArray(copy)) || _.isObject(copy) ) ) {
                            if ( copyIsArray ) {
                                copyIsArray = false;
                                clone = src && _.isArray(src) ? src : [];

                            } else {
                                clone = src && _.isObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[ name ] = util.extend( deep, clone, copy );

                        // Don't bring in undefined values
                        } else if ( copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        },
        deepCopy: function(obj) {
            if (obj === null || obj === undefined) {
                return obj;
            } else if (_.isFunction(obj)) {
                return null;
            } else if (_.isArray(obj)) {
                return util.extend(true, [], obj);
            } else if (_.isObject(obj)) {
                return util.extend(true, {}, obj);
            }
        }
    };

    return util;
}));


