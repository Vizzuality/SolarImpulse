var React = require("react");
var L = require('leaflet');

var TorqueLayer = require('./lib/torque_layer.js');

var Map = React.createClass({

  createMap(element) {
    window.map = L.map(element, {minZoom: 1, maxZoom: 5, attributionControl: false});

    L.tileLayer('http://{s}.tiles.mapbox.com/v4/smbtc.7d2e3bf9/{z}/{x}/{y}@2x.png?access_token={access_token}', {
      access_token: 'pk.eyJ1Ijoic21idGMiLCJhIjoiVXM4REppNCJ9.pjaLujYj-fcCPv5evG_0uA'
    }).addTo(map);

    new TorqueLayer(map, {
      torqueLayer: this.props.leafletTorqueLayer,
      callback: this.props.onTimeChange
    });

    return map;
  },

  setupMap() {
    var southWest = L.latLng(-37.020098201368114, -7.91015625),
        northEast = L.latLng(64.01449619484472, 184.74609375),
        bounds    = L.latLngBounds(southWest, northEast);
    this.map.fitBounds(bounds, {paddingBottomRight: [0,200]});
  },

  componentDidMount() {
    if (this.props.createMap) {
      this.map = this.props.createMap(this.getDOMNode());
    } else {
      this.map = this.createMap(this.getDOMNode());
    }

    this.setupMap();
  },

  render() {
    return (<div className="map"> </div>);
  }

});

module.exports = Map;
