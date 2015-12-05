var d3 = require('d3'),
    $  = require('jquery');

var d3TweetChart = {};

d3TweetChart.render = function(data) {
  var margin = {top: 0, right: 5, bottom: 0, left: 10},
      width = $('.timeline--chart').width() - margin.right - margin.left,
      height = 60;

  var parseDate = d3.time.format("%d-%b-%y").parse;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var line = d3.svg.line()
      .x(function(d) { return x(d.timestamp); })
      .y(function(d) { return y(d.total_tweets); })
      .interpolate('basis');

  var svg = d3.select(".timeline--chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "tweet-chart")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data.forEach(function(d) {
    d.timestamp = new Date(d.timestamp);
    d.total_tweets = +d.total_tweets;
  });

  x.domain(d3.extent(data, function(d) { return new Date(d.timestamp); }));
  y.domain(d3.extent(data, function(d) { return d.total_tweets; }));

  svg.append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", 0)
      .attr("x2", 0).attr("y2", "100%")
    .selectAll("stop")
      .data([
          {offset: "0%", color: "#BE011F"},
          {offset: "100%", color: "#FFFFAE"}
      ])
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return d.color; });

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
};

module.exports = d3TweetChart;
