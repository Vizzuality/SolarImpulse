var React = require("react");

var Map = require('./map.jsx'),
    Timeline = require('./timeline.jsx');

var STARTING_DATE = new Date(2015, 2, 9);

var App = React.createClass({
  getInitialState() {
    return {currentTime: STARTING_DATE};
  },

  handleTimeChange(time) {
    this.setState({currentTime: time});
  },

  render() {
    return (
      <div>
        <Map onTimeChange={this.handleTimeChange} lat="21.53484700204879" lon="88.41796875" zoom="3" />
        <Timeline currentTime={this.state.currentTime} />
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('container'));
