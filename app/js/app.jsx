var React = require("react");

var Map = require('./map.jsx'),
    Timeline = require('./timeline.jsx'),
    TweetTicker = require('./tweet_ticker.jsx');

var STARTING_DATE = new Date(2015, 2, 9),
    END_DATE = new Date(2015, 5, 6),
    TOTAL_TIME = END_DATE.getTime() - STARTING_DATE.getTime();

var L           = require('leaflet'),
    Torque      = require('torque.js');

var cartoCSS = require('../cartocss/tweets.cartocss');
var LAYER_OPTIONS = {
  user: 'simbiotica',
  table: 'tw_si_out',
  cartocss: cartoCSS,
  sql: "SELECT * FROM tw_si_out"
};

var torqueLayer = new L.TorqueLayer(LAYER_OPTIONS);

var App = React.createClass({
  getInitialState() {
    return {currentTime: STARTING_DATE};
  },

  handleTimeChange(time) {
    this.setState({currentTime: time});
  },

  render() {
    return (
      <div>
        <Map
          leafletTorqueLayer={torqueLayer}
          onTimeChange={this.handleTimeChange}
          zoom="3" />

        <Timeline
          leafletTorqueLayer={torqueLayer}
          currentTime={this.state.currentTime}
          startTime={STARTING_DATE}
          endTime={END_DATE} />

        <TweetTicker totalTime={20000} />

        <div className="info">
          <div className="info--left">
            <a href="#">What is this?</a>
          </div>

          <div className="info--right">
            powered by
            <a href="http://vizzuality.com"><img src="images/logo-vizzuality.png" className="info--vizzuality-logo" /></a>
            <a href="http://cartodb.com"><img src="images/logo-cartodb.png" className="info--cartodb-logo" /></a>
          </div>
        </div>
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('container'));
