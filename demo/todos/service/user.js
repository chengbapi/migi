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
            def.reject(null);
        }
        return def;
    }

    SocketServer.on('get:user', function() {
        _getUser().done(function(User) {
            SocketServer.emit('user:change', User);
        }).fail(function() {
            SocketServer.emit('user:change', null);
        });
    });

    return {
        socket: socket.client,
        getUser: function() {
            return _getUser();
        },
        login: function(inputs) {
            var def = $.Deferred();
            $.ajax({
                url: 'data/user.php',
                type: 'GET',
                dataType: 'json',
                data: {
                    username: inputs.username
                }
            }).done(function(data) {
                if (data.status) {
                    User.name = data.user.name;
                    User.avatar = data.user.avatar;
                    User._init_ = true;
                    SocketServer.emit('user:change', User);
                    def.resolve(User);
                } else {
                    User._init_ = false;
                    SocketServer.emit('user:change', null);
                    def.reject(data.error);
                }
            });
            return def;
        },
        logout: function() {
            var def = $.Deferred();
            setTimeout(function() {
                User._init_ = false;
                def.resolve();
                SocketServer.emit('user:change', null);
            }, 2000);
            return def;
        }
    };
});
