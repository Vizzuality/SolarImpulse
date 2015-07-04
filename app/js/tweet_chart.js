var React = require('react'),
    $     = require('jquery');

var d3TweetChart = require('./lib/d3_tweet_chart.js');

var TweetChart = React.createClass({

  componentDidMount() {
    $.get('/tweet_counts.json', function(result) {
      if (this.isMounted()) {
        d3TweetChart.render(result);
      }
    }.bind(this));
  },

  render() {
    return (<div></div>);
  }

});

module.exports = TweetChart;
