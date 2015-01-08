define(function(require) {
    var React = require('react');
    var UserService = require('../../service/user');

    var Main = React.createClass({
        render: function() {
            if (this.props.user) {
                return (
                    <h2> Welcome! { this.props.user.name } </h2>
                );
            } else {
                return (
                    <div>
                        <p>Login Box</p>
                        Do not have an account ?<a href="#/registry">registry</a>
                    </div>
                );
            }
        }
    });
    return Main;
})
