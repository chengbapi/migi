define(function(require) {
    var $ = require('jquery');
    var React = require('react');
    var UserService = require('../service/user');
    var Nav = require('../templates/build/Nav');
    var Main = require('../templates/build/Main');
    var Router = require('migi/router/TreeRouter');

    var SocketClient = UserService.socket;

    return {
        enter: function(params, next) {
            console.log('enter root');
            UserService.getUser().done(function() {
                next();
                Router.navigate('/list');
            }).fail(function() {
                next();
                Router.navigate('/login');
            });
        },
        leave: function(params, next) {
            console.log('leave root');
            next();
        },
        over: function(params, next) {
            console.log('over root');
            React.render(React.createElement(Nav), document.getElementById('navigation'));

            UserService.getUser().always(function() {
                next();
            });
        },
        out: function(params, next) {
            React.unmountComponentAtNode(document.getElementById('navigation'));
            console.log('out root');
            next();
        }
    };
});
