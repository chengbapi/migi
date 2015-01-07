define(function(require) {
    var $ = require('jquery');
    var User = require('../model/user');

    var Socket = require('parasites/Socket');
    var socket = new Socket();
    var SocketServer = socket.server;

    function _getUser() {
        var def = $.Deferred();

        if (User._init_) {
            def.resolve(User);
        } else {
            $.getJSON('data/login-status.json').done(function(data) {
                if (data.status) {
                    User.name = data.name;
                    User._init_ = true;
                    def.resolve(User);
                } else {
                    def.reject();
                }
            });
        }

        return def;
    }

    SocketServer.on('get:user', function() {
        _getUser().done(function(User) {
            SocketServer.emit('get:user', User);
        }).fail(function() {
            SocketServer.emit('get:user', null);
        });
    });

    return {
        socket: socket.client,
        getUser: function() {
            return _getUser();
        }
    };
});
