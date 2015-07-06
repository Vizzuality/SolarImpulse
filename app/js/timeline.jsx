var React = require("react");

var moment = require('moment');

var TimeSlider = require('./time_slider.js'),
    TweetChart = require('./tweet_chart.js');

var EventBus = require('./lib/event_bus.js');

var StateButton = React.createClass({
  getInitialState() {
    return {playing: true};
  },

  componentDidMount() {
    EventBus.addEventListener("torque:pause", this._pause);
    EventBus.addEventListener("torque:play", this._play);
  },

  _pause() {
    this.setState({playing: false});
  },

  _play() {
    this.setState({playing: true});
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

var STARTING_DATE = new Date(2015, 2, 9);
var CurrentTime = React.createClass({
  getInitialState() {
    return {time: STARTING_DATE}
  },

  componentDidMount() {
    EventBus.addEventListener('torque:time', function(event, time) {
      this.setState({time: time});
    }, this);
  },

  _formattedDate() {
    var month = moment(this.state.time).format("MMMM"),
        day   = moment(this.state.time).format("D"),
        time  = moment(this.state.time).format("HH:mm");

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
      <div className="timeline--date">
        {this._formattedDate()}
      </div>
    );
  }
});

var Timeline = React.createClass({

  _onPausePlay(event) {
    this.props.leafletTorqueLayer.toggle();

    if (this.props.leafletTorqueLayer.isRunning() === true) {
      EventBus.dispatch("torque:play");
    } else {
      EventBus.dispatch("torque:pause");
    }
  },

  render() {
    return (
      <div className="timeline">
        <h1>Solar Impulse</h1>

        <div className="timeline--top-container">
          <CurrentTime />

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
