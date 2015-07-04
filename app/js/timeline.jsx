var React = require("react");

var moment = require('moment');

var TimeSlider = require('./time_slider.js'),
    TweetChart = require('./tweet_chart.js');

var StateButton = React.createClass({
  getInitialState() {
    return {playing: true};
  },

  _onClick(event) {
    event.preventDefault();
    this.setState({playing: !this.state.playing});
    this.props.callback();
  },

  render() {
    if (this.state.playing === true) {
      return (
        <a href="#" className="timeline--toggle" onClick={this._onClick}>
          <img src="images/pause.png" />
        </a>
      );
    } else {
      return (
        <a href="#" className="timeline--toggle" onClick={this._onClick}>
          <img src="images/play.png" />
        </a>
      )
    }
  }
});

var Timeline = React.createClass({

  _onPausePlay(event) {
    this.props.leafletTorqueLayer.toggle();
  },

  _formattedDate() {
    return moment(this.props.currentTime).format("MMMM D HH:mm:ss");
  },

  render() {
    return (
      <div className="timeline">
        <h1>Solar Impulse</h1>

        <div className="timeline--top-container">
          <div className="timeline--date">
            <span>{this._formattedDate()}</span>
          </div>

          <div className="timeline--chart-container">
            <StateButton callback={this._onPausePlay} />

            <div className="timeline--chart">
              <TimeSlider
                leafletTorqueLayer={this.props.leafletTorqueLayer}
                time={this.props.currentTime}
                startTime={this.props.startTime}
                endTime={this.props.endTime} />
              <TweetChart />
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Timeline;
