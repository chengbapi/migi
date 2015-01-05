define(function(require) {
    var $ = requrie('jquery');
    var api = require('../api');

    return {
        enter: function() {
            api.getList().done(function(data) {
                console.log(data);
            });
        },
        leave: function() {
        }
    };
});
