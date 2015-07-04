var React = require("react");

var Map = require('./map.jsx'),
    Timeline = require('./timeline.jsx'),
    TweetTicker = require('./tweet_ticker.jsx');

var STARTING_DATE = new Date(2015, 2, 9),
    END_DATE = new Date(2015, 5, 6);

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
          lat="21.53484700204879"
          lon="88.41796875"
          zoom="3" />

        <Timeline
          leafletTorqueLayer={torqueLayer}
          currentTime={this.state.currentTime}
          startTime={STARTING_DATE}
          endTime={END_DATE} />

        <TweetTicker />

        <div className="info">
          <div className="info--left">
            <a href="#">What is this?</a>
          </div>

          <div className="info--right">
            powered by
            <img src="images/logo-vizzuality.png" className="info--vizzuality-logo" />
            <img src="images/logo-cartodb.png" className="info--cartodb-logo" />
          </div>
        </div>
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('container'));
