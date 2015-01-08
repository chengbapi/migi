define(function(require) {
    var $ = require('jquery');
    var React = require('react');
    var UserService = require('../../service/user');
    var Router = require('parasites/Router');

    var LoginForm = React.createClass({
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
                LoginButtonText = <span className="glyphicon glyphicon-repeat glyphicon-loading"></span>
            } else {
                LoginButtonText = 'Login';
            }

            var FormGroupClassName = 'form-group';
            if (this.state.error) {
                FormGroupClassName += ' has-error';
            }

            return (
                <div id="login-form" className="form-group">
                    <h3>Login Box</h3>
                    <div className={FormGroupClassName}>
                        <label className="control-label">{this.state.error}</label>
                        <input ref="username" type="text" className="form-control" id="username" placeholder="Enter your name"/>
                    </div>
                    <button onClick={this.login} className="btn btn-primary btn-block" disabled={this.state.loading}>
                        {LoginButtonText}
                    </button>
                    <p>Do not have an account? <a href="#/register">Register One!</a></p>
                </div>
            );
        }
    });
    return LoginForm;
});
