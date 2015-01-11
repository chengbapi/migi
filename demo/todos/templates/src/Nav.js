define(function(require) {
    var $ = require('jquery');
    var bootstrap = require('bootstrap');
    var React = require('react');
    var UserService = require('../../service/user');
    var SocketClient = UserService.socket;
    var Router = require('parasites/Router');

    var Account = React.createClass({
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
            SocketClient.off('user:change', this.userChange);
        },
        render: function() {
            var accountContent;
            if (this.state.loading) {
                accountContent = (
                    <li>
                        <a href="javascript:;">
                            <span className="glyphicon glyphicon-repeat glyphicon-loading"></span>
                        </a>
                    </li>
                );
            } else if (!this.state.user) {
                accountContent = '';
            } else {
                accountContent = (
                    <li className="user dropdown">
                        <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                            <img className="avatar" src={this.state.user.avatar} />
                            <span>{this.state.user.name}</span>
                            <span className="caret"></span>
                        </a>
                        <ul className="dropdown-menu" role="menu">
                            <li><a href="javascript:;" className="logout" onClick={this.logout}>Logout</a></li>
                        </ul>
                    </li>
                );
            }
            return (
                <div className="nav navbar-nav navbar-right" >
                    {accountContent}
                </div>
            );
        }
    });
    var Nav = React.createClass({
        render: function() {
            return (
                <div className="navbar navbar-static-top bs-docs-nav">
                    <div className="container">
                        <div className="navbar-header">
                            <a className="navbar-brand">Parasites</a>
                        </div>
                        <nav className="collapse navbar-collapse bs-navbar-collapse">

                        <Account/>
                        </nav>
                    </div>
                </div>
            );
        }
    });
    return Nav;
})
