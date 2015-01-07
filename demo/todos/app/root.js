define(function(require) {
    var $ = require('jquery');
    var React = require('react');
    var UserService = require('../service/user');
    var Nav = require('../templates/build/Nav');
    var Router = require('parasites/Router');
    var SocketClient = require('parasites/Socket').client;

    function renderNav(user) {
        React.render(React.createElement(Nav, {user: user}), document.getElementById('navigation'));
    }

    return {
        enter: function() {
            SocketClient.on('user:update', renderNav);

            userAPI
            SocketClient.emit('get:user');
        },
        leave: function() {
            SocketClient.off('get:user', renderNav);
        }
    };
});
