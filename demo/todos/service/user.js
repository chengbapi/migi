define(function(require) {
    var $ = require('jquery');
    var User = require('../model/user');
    var SocketServer = require('parasites/Socket').server;

    SocketServer.on('get:user', function() {
        if (User._init_) {
            SocketServer.emit('get:user', User);
        } else {
            $.getJSON('data/login-status.json').done(function(data) {
                if (data.status) {
                    User.name = data.name;
                    User._init_ = true;
                    SocketServer.emit('get:user', User);
                } else {
                    SocketServer.emit('get:user', null);
                }
            });
        }
    });
});
