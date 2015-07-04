var React = require('react'),
    $     = require('jquery');

var Modal = React.createClass({
  handleClick(event) {
    event.preventDefault();

    this.hide();
    this.props.onClose();
  },

  show() {
    var node = this.getDOMNode();
    $(node).show();
  },

  hide() {
    var node = this.getDOMNode();
    $(node).hide();
  },

  componentDidUpdate() {
    if (this.props.isOpen === true) {
      this.show();
    } else {
      this.hide();
    }
  },

  render() {
    return (
      <div className="modal--window">
        <div className="modal--wrapper">
          <div className="modal--container">
            <h2>Flying on the wings of Twitter</h2>

            <p>
              Since March 9th 2015, André Borschberg and Bertrand Piccard
              have been flying Solar Impulse 2.0 around the world. This is
              the world’s first round-the-world flight using only the
              sun’s energy. Millions of people around the world have been
              following the events unfold and tweeting their support for
              flight without fossil fuels.
            </p>

            <p>
              Vizzuality have built a visualisation of the flight
              ‘powered by tweets’ using a number of innovative
              techniques combined with the popular <a
              href="http://docs.cartodb.com/tutorials/introduction_torque.html">Torque
              library</a>. Sit back and watch as the support rushes in
              from all corners of the world on Solar Impulse’s
              pioneering voyage across the world.
            </p>

            <div className="modal--action-buttons">
              <a href="#" className="modal--btn-continue" onClick={this.handleClick}>Continue</a>
            </div>
          </div>
        </div>

        <div className="modal--background"></div>
      </div>
    );
  }
});

module.exports = Modal;
