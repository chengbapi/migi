define(function(require) {
    var Router = require('parasites/Router');
    var root = require('./app/root');
    var login = require('./app/login');
    var list = require('./app/list');
    var detail = require('./app/detail');
    var register = require('./app/register');

    Router.on('over', function(node, params, next) {
        node.app.over && node.app.over(params);
        next();
    });
    Router.on('out', function(node, params, next) {
        node.app.out && node.app.out(params);
        next();
    });
    Router.on('enter', function(node, params, next) {
        node.app.enter && node.app.enter(params);
        next();
    });
    Router.on('leave', function(node, params, next) {
        node.app.leave && node.app.leave(params);
        next();
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

