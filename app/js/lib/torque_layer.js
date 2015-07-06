var L           = require('leaflet'),
    Torque      = require('torque.js'),
    d3          = require('d3'),
    _           = require('underscore'),
    colorbrewer = require('colorbrewer'),
    $           = require('jquery');

var LineUtils = require('./line_utils.js');

var EventBus = require('./event_bus.js');

function getCenter(arr) {
    var x = arr.map(function(a){ return a[0] });
    var y = arr.map(function(a){ return a[1] });
    var minX = Math.min.apply(null, x);
    var maxX = Math.max.apply(null, x);
    var minY = Math.min.apply(null, y);
    var maxY = Math.max.apply(null, y);
    return [(minX + maxX)/2, (minY + maxY)/2];
}

var paths;
var TorqueLayer = function(map, options) {
  this.map = map;
  this.torqueLayer = options.torqueLayer;
  this.callback = options.callback || function(){};

  // Use Leaflet to implement a D3 geometric transformation.
  function projectPoint(x, y) {
    return map.latLngToLayerPoint(new L.LatLng(y, x));
  }

  function projectPathPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

  var transform = d3.geo.transform({point: projectPathPoint}),
      path = d3.geo.path().projection(transform);

  var line = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d, i) { return projectPoint.apply(this, d).x; })
    .y(function(d) { return projectPoint.apply(this, d).y; });

  var svg = d3.select(map.getPanes().overlayPane).append("svg"),
      g = svg.append("g").attr("class", "leaflet-zoom-hide");

  d3.json("./tweets.json", _.bind(function(tweetCounts) {
  d3.json("./path.json", _.bind(function(collection) {
    var flightPath = collection.features[0].geometry.coordinates;

    this.torqueLayer.addTo(this.map);

    var alreadyBeenStarted = false;
    var previousStep = 0;
    this.torqueLayer.on('change:time', _.bind(function(changes) {
      if (changes.time.toString() === 'Invalid Date') { return; }

      // Pause for modal
      if (!alreadyBeenStarted) {
        alreadyBeenStarted = true;
        this.torqueLayer.pause();
        this.torqueLayer.setStep(0);
      }

      if (changes.step === 0 || changes.step < previousStep) {
        svg.selectAll('path').style('display', 'none');
      }

      var timestamp = Math.round(changes.time.getTime() / 1000);
      var availablePaths = _.filter(paths, function(v, k) { return parseInt(k, 10) <= timestamp; });
      d3.selectAll(availablePaths).style('display', 'block');

      previousStep = changes.step;
      EventBus.dispatch('torque:time', this, changes.time);
    }, this));

    map.on("viewreset", reset);
    reset();

    // Reposition the SVG to cover the features.
    function reset() {
      var zoom = map.getZoom();
      var colorScale = d3.scale.quantile()
        .domain(tweetCounts[zoom])
        .range(colorbrewer.YlOrRd[5]);

      var bounds = path.bounds(collection),
          topLeft = bounds[0],
          bottomRight = bounds[1];

      var lineWidth = 8;
      svg.attr("width", bottomRight[0] - topLeft[0] + lineWidth*2)
          .attr("height", bottomRight[1] - topLeft[1] + lineWidth*2)
          .style("left", topLeft[0] + "px")
          .style("top", topLeft[1] + "px");

      g.attr("transform", "translate(" + -(topLeft[0] - lineWidth) + "," + -(topLeft[1] - lineWidth) + ")");

      var points = LineUtils.sample(line(flightPath), 3);
      var lineData = LineUtils.quad(points);

      var start_time = 1425870720;
      var end_time = 1433170140;
      var delta = (end_time - start_time) / points.length;
      paths = {};

      var getCenterForPath = function(path) {
        var head = path.split("L")[0];
        var tail = path.split("L")[1];

        var polygon = []

        polygon.push(head.slice(1, head.length).split(","));
        polygon = polygon.concat(
          tail.slice(0, tail.length-1).split(" ").map(function(l) { return l.split(","); })
        )

        return getCenter(polygon);
      };

      var d = lineData[0];
      var startingPath = getCenterForPath(LineUtils.lineJoin(d[0], d[1], d[2], d[3], lineWidth));
      d = lineData[lineData.length-1];
      var finalPath = getCenterForPath(LineUtils.lineJoin(d[0], d[1], d[2], d[3], lineWidth));
      var lineLength = finalPath[0] - startingPath[0];

      var centerPoints = [];
      g.selectAll("path").remove();
      g.selectAll("path")
        .data(lineData)
        .enter().append("path")
          .style("fill", function(d, i) {
            var colors = [
              colorScale(tweetCounts[zoom][i]),
              colorScale(tweetCounts[zoom][i+1])
            ];
            var color = d3.interpolateLab(colors[0], colors[1]);
            return color(d.t);
          })
          .style("stroke", function(d, i) {
            var colors = [
              colorScale(tweetCounts[zoom][i]),
              colorScale(tweetCounts[zoom][i+1])
            ];
            var color = d3.interpolateLab(colors[0], colors[1]);
            return color(d.t);
          })
          .attr("d", function(d, i) {
            var path = LineUtils.lineJoin(d[0], d[1], d[2], d[3], lineWidth),
              centroid = getCenterForPath(path),
              centroidAsCoords = map.containerPointToLatLng(centroid),
              timeFromStart = i * ((end_time - start_time)/lineData.length),
              timestamp = Math.round(start_time + timeFromStart);
            paths[timestamp] = this;

            return path;
          });
    }

  },this))
  },this));
};

module.exports = TorqueLayer;
