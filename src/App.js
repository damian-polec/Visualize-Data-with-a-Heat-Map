import React, { Component } from 'react';
import './App.css';
import HeatMap from './components/HeatMap/HeatMap';

class App extends Component {
  state = {
    data: null,
    months: ["January","February","March","April","May","June","July",
    "August","September","October","November","December"],
    colors: ["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c",
    "#f9d057","#f29e2e","#e76818","#d7191c"]
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
      .then(r => r.json())
      .then(data => {
        const d = data;
        d.monthlyVariance.map(d =>{
          d.month = d.month - 1;
          d.year = d.year.toString();
          d.variance = + parseFloat(8.66 + d.variance).toFixed(2);
          return d
        })
        this.setState({data: d.monthlyVariance})
      })
  }
  render() {
    return (
      <div className="App">
        <h1 id='title'>Monthly Global Land-Surface Temperature</h1>
        <h3 id='description'>1753 - 2015: base temperature 8.66℃</h3>
        {this.state.data ? <HeatMap 
          data={this.state.data} 
          months={this.state.months} 
          colors={this.state.colors}/> : null}
      </div>
    );
  }
}

export default App;
