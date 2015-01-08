define(function(require) {
    var $ = require('jquery');

    return {
        enter: function() {
            $('#content').html('a list');
            console.log('enter list');
        },
        leave: function() {
            console.log('leave list');
        }
    };
});
