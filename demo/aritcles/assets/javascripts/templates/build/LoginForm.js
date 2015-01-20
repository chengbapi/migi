define(function(require) {
    var $ = require('jquery');
    var React = require('react');
    var UserService = require('../../service/user');
    var Router = require('migi/router/TreeRouter');

    var LoginForm = React.createClass({displayName: "LoginForm",
        getInitialState: function() {
            return {
                loading: false,
                error: false
            };
        },
        login: function() {
            var self = this;
            var username = this.refs.username.getDOMNode().value;
            this.setState({ loading: true });
            UserService.login({
                username: username
            }).done(function() {
                Router.navigate('#/list');
            }).fail(function(error) {
                self.setState({
                    loading: false,
                    error: error
                });
            });
        },
        render: function() {
            var LoginButtonText;

            if (this.state.loading) {
                LoginButtonText = React.createElement("span", {className: "glyphicon glyphicon-repeat glyphicon-loading"})
            } else {
                LoginButtonText = 'Login';
            }

            var FormGroupClassName = 'form-group';
            if (this.state.error) {
                FormGroupClassName += ' has-error';
            }

            return (
                React.createElement("div", {id: "login-form", className: "form-group"}, 
                    React.createElement("h4", null, "Login Box"), 
                    React.createElement("div", {className: FormGroupClassName}, 
                        React.createElement("label", {className: "control-label"}, this.state.error), 
                        React.createElement("input", {ref: "username", type: "text", className: "form-control", id: "username", placeholder: "Enter your name"})
                    ), 
                    React.createElement("button", {onClick: this.login, className: "btn btn-primary btn-block", disabled: this.state.loading}, 
                        LoginButtonText
                    ), 
                    React.createElement("p", null, "Do not have an account? ", React.createElement("a", {href: "#/register"}, "Register One!"))
                )
            );
        }
    });
    return LoginForm;
});
