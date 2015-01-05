Example = React.createClass({
  getInitialState: function() {
    alert(2)
    return {
      age: 15
    }
  },
  handleClick: function() {
    var age = this.state.age + 5;
    this.setState({ age: age });
  },
  componentDidMount: function() {
    alert(1)
  },
  render: function() {
    return (<div onClick={this.handleClick}>
      {this.props.count},
      {this.state.age}
      </div>)
  }
})
