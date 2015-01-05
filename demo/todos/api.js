define(function(require) {
    var $ = require('jquery');
    return {
        getLoginStatus: function() {
            return $.getJSON('/data/login-status.json');
        }
    };
});
