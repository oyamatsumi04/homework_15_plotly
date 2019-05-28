function buildMetadata(sample) {
 
  const url =`/metadata/${sample}`;
  console.log(url);
  const metaMeta = d3.select("#sample-metadata");
  

  d3.json(url).then(function(data) {

    metaMeta.html(""); 

    Object.entries(data).forEach(function([key,value]) {    
      const cell = metaMeta.append("p");
      cell.text(`${key}: ${value}`);
    });

  });

}

function buildCharts(sample) {

  const url =`/samples/${sample}`;

  
  d3.json(url).then(function(data) {


    var trace1 = {
        labels: data.otu_ids.slice(0,10),
        values: data.sample_values.slice(0,10),
        type: 'pie'
    };

    var dataPie = [trace1];

    var layout = {
    };
    
    Plotly.newPlot("pie", dataPie, layout);

    var trace2 = {
        type: "scatter",
        x:data.otu_ids,
        y:data.sample_values,
        text:data.otu_labels,
        mode:'markers',
        marker: { 
          size:data.sample_values,
          color:data.otu_ids,
          sizeref: 1.5,
          sizemode: 'diameter'
        }
        
    };

    var layout = {
      xaxis: {
        title: {
          text: 'OTU ID',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        },
      },
    }
    var dataBubble = [trace2];
    
    Plotly.newPlot("bubble", dataBubble, layout, {scrollZoom: true});    
    

  });


function init() {
  var selector = d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

init()};
