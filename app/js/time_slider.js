var React = require("react"),
    $     = require("jquery");

var d3TimeSlider = require('./lib/d3_time_slider.js');

var TimeSlider = React.createClass({
  _onBrush(time) {
    var step = Math.round(this.props.leafletTorqueLayer.timeToStep(time))

    this.props.leafletTorqueLayer.pause();
    this.props.leafletTorqueLayer.setStep(step);
  },

  handleResize() {
    $('.time-slider').remove();
    d3TimeSlider.create(
      this.props.startTime, this.props.endTime, this._onBrush);
  },

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    d3TimeSlider.create(
      this.props.startTime, this.props.endTime, this._onBrush);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },

  componentDidUpdate() {
    d3TimeSlider.update(this.props.time);
  },

  render() {
    return (<div> </div>);
  }
});

module.exports = TimeSlider;
