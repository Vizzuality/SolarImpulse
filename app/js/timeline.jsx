var React = require("react");

var moment = require('moment'),
    _      = require('underscore');

var TimeSlider = require('./time_slider.js'),
    TweetChart = require('./tweet_chart.js');

var EventBus = require('./lib/event_bus.js');

var StateButton = React.createClass({
  getInitialState() {
    return {playing: false};
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
    var legs = [
      [0, "Abu Dhabi, UAE to Muscat, Oman"],
      [1426270590, "Muscat, Oman to Ahmedabad, India"],
      [1427377899, "Ahmedabad, India to Varanasi, India"],
      [1428208380, "Varanasi, India to Mandalay, Myanmar"],
      [1429223413, "Mandalay, Myanmar to Chongqing, China"],
      [1430438376, "Chongqing, China to Nanjing, China"],
      [1431161202, "Nanjing, China to Nagoya, Japan"],
      [1432960578, "Nagoya, Japan to Kalaeloa, Hawaii"]
    ];

    var timestamp = Math.round(this.state.time.getTime() / 1000);

    var currentLeg = _.last(_.filter(legs, function(leg) {
      return timestamp > leg[0];
    })) || _.last(legs);

    return (
      <div>
        <span>{currentLeg[1]}</span>
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
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Timeline;
