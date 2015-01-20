define(function(require) {
    var $ = require('jquery');
    var React = require('react');
    var UserService = require('../../service/user');
    var Router = require('migi/router/TreeRouter');

    var RegForm = React.createClass({
        getInitialState: function() {
            return {
                loading: false,
                error: false
            };
        },
        register: function() {
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
                <div id="reg-form" className="form-group">
                    <h4>Login Box</h4>
                    <div className={FormGroupClassName}>
                        <label className="control-label">{this.state.error}</label>
                        <input ref="username" type="text" className="form-control" id="username" placeholder="Enter your name"/>
                    </div>
                    <button onClick={this.login} className="btn btn-success btn-block" disabled={this.state.loading}>
                        {LoginButtonText}
                    </button>
                </div>
            );
        }
    });
    return RegForm;
});
