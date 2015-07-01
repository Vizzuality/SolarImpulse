var d3 = require('d3');

var d3TimeSlider = {};

var x,
    brush,
    handle;

d3TimeSlider.create = function(startTime, endTime) {
  var margin = {top: 200, right: 50, bottom: 200, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.bottom - margin.top;

  x = d3.scale.linear()
      .domain([startTime, endTime])
      .range([0, width])
      .clamp(true);

  brush = d3.svg.brush()
      .x(x)
      .extent([0, 0])
      .on("brush", brushed);

  var svg = d3.select(".timeline").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height / 2 + ")")
    .select(".domain")

  var slider = svg.append("g")
      .attr("class", "slider")
      .call(brush);

  slider.selectAll(".extent,.resize")
      .remove();

  slider.select(".background")
      .attr("height", height);

  handle = slider.append("circle")
      .attr("class", "handle")
      .attr("transform", "translate(0," + height / 2 + ")")
      .attr("r", 9);

  function brushed() {
    console.log('brushed');
    var value = brush.extent()[0];

    if (d3.event.sourceEvent) { // not a programmatic event
      value = x.invert(d3.mouse(this)[0]);
      brush.extent([value, value]);
    }

    handle.attr("cx", x(value));
    d3.select("body").style("background-color", d3.hsl(value, .8, .8));
  }
}

d3TimeSlider.update = function(time) {
  var value = x(time);
  brush.extent([value, value]);
  handle.attr("cx", value);
}

module.exports = d3TimeSlider;
