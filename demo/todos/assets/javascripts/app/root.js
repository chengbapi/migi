define(function(require) {
    var $ = require('jquery');
    var React = require('react');
    var UserService = require('../service/user');
    var Nav = require('../templates/build/Nav');
    var Main = require('../templates/build/Main');
    var Router = require('parasites/Router');

    var SocketClient = UserService.socket;

    return {
        enter: function() {
            UserService.getUser().done(function() {
                Router.navigate('/list');
            }).fail(function() {
                Router.navigate('/login');
            });
            console.log('enter root');
        },
        leave: function() {
            console.log('leave root');

        },
        over: function() {
            console.log('over root');
            React.render(React.createElement(Nav), document.getElementById('navigation'));

            UserService.getUser();
        },
        out: function() {
            React.unmountComponentAtNode(document.getElementById('navigation'));
            console.log('out root');
        }
    };
});
