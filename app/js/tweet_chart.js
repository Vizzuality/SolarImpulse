var React = require('react'),
    $     = require('jquery');

var d3TweetChart = require('./lib/d3_tweet_chart.js');

var TweetChart = React.createClass({

  getInitialState() {
    return {data: []};
  },

  _renderChart() {
    d3TweetChart.render(this.state.data);
  },

  _handleResize() {
    $('.tweet-chart').remove();
    this._renderChart();
  },

  componentDidMount() {
    window.addEventListener('resize', this._handleResize);

    $.get('tweet_counts.json', function(result) {
      this.setState({data: result});
    }.bind(this));
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },

  componentDidUpdate() {
    this._renderChart();
  },

  render() {
    return (<div></div>);
  }

});

module.exports = TweetChart;
