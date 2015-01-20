define(function(require) {
    var Router = require('migi/router/TreeRouter');
    var root = require('./app/root');
    var login = require('./app/login');
    var list = require('./app/list');
    var detail = require('./app/detail');
    var register = require('./app/register');

    Router.on('over', function(node, params, next) {
        if (node.app.over) {
            node.app.over(params, next);
        } else {
            next();
        }
    });
    Router.on('out', function(node, params, next) {
        if (node.app.out) {
            node.app.out(params, next);
        } else {
            next();
        }
    });
    Router.on('enter', function(node, params, next) {
        if (node.app.enter) {
            node.app.enter(params, next);
        } else {
            next();
        }
    });
    Router.on('leave', function(node, params, next) {
        if (node.app.leave) {
            node.app.leave(params, next);
        } else {
            next();
        }
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

