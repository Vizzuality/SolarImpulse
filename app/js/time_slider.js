var React = require("react");

var d3TimeSlider = require('./lib/d3_time_slider.js');

var TimeSlider = React.createClass({
  componentDidMount() {
    d3TimeSlider.create(this.props.startTime, this.props.endTime);
  },

  componentDidUpdate() {
    d3TimeSlider.update(this.props.time);
  },

  render() {
    return (
      <div>
        Hello Wooooooooooooooooorld
      </div>
    );
  }
});

module.exports = TimeSlider;
