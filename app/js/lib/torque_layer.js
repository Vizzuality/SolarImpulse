var L = require('leaflet');
var Torque = require('torque.js');

var cartoCSS = require('../../cartocss/tweets.cartocss');

var LAYER_OPTIONS = {
  user: 'simbiotica',
  table: 'twitter_solarimpulse_solarimpulse',
  cartocss: cartoCSS
};

var TorqueLayer = function(map, options) {
  this.map = map;

  var layer = new L.TorqueLayer(LAYER_OPTIONS);
    .addTo(this.map);
    .play();
};

module.exports = TorqueLayer;
