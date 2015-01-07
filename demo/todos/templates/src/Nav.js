define(function(require) {
    var React = require('react');
    var Account = React.createClass({
        render: function() {
            return (
                <div>
                    <span>{this.props.user.name}</span>
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
                    <h1>please login</h1>
                );
            }
        }
    });
    return Nav;
})
