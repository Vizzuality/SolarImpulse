var React = require("react");

var Map = require('./map.jsx'),
    Timeline = require('./timeline.jsx'),
    Modal = require('./modal.jsx');

var STARTING_DATE = new Date(2015, 2, 9),
    END_DATE = new Date(2015, 5, 12),
    TOTAL_TIME = END_DATE.getTime() - STARTING_DATE.getTime();

var L           = require('leaflet'),
    Torque      = require('torque.js');

var EventBus = require('./lib/event_bus.js');

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
    return {
      currentTime: STARTING_DATE,
      modal: {open: true}
    };
  },

  handleTimeChange(time) {
    this.setState({currentTime: time});
  },

  _showModal(event) {
    event.preventDefault();
    this.setState({modal: {open: true}});
  },

  _hideModal() {
    this.setState({modal: {open: false}});
    torqueLayer.play();
    EventBus.dispatch("torque:play");
  },

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.modal.open}
          onClose={this._hideModal} />

        <Map
          leafletTorqueLayer={torqueLayer}
          onTimeChange={this.handleTimeChange}
          zoom="3" />

        <Timeline
          leafletTorqueLayer={torqueLayer}
          currentTime={this.state.currentTime}
          startTime={STARTING_DATE}
          endTime={END_DATE} />

        <div className="info">
          <h1>Solar Impulse</h1>

          <div className="info--left">
            <a href="#" onClick={this._showModal}>What is this?</a>
          </div>

          <div className="info--right">
            created by
            <a href="http://vizzuality.com"><img src="images/logo-vizzuality.png" className="info--vizzuality-logo" /></a>

            powered by
            <a href="http://cartodb.com"><img src="images/logo-cartodb.png" className="info--cartodb-logo" /></a>
          </div>
        </div>
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('container'));
