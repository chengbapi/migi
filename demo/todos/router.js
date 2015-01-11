define(function(require) {
    var Router = require('parasites/Router');
    var root = require('./app/root');
    var login = require('./app/login');
    var list = require('./app/list');
    var detail = require('./app/detail');
    var register = require('./app/register');

    Router.on('enter', function(node, params) {
        node.app.enter && node.app.enter(params);
    });
    Router.on('leave', function(node, params) {
        node.app.leave && node.app.leave(params);
    });
    Router.on('at', function(node, params) {
        node.app.at && node.app.at(params);
    });

    Router.start({
        '/': {
            app: root,
            childNodes: {
                'login': {
                    app: login
                },
                'list': {
                    app: list
                },
                'detail/:id': {
                    app: detail
                }
            }
        },
        '/register': {
            app: register
        }
    });
});

