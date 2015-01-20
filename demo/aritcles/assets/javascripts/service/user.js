define(function(require) {
    var $ = require('jquery');
    require('jquery-cookie');
    var User = require('../model/user');

    var Socket = require('migi/Socket');
    var Deferred = require('migi/Deferred');
    var socket = new Socket();
    var SocketServer = socket.server;

    var UserService = {
        socket: socket.client,
        getUser: function() {
            var def = Deferred();
            if (User._init_) {
                // already login
                def.resolve(User);
                SocketServer.emit('user:change', User);
            } else {
                setTimeout(function() {
                    var username = $.cookie('user');
                    if (username) {
                        // auto login with cookie
                        UserService.login({ username: username }).done(function(User) {
                            def.resolve(User);
                        });
                    } else {
                        // not login
                        SocketServer.emit('user:change', null);
                        def.reject(null);
                    }
                }, 2000);
            }
            return def;
        },
        login: function(inputs) {
            var def = Deferred();
            $.ajax({
                url: 'data/user/user.php',
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

                    $.cookie('user', User.name);
                    $.cookie('avatar', User.avatar);

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
            var def = Deferred();
            setTimeout(function() {
                User._init_ = false;
                $.removeCookie('user');
                $.removeCookie('avatar');

                SocketServer.emit('user:change', null);
                def.resolve();
            }, 2000);
            return def;
        }
    };

    return UserService;
});
