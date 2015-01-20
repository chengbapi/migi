define(function(require) {
    var $ = require('jquery');
    var React = require('react');
    var UserService = require('../service/user');
    var Nav = require('../templates/build/Nav');
    var Router = require('migi/router/TreeRouter');

    return {
        enter: function(params, next) {
            console.log('enter register');
            UserService.getUser().done(function(user) {
                alert('already register!');
                next();
                Router.navigate('/');
            }).fail(function() {
                next();
                $('#content').text('register form');
            });
        },
        leave: function(params, next) {
            console.log('leave register');
            next();
        }
    };
});

