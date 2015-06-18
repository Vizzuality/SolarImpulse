var L           = require('leaflet'),
    Torque      = require('torque.js'),
    d3          = require('d3'),
    _           = require('underscore'),
    colorbrewer = require('colorbrewer');

var cartoCSS = require('../../cartocss/tweets.cartocss');

var LAYER_OPTIONS = {
  user: 'simbiotica',
  table: 'tw_si_out_3',
  cartocss: cartoCSS,
  sql: "SELECT * FROM tw_si_out_3"
};

var TorqueLayer = function(map, options) {
  this.map = map;

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

  d3.json("/tweets.json", _.bind(function(tweetCounts) {
  d3.json("/path.json", _.bind(function(collection) {
    var flightPath = collection.features[0].geometry.coordinates;

    var colorScale = d3.scale.quantile()
      .domain(tweetCounts)
      .range(colorbrewer.YlOrRd[5]);

    window.layer = new L.TorqueLayer(LAYER_OPTIONS);
    window.layer.addTo(this.map);

    layer.on('change:time', function(changes) {
      if (changes.time.toString() === 'Invalid Date') { return; }
      g.selectAll('path:nth-child('+(changes.step-1)+')').style('display', 'block');
    });

    map.on("viewreset", reset);
    reset();

    // Reposition the SVG to cover the features.
    function reset() {
      var bounds = path.bounds(collection),
          topLeft = bounds[0],
          bottomRight = bounds[1];

      var lineWidth = 8;
      svg.attr("width", bottomRight[0] - topLeft[0] + lineWidth*2)
          .attr("height", bottomRight[1] - topLeft[1] + lineWidth*2)
          .style("left", topLeft[0] + "px")
          .style("top", topLeft[1] + "px");

      g.attr("transform", "translate(" + -(topLeft[0] - lineWidth) + "," + -(topLeft[1] - lineWidth) + ")");

      g.selectAll("path").remove();
      g.selectAll("path")
        .data(quad(sample(line(flightPath), 4)))
        .enter().append("path")
          .style("fill", function(d, i) {
            var colors = [
              colorScale(tweetCounts[i]),
              colorScale(tweetCounts[i+1])
            ];
            var color = d3.interpolateLab(colors[0], colors[1]);
            return color(d.t);
          })
          .style("stroke", function(d, i) {
            var colors = [
              colorScale(tweetCounts[i]),
              colorScale(tweetCounts[i+1])
            ];
            var color = d3.interpolateLab(colors[0], colors[1]);
            return color(d.t);
          })
          .attr("d", function(d) { return lineJoin(d[0], d[1], d[2], d[3], lineWidth); });
    }

  },this))
  },this));
};

// Sample the SVG path string "d" uniformly with the specified precision.
function sample(d, precision) {
  var path = document.createElementNS(d3.ns.prefix.svg, "path");
  path.setAttribute("d", d);

  var n = path.getTotalLength(), t = [0], i = 0, dt = precision;
  while ((i += dt) < n) t.push(i);
  t.push(n);

  return t.map(function(t) {
    var p = path.getPointAtLength(t), a = [p.x, p.y];
    a.t = t / n;
    return a;
  });
}

// Compute quads of adjacent points [p0, p1, p2, p3].
function quad(points) {
  return d3.range(points.length - 1).map(function(i) {
    var a = [points[i - 1], points[i], points[i + 1], points[i + 2]];
    a.t = (points[i].t + points[i + 1].t) / 2;
    return a;
  });
}

// Compute stroke outline for segment p12.
function lineJoin(p0, p1, p2, p3, width) {
  var u12 = perp(p1, p2),
      r = width / 2,
      a = [p1[0] + u12[0] * r, p1[1] + u12[1] * r],
      b = [p2[0] + u12[0] * r, p2[1] + u12[1] * r],
      c = [p2[0] - u12[0] * r, p2[1] - u12[1] * r],
      d = [p1[0] - u12[0] * r, p1[1] - u12[1] * r];

  if (p0) { // clip ad and dc using average of u01 and u12
    var u01 = perp(p0, p1), e = [p1[0] + u01[0] + u12[0], p1[1] + u01[1] + u12[1]];
    a = lineIntersect(p1, e, a, b);
    d = lineIntersect(p1, e, d, c);
  }

  if (p3) { // clip ab and dc using average of u12 and u23
    var u23 = perp(p2, p3), e = [p2[0] + u23[0] + u12[0], p2[1] + u23[1] + u12[1]];
    b = lineIntersect(p2, e, a, b);
    c = lineIntersect(p2, e, d, c);
  }

  return "M" + a + "L" + b + " " + c + " " + d + "Z";
}

// Compute intersection of two infinite lines ab and cd.
function lineIntersect(a, b, c, d) {
  var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3,
      y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3,
      ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
  return [x1 + ua * x21, y1 + ua * y21];
}

// Compute unit vector perpendicular to p01.
function perp(p0, p1) {
  var u01x = p0[1] - p1[1], u01y = p1[0] - p0[0],
      u01d = Math.sqrt(u01x * u01x + u01y * u01y);
  return [u01x / u01d, u01y / u01d];
}

module.exports = TorqueLayer;
