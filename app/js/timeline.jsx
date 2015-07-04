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
    var month = moment(this.props.currentTime).format("MMMM"),
        day   = moment(this.props.currentTime).format("D"),
        time  = moment(this.props.currentTime).format("HH:mm");

    return (
      <div>
        <span className="timeline--date-month">{month}</span>
        <span className="timeline--date-day">{day}</span>
        <span className="timeline--date-time">{time}</span>
      </div>
    );
  },

  render() {
    return (
      <div className="timeline">
        <h1>Solar Impulse</h1>

        <div className="timeline--top-container">
          <div className="timeline--date">
            {this._formattedDate()}
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
