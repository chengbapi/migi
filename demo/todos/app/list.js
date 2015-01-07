define(function(require) {
    var $ = requrie('jquery');

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
