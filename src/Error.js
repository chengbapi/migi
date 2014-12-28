define(function(require) {
    return function(type, wording, obj) {
        type = type.toUpperCase();
        obj && console.dir(obj);
        throw new Error('Error type:' + type + '. ' + wording);
    };
});
