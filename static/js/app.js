// Use D3 library to read in 'samples.json'

// Fetch the JSON data and console log it
    
function metadata(sampleid){
  d3.json('samples.json').then((data) => {
    console.log(data);

   // Display the sample metadata, i.e., an individual's demographic info 
    var metadata = data.metadata
    var metadatasample = metadata.filter(metaObject => metaObject.id == sampleid)[0]

    var div = d3.select("#sample-metadata")
    div.html("");

    // Display each key-value pair from the metadata JSON object somewhere on the page.
    Object.entries(metadatasample).forEach(([key, value])=>{
      div.append("p").text(`${key.toUpperCase()}: ${value}`)
    });
  });
}

function createchart(sampleid){
  d3.json('samples.json').then((data) => {

    // Grab values from the response json object to build the plots
    var samples = data.samples
    var sampledata = samples.filter(sampleObject => sampleObject.id == sampleid)[0]
    
    var otuID = sampledata.otu_ids
    var otuLabels = sampledata.otu_labels
    var otuSampleValues = sampledata.sample_values
    //console.log(otuSampleValues)

    // Sort the data by results & slice for first 10 objects & reverse
    var sortedData = otuSampleValues.slice(0,10).sort((a, b) => (a-b)).reverse();
    var sortedOTU = sampledata.otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(); //from slack
    console.log(sortedData)
    console.log(sortedOTU)
    
    // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
    var trace2 = [{
    x: sortedData.reverse(),
    y: sortedOTU,
    text: otuLabels.slice(0, 10).reverse(),
    type: "bar",
    orientation: "h"
}];

   var layout2 = {
     title: "Top 10 OTUs Per Person"
   }

   Plotly.newPlot("bar", trace2, layout2);
  
    // Create a bubble chart that displays each sample
    var trace1 =[{
      x: otuID,
      y: otuSampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: otuSampleValues,
        color: otuID,
        colorscale: "Picnic"
      }
    }];

    var layout = {
      title: "Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      margin: {t:30}
    }

    Plotly.newPlot("bubble", trace1, layout);
   });
}

//// Event Tracker: Call updatePlotly() when a change takes place to the DOM (each tag - document object model)
  
// This function is called when a dropdown menu item is selected
function updatePlotly() {
  
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset")
  d3.json('samples.json').then((data) => {

    var sampleNames = data.names;
    sampleNames.forEach((sample)=>{
      dropdownMenu.append("option").text(sample).property("value", sample);
    })
    var firstitem = sampleNames[0];
    
    createchart(firstitem)  
    metadata(firstitem)
  });
}

// Update all of the plots any time that a new sample is selected. 
function optionChanged (newsample){
  createchart(newsample)  
  metadata(newsample)
}

updatePlotly();











  


