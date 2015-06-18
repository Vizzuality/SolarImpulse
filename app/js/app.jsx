var React = require("react");
var Map = require('./map.jsx');

var App = React.createClass({
  render() {
    return <Map lat="31.052934" lon="125.859375" zoom="5" />;
  }
});

React.render(<App/>, document.getElementById('container'));
