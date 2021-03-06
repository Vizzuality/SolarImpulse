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
      g = svg.append("g").attr("class", "leaflet-zoom-hide"),
      plane;

  var gradient = svg.append("defs")
    .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "100%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "0%")
      .attr("spreadMethod", "pad");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "rgba(255,255,255,0)")
    .attr("stop-opacity", 0);

  gradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "#E3A820")
    .attr("stop-opacity", 1);

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "rgba(255,255,255,0)")
    .attr("stop-opacity", 0);

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

      if (changes.step === (this.torqueLayer.getTimeBounds().steps-1)) {
        EventBus.dispatch("torque:pause");
        this.torqueLayer.pause();
      }

      var timestamp = Math.round(changes.time.getTime() / 1000);
      var availablePaths = _.filter(paths, function(v, k) { return parseInt(k, 10) <= timestamp; });

      var finalPoint = _.last(availablePaths);

      var gradients = [];
      var i = 1;
      for(; i<=20; i++) {
        var previousPoint = availablePaths[availablePaths.length-(i+1)];
        if (previousPoint !== undefined) {
          var gradient = (finalPoint.centroid[1]-previousPoint.centroid[1])/(finalPoint.centroid[0]-previousPoint.centroid[0]);
          gradients.push(gradient);
        }
      }

      var angle = 90;
      if (gradients.length > 0) {
        var sum = gradients.reduce(function(a, b) { return a + b; });
        var averageGradient = sum/gradients.length;
        angle = Math.atan(averageGradient) * (180/Math.PI);
      }

      var x = finalPoint.centroid[0],
          y = finalPoint.centroid[1];
      plane.transition().duration(150).attr("transform", "translate("+(x+35)+","+(y-40)+") rotate("+(90)+")");

      var availablePathElements = availablePaths.map(function(point) { return point.path; });
      d3.selectAll(_.last(availablePathElements, 40)).style('display', 'block');

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

      var lineWidth = 4;
      svg.attr("width", bottomRight[0] - topLeft[0] + lineWidth*2)
          .attr("height", bottomRight[1] - topLeft[1] + lineWidth*2)
          .style("left", topLeft[0] + "px")
          .style("top", topLeft[1] + "px");

      g.attr("transform", "translate(" + -(topLeft[0] - lineWidth) + "," + -(topLeft[1] - lineWidth) + ")");

      var firstFlightPath = flightPath.slice(0, 2128),
          secondFlightPath = flightPath.slice(2128, flightPath.length);

      var times = [
        [1425870720, 1433170140],
        [1433170140, 1434083266]
      ];

      var firstPoints = LineUtils.sample(line(firstFlightPath), 2);
      var firstLineData = LineUtils.quad(firstPoints);
      var secondPoints = LineUtils.sample(line(secondFlightPath), 2);
      var secondLineData = LineUtils.quad(secondPoints);

      var points = LineUtils.sample(line(flightPath), 2);
      var lineData = LineUtils.quad(points);

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

      var centerPoints = [];
      g.selectAll("path").remove();
      g.selectAll("path")
        .data(lineData)
        .enter().append("path")
          .style("fill", function(d, i) {
            return '#E3A820';
          })
          .style("stroke", function(d, i) {
            return '#E3A820';
          })
          .attr("d", function(d, i) {
            var timeFromStart,
                timestamp;
            if (i <= (firstLineData.length-1)) {
              timeFromStart = i * ((times[0][1] - times[0][0])/firstLineData.length);
              timestamp = Math.round(times[0][0] + timeFromStart);
            } else {
              timeFromStart = (i-firstLineData.length) * ((times[1][1] - times[1][0])/secondLineData.length);
              timestamp = Math.round(times[1][0] + timeFromStart);
            }

            var path = LineUtils.lineJoin(d[0], d[1], d[2], d[3], lineWidth),
              centroid = getCenterForPath(path),
              centroidAsCoords = map.containerPointToLatLng(centroid);

            paths[timestamp] = {
              path: this,
              centroid: centroid,
              coords: centroidAsCoords
            };

            return path;
          });

      plane = g.append("svg:image")
        .attr("xlink:href", "images/plane.png")
        .attr("width", 75)
        .attr("height", 75);
    }

  },this))
  },this));
};

module.exports = TorqueLayer;
