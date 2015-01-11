define(function(require) {
    var React = require('react');
    var LoginForm = require('../templates/build/LoginForm');
    var UserService = require('../service/user');
    var Router = require('parasites/Router');

    return {
        enter: function() {
            console.log('enter login');
            UserService.getUser().done(function() {
                Router.navigate('/list');
            }).fail(function() {
                React.render(React.createElement(LoginForm), document.getElementById('content'));
            });
        },
        leave: function() {
            console.log('leave login');
        }
    };
});
