define(function(require) {
    var $ = requrie('jquery');

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
