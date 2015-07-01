var React = require("react");

var tweets = require('./tweets.js');

var Tweet = React.createClass({
  render() {
    var content = this.props.children.toString();

    return (
      <li>
        {content}, {this.props.username}
      </li>
    );
  }
});

var TweetTicker = React.createClass({
  render() {
    var tweetNodes = tweets.map(function(tweet, index) {
      return (
        <Tweet username={tweet.username} key={index}>
          {tweet.text}
        </Tweet>
      );
    });

    return (
      <ul>
        {tweetNodes}
      </ul>
    );
  }
});

module.exports = TweetTicker;
