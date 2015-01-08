define(function(require) {
    var $ = require('jquery');
    var bootstrap = require('bootstrap');
    var React = require('react');
    var UserService = require('../../service/user');
    var SocketClient = UserService.socket;
    var Router = require('parasites/Router');

    var Account = React.createClass({displayName: "Account",
        getInitialState: function() {
            return {
                user: null,
                loading: false
            };
        },
        logout: function() {
            this.setState({
                loading: true
            });
            UserService.logout().done(function() {
                Router.navigate('#/login');
            });
        },
        userChange: function(user) {
            this.setState({
                user: user,
                loading: false
            });
        },
        componentDidMount: function() {
            SocketClient.on('user:change', this.userChange);
            var dom = this.getDOMNode();
            $('.dropdown-toggle', dom).dropdown();
        },
        componentWillUnmount: function() {
            SocketClient.on('user:change', this.userChange);
        },
        render: function() {
            var accountContent;
            if (this.state.loading) {
                accountContent = (
                    React.createElement("li", null, 
                        React.createElement("a", {href: "javascript:;"}, 
                            React.createElement("span", {className: "glyphicon glyphicon-repeat glyphicon-loading"})
                        )
                    )
                );
            } else if (!this.state.user) {
                accountContent = '';
            } else {
                accountContent = (
                    React.createElement("li", {className: "user dropdown"}, 
                        React.createElement("a", {className: "dropdown-toggle", "data-toggle": "dropdown", href: "#"}, 
                            React.createElement("img", {className: "avatar", src: this.state.user.avatar}), 
                            React.createElement("span", null, this.state.user.name), 
                            React.createElement("span", {className: "caret"})
                        ), 
                        React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
                            React.createElement("li", null, React.createElement("a", {href: "javascript:;", className: "logout", onClick: this.logout}, "Logout"))
                        )
                    )
                );
            }
            return (
                React.createElement("div", {className: "nav navbar-nav navbar-right"}, 
                    accountContent
                )
            );
        }
    });
    var Nav = React.createClass({displayName: "Nav",
        render: function() {
            return (
                React.createElement("div", {className: "navbar navbar-static-top bs-docs-nav"}, 
                    React.createElement("div", {className: "container"}, 
                        React.createElement("div", {className: "navbar-header"}, 
                            React.createElement("a", {className: "navbar-brand"}, "Parasites")
                        ), 
                        React.createElement("nav", {className: "collapse navbar-collapse bs-navbar-collapse"}, 

                        React.createElement(Account, null)
                        )
                    )
                )
            );
        }
    });
    return Nav;
})
