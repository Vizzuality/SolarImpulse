var React = require("react");

var d3TimeSlider = require('./lib/d3_time_slider.js');

var TimeSlider = React.createClass({
  _onBrush(time) {
    var step = Math.round(this.props.leafletTorqueLayer.timeToStep(time))

    this.props.leafletTorqueLayer.pause();
    this.props.leafletTorqueLayer.setStep(step);
  },

  componentDidMount() {
    d3TimeSlider.create(
      this.props.startTime, this.props.endTime, this._onBrush);
  },

  componentDidUpdate() {
    d3TimeSlider.update(this.props.time);
  },

  render() {
    return (<div> </div>);
  }
});

module.exports = TimeSlider;
