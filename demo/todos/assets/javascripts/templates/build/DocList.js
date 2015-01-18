define(function(require) {
    var React = require('react');
    var UserService = require('../../service/user');

    var Main = React.createClass({displayName: "Main",
        render: function() {
            if (this.props.user) {
                return (
                    React.createElement("h2", null, " Welcome! ",  this.props.user.name, " ")
                );
            } else {
                return (
                    React.createElement("div", null, 
                        React.createElement("p", null, "Login Box"), 
                        "Do not have an account ?", React.createElement("a", {href: "#/registry"}, "registry")
                    )
                );
            }
        }
    });
    return Main;
})
