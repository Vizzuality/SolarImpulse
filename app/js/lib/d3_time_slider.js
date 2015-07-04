var d3 = require('d3'),
    $  = require('jquery');

var EventBus = require('./event_bus.js');

var d3TimeSlider = {};

var x,
    brush,
    handle;

d3TimeSlider.create = function(startTime, endTime, brushCallback) {
  var margin = {top: 0, right: 5, bottom: 0, left: 10},
      width = $('.timeline--chart').width() - margin.right - margin.left,
      height = 60;

  x = d3.scale.linear()
      .domain([startTime, endTime])
      .range([0, width])
      .clamp(true);

  brush = d3.svg.brush()
      .x(x)
      .extent([0, 0])
      .on("brush", brushed);

  var svg = d3.select(".timeline--chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "time-slider")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .append("rect")
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("x", 0)
    .attr("y", height / 2)
    .attr("width", "100%")
    .attr("height", 2)
    .style("fill", 'white');

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height / 2 + ")")
    .select(".domain")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "halo");

  var slider = svg.append("g")
      .attr("class", "slider")
      .call(brush);

  slider.selectAll(".extent,.resize").remove();

  handle = slider.append("circle")
      .attr("class", "handle")
      .attr("transform", "translate(0," + height / 2 + ")")
      .attr("r", 9);

  function brushed() {
    var value = x.invert(d3.mouse(this)[0]);
    brushCallback(value);
    brush.extent([value, value]);
    handle.attr("cx", x(value));

    EventBus.dispatch("torque:pause");
  }
}

d3TimeSlider.update = function(time) {
  var value = x(time);
  brush.extent([value, value]);
  handle.attr("cx", value);
}

module.exports = d3TimeSlider;
