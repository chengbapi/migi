define(function(require) {
    var $ = require('jquery');
    var React = require('react');
    var userAPI = require('../api/user');
    var Nav = require('../templates/build/Nav');
    var Router = require('parasites/Router');
    var SocketClient = require('parasites/Socket').client;

    return {
        enter: function() {
            userAPI.getLoginStatus().done(function(data) {
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

