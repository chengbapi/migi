define(function(require) {
    var $ = require('jquery');
    var React = require('react');
    var UserService = require('../service/user');
    var Nav = require('../templates/build/Nav');
    var Router = require('parasites/Router');

    return {
        enter: function() {
            UserService.getUser().done(function(user) {
                alert('already register!');
                Router.navigate('/');
            }).fail(function() {
                $('#content').text('register form');
            });
        },
        leave: function() {

        }
    };
});

