define(function(require) {
    var React = require('react');
    var LoginForm = require('../templates/build/LoginForm');
    var UserService = require('../service/user');
    var Router = require('migi/router/TreeRouter');

    return {
        enter: function(params, next) {
            console.log('enter login');
            UserService.getUser().done(function() {
                next();
                Router.navigate('/list');
            }).fail(function() {
                next();
                React.render(React.createElement(LoginForm), document.getElementById('content'));
            });
        },
        leave: function(params, next) {
            console.log('leave login');
            next();
        }
    };
});
