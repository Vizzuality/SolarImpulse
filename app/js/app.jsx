var React = require("react");
var Map = require('./map.jsx');

var App = React.createClass({
  render() {
    return <Map lat="21.637005211106306" lon="63.67675781249999" zoom="5" />;
  }
});

React.render(<App/>, document.getElementById('container'));
