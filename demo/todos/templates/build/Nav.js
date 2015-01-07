define(function(require) {
    var React = require('react');
    var Account = React.createClass({displayName: "Account",
        render: function() {
            return (
                React.createElement("div", null, 
                    React.createElement("span", null, this.props.user.name)
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
                    React.createElement("h1", null, "please login")
                );
            }
        }
    });
    return Nav;
})
