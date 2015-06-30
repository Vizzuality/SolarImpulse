var React = require("react");
var Map = require('./map.jsx');

var App = React.createClass({
  render() {
    return <Map lat="21.53484700204879" lon="88.41796875" zoom="2" />;
  }
});

React.render(<App/>, document.getElementById('container'));
