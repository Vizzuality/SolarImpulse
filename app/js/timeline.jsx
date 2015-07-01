var React = require("react");

var TimeSlider = require('./time_slider.js');

var Timeline = React.createClass({

  render() {
    return (
      <div className="timeline">
        <h1>Solar Impulse</h1>

        {this.props.currentTime.toString()}

        <TimeSlider
          time={this.props.currentTime}
          startTime={this.props.startTime}
          endTime={this.props.endTime} />
      </div>
    );
  }

});

module.exports = Timeline;
