define(function(require) {
    var $ = require('jquery');
    var userAPI = require('./api/user');
    var router = require('./router');

    return {
        enter: function() {
            userAPI.getLoginStatus().done(function(data) {
                if (data.status) {

                } else {
                    router.navigate('/login');
                }
            });
        },
        leave: function() {

        }
    };
});
