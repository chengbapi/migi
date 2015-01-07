define(function(require) {
    var $ = require('jquery');
    var React = require('react');
    var UserService = require('../service/user');
    var Nav = require('../templates/build/Nav');
    var Router = require('parasites/Router');

    var SocketClient = UserService.socket;

    function renderNav(user) {
        React.render(React.createElement(Nav, {user: user}), document.getElementById('navigation'));
    }

    return {
        enter: function() {
            SocketClient.on('get:user', function(user) {
                alert('socket');
                renderNav(user);
            });

            window.aaa = SocketClient;
            UserService.getUser().done(function(user) {
                alert('common');
                renderNav(user);
            })
        },
        leave: function() {
            SocketClient.off('get:user', renderNav);
        }
    };
});
