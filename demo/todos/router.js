define(function(require) {
    var Router = require('parasites/Router');
    var root = require('./app/root');
    var registry = require('./app/registry');

    Router.on('enter', function(node, params) {
        node.app.enter && node.app.enter(params);
    });
    Router.on('leave', function(node, params) {
        node.app.leave && node.app.leave(params);
    });

    Router.start({
        '/': {
            app: root,
            childNodes: {
                'list': {
                    //app: list
                },
                'detail/:id': {
                    //app: detail
                }
            }
        },
        '/registry': {
            app: registry
        }
    });
});

