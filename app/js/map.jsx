var React = require("react");
var L = require('leaflet');

var TorqueLayer = require('./lib/torque_layer.js');

var Map = React.createClass({

  createMap: function (element) {
    var map = L.map(element, {maxZoom: 5});

    L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(map);

    new TorqueLayer(map);

    return map;
  },

  setupMap: function () {
    this.map.setView([this.props.lat, this.props.lon], this.props.zoom);
  },

  componentDidMount: function () {
    if (this.props.createMap) {
      this.map = this.props.createMap(this.getDOMNode());
    } else {
      this.map = this.createMap(this.getDOMNode());
    }

    this.setupMap();
  },

  render: function () {
    return (<div className="map"> </div>);
  }

});

module.exports = Map;
