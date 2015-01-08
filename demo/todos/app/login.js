define(function(require) {
    var React = require('react');
    var LoginForm = require('../templates/build/LoginForm');

    return {
        enter: function() {
            console.log('enter login');
            React.render(React.createElement(LoginForm), document.getElementById('content'));
        },
        leave: function() {
            console.log('leave login');
        }
    };
});
