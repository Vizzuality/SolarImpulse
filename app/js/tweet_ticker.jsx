var React = require("react"),
    $     = require("jquery"),
    slick = require("slick-carousel");

var tweets = require("./tweets.js");

var Tweet = React.createClass({
  render() {
    var content = this.props.children.toString();

    return (
      <li>
        <p>
          {content}
        </p>

        <p className="tweet--metadata">
          {this.props.username}, {this.props.date}
        </p>
      </li>
    );
  }
});

var TweetTicker = React.createClass({
  componentDidMount() {
    var slidesToShow = 5;
    var maxPosition = tweets.length - slidesToShow;

    var el = $(this.getDOMNode());
    el.slick({
      slidesToShow: slidesToShow,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 1000,
      arrows: false,
      infinite: false
    });

    el.on('afterChange', function(event, slick, currentSlide){
      if (currentSlide === maxPosition) {
        el.slick('slickGoTo', 1);
      }
    });
  },

  render() {
    var tweetNodes = tweets.map(function(tweet, index) {
      return (
        <Tweet username={tweet.username} date={tweet.date} key={index}>
          {tweet.text}
        </Tweet>
      );
    });

    return (
      <ul className="tweets">
        {tweetNodes}
      </ul>
    );
  }
});

module.exports = TweetTicker;
