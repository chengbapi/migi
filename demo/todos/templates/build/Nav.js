define(function(require) {
    var React = require('react');
    var UserService = require('../../service/user');

    var Account = React.createClass({displayName: "Account",
        logout: function() {
            UserService.logout();
        },
        render: function() {
            return (
                React.createElement("div", null, 
                    React.createElement("img", {src: this.props.user.avatar}), 
                    React.createElement("span", null, this.props.user.name), 
                    React.createElement("button", {className: "logout", onClick: this.logout})
                )
            );
        }
    });
    var Nav = React.createClass({displayName: "Nav",
        render: function() {
            if (this.props.user) {
                return (
                    React.createElement("div", {id: "navigation"}, 
                        React.createElement(Account, {user: this.props.user})
                    )
                );
            } else {
                return (
                    React.createElement("h2", null, "please login")
                );
            }
        }
    });
    return Nav;
})
