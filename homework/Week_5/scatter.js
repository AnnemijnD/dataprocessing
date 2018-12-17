// Javascript file for a scatterplot
// Annemijn Dijkhuis
// 11149272

function transformResponse(data){

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;


    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });


    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];


    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);


    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);


    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];

            if (data != undefined){

                // set up temporary object
                let tempObj = {};
                let tempString = string.split(":");

                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;

                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
}


function dataPointScatterPlot(dataset, maxData1, maxData2, countries){

  // creates plot

  // Create SVG element
  var svgWidth = 1000, svgHeight = 500, svgPadding = 50;
  var margin = { top: 50, right: 200, bottom: 20, left: 40};
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  var svg = d3.select("body")
              .append("svg")
              .attr("width",svgWidth)
              .attr("height", svgHeight)
              .append("g")
              .attr("id", "svgg")
              .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");

  // create color scheme of the datapoints
  color = d3.schemeSet2

  // x Scale
  var xScale = d3.scaleLinear()
			.domain([10, maxData1])
			.range([margin.left, width]);

  // y Scale
  var yScale = d3.scaleLinear()
			.domain([0, maxData2])
			.range([height, margin.bottom]);

  // create x axis
  svg.append("g")
    .attr("class", "x axis")
    .attr('transform', "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))


  // create y axis
  svg.append("g")
    .attr("class", "y axis")
    .attr('transform', "translate(" + margin.left +"," + 0 + ")")
    .call(d3.axisLeft(yScale))


  // create circle for each datapoint
  var circle = svg.selectAll("circle")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) {
                      return xScale(d[0]);
                    })
                    .attr("cy", function(d) {
                      return yScale(d[1]);
                    })
                    .attr("r", 4)
                    .style("fill", function(d, i){
                      var index = countries.findIndex(function (element){
                      return element === d[2]})
                    return color[String(index)]
                  });

  // title
  svg.append("text")
      .attr("y", -40)
      .attr("x",width/2)
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Female researchers and consumer confidence of different countries from 2008-2017")

    // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10-margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .text("Consumer Confidence")

  // text label for the x axis
  svg.append("text")
      .attr("y", height + margin.bottom/2)
      .attr("x", width/2)
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .text("Female researchers as a percentage of total researchers (headcount)")

  // adding legend -> source: http://bl.ocks.org/ZJONSSON/3918369
  var legend = svg.append("g")
          .attr("class","legend")
          .attr("x", svgWidth - margin.right/2)
          .attr("y", svgHeight - margin.top/2);

  // create rectangles
  legend.selectAll("g").data(countries)
      .enter()
      .append('g')
      .each(function(d,i){
        var g = d3.select(this);
        g.append("rect")
          .attr("x", svgWidth - 200)
          .attr("y", i*25 + 10)
          .attr("width", 10)
          .attr("height",10)
          .style("fill", color[String(i)])

          // if it is the last element, also add "All" block
          if (i === countries.length - 1){

            g.append("text")
            .attr("x", svgWidth - 150)
            .attr("y", (i+1)*25 + 20)
            .on("click", function(d){
              update(dataset, "All", xScale, yScale, countries)
            })
            .style("fill", "black")
            .style("font-weight", "bold")
            .style("text-decoration", "underline")
            .text("All")

          }

        // create text for legend
        g.append("text")
         .attr("x", svgWidth - 150)
         .attr("y", i*25 + 20)
         .on("click", function(d){
           update(dataset, d, xScale, yScale, countries)
         })
         .style("fill",color[String(i)])
         .text(countries[String(i)]);
      })

      // create information
      d3.select("body")
        .append("p")
        .text("Female researchers and consumer confidence in the Netherlands,"
          +" Germany, Korea, Portugal, United Kingdom and France,"
        +" from 2008-2017. Datapoints of these countries are shown separately when"
        +" the user clicks on this country. Data is restored when 'All' is selected.")
        .append("a")
        .html('<a href="http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"><br>Source Women in science</br></a>')
        .append("a")
        .html('<a href="http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015">Source Consumer confidence</a>')
}


function update(dataset, country, xScale, yScale, countries){
  // updates the data

  updatedData = [];

  // remove old data
  d3.selectAll("circle").remove()

  // finds data for chosen element
  dataset.forEach(function(element){
    if (country === "All") {
      updatedData = dataset
    }
    else if (element[2] === country) {
      updatedData.push(element)
    }
  })

  // creates new datapoints
  var circle = d3.select("#svgg")
    .selectAll("circle")
     .data(updatedData)
     .enter()
     .append("circle")
     .attr("cx", function(d) {

         return xScale(d[0]);
    })
    .attr("cy", function(d) {
         return yScale(d[1]);

    })
    .attr("r", 4)
    .style("fill", function(d, i){
        var index = countries.findIndex(function (element){
          return element === d[2]})
        return color[String(index)]
      })

}

function parsingData(){

// parse data
var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
var requests = [d3.json(womenInScience), d3.json(consConf)];


Promise.all(requests).then(function(response) {

    // parse the different datasets
    dataset1 = response[0];
    dataset2 = response[1];
    var newData1 = transformResponse(dataset1);
    var newData2 = transformResponse(dataset2);

    // combine the datasets
    var newDataCom = [];
    var newData1X = [];
    var newData2X = [];
    var countries = [];

    // Finds data of the datasets and combines them correctly
    newData2.forEach(function(element2) {
        newData1.forEach(function(element1) {
          if ((element1["Country"] === element2["Country"]) && (element1["time"] === element2["time"])) {
            newDataCom.push([parseFloat(Object.values(element1)[3]).toFixed(2), parseFloat(Object.values(element2)[4]).toFixed(2), element1["Country"], element1["time"]]);
            newData2X.push(Object.values(element2)[4])
            newData1X.push(Object.values(element1)[3])

            // get al list of countries to make sure the data is dynamic
            if (countries.includes(element1["Country"]) == false){
              countries.push(element1["Country"])
            }
          }
        });

    });

    // find the maximum of the datasets
    maxData1 = d3.max(newData1X);
    maxData2 = d3.max(newData2X);

    // plot the data
    dataPointScatterPlot(newDataCom, maxData1, maxData2, countries);

  }).catch(function(e){
      throw(e);
      });
}

window.onload = function() {
    parsingData()
  };
