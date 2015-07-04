var React = require("react"),
    $     = require("jquery"),
    slick = require("slick-carousel");

var tweets = require("./tweets.js");

var Tweet = React.createClass({
  render() {
    var content = this.props.children.toString();
    var user_link = "http://twitter.com/" + this.props.username.substring(1);

    return (
      <li>
        <p className="tweet--content">
          {content}
        </p>

        <p className="tweet--metadata">
          <a href={user_link}>{this.props.username}</a>, <a href={this.props.link}>{this.props.date}</a>
        </p>
      </li>
    );
  }
});

var TweetTicker = React.createClass({
  componentDidMount() {
    var slidesToShow = 5,
        maxPosition = tweets.length - slidesToShow,
        speed = this.props.totalTime / tweets.length;

    var el = $(this.getDOMNode());
    el.slick({
      slidesToShow: slidesToShow,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: speed,
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
        <Tweet username={tweet.username} date={tweet.date} link={tweet.link} key={index}>
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
