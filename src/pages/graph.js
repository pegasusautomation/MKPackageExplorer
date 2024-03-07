

import React from 'react';
import Plot from 'react-plotly.js';
import userData from './userData.json';
import "./alarm.css"

const Graph = () => {
    const dates = userData.map(entry => entry.date);
  const nullData = userData.map(entry => entry.null.br);

//   const scientificNotationTop = (Math.round(nullData[nullData.length - 1] / 1e7) * 1e7).toExponential(1);
  const data = [{
    x: dates,
    y: nullData,
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'green' },
    name: 'Null',
  }];

  const layout = {
    xaxis: {
      title: 'Timestamp',

    },
    yaxis: {
      title: 'BR Value',
    //   tickformat: '.1e',
    },
    autosize: true, // Adjust graph size to fit container
    margin: {
      l: 130,
      r: 50,
      b: 80,
      t: 50,
      pad:-20,
    },
    width: 920,
    height: 540,
  };

  return (
    <div className='table-container'>
        <caption style={{fontSize:'20px'}}><b>Bitrate Graph</b></caption>
        <br></br>
    <div>
      <Plot
        data={data}
        layout={layout}
      />
    </div>
    </div>
  );
  };

export default Graph;

