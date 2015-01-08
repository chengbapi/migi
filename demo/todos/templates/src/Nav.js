define(function(require) {
    var React = require('react');
    var UserService = require('../../service/user');

    var Account = React.createClass({
        logout: function() {
            UserService.logout();
        },
        render: function() {
            return (
                <div>
                    <img src={this.props.user.avatar} />
                    <span>{this.props.user.name}</span>
                    <button className="logout" onClick={this.logout}></button>
                </div>
            );
        }
    });
    var Nav = React.createClass({
        render: function() {
            if (this.props.user) {
                return (
                    <div id="navigation">
                        <Account user={this.props.user} />
                    </div>
                );
            } else {
                return (
                    <h2>please login</h2>
                );
            }
        }
    });
    return Nav;
})
