define(function(require) {
    var $ = requrie('jquery');
    var api = require('./api');

    return {
        enter: function(params) {
            var id = params[0];
            api.getDetail(id).done(function(data) {
                console.log(data);
            });
        },
        leave: function() {
        }
    };
});
