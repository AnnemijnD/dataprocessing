// Javascript file for a scatterplot
// Annemijn Dijkhuis
// 11149272

function transformResponse(data){

    // access data property of the response
    let dataHere = data.dataSets[0].series;
    // console.log(dataHere)
    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // console.log(series)

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        // console.log(serie)
        lenArray.push(serie.values.length);
    });




    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];
    // console.log(observation)

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
                // console.log(data)
                // set up temporary object
                let tempObj = {};
                let tempString = string.split(":");

                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                    // console.log(tempObj[varArray[indexi].name])
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });
    // console.log(dataArray)
    // return the finished product!
    return dataArray;
}


function dataPointScatterPlot(dataset, maxData1, maxData2, countries){

  // Create SVG element
  var svgWidth = 1000, svgHeight = 500, svgPadding = 50;
  var margin = { top: 150, right: 200, bottom: 20, left: 80};
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  color = d3.schemeSet2


	var color_hash1 = {
				    0 : ["Netherlands","#1f77b4"],
					1 : ["Great Britain","#2ca02c"],
					2 : ["Germany","#ff7f0e"],
          3 : ["South Korea", "#ff0000"],
          4: ["France", "#asdf33"],
          5: ["Portugal", "#bb9900"]}

  var color_hash = countries



  var svg = d3.select("body")
              .append("svg")
              .attr("width",svgWidth)
              .attr("height", svgHeight)
              .append("g")
              .attr("id", "svgg")
              .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");
// Create a dropdown

    // d3.select("body")
    //   .append("fruitDropdown")

    // var countryMenu = d3.select("fruitDropdown")
    //
    // countryMenu
		// .append("select")
		// .selectAll("option")
    //     .data(dataset)
    //     .enter()
    //     .append("option")
    //     .attr("value", function(d){
    //       console.log(d.key)
    //         return d.key;
    //     })
    //     .text(function(d){
    //         return d.key;
    //     })


  // x Scale
  var xScale = d3.scaleLinear()
			//.domain(["Alabama","Alaska","Arizona","Arkansas","California"])
			.domain([0, maxData1])
			//.range([padding, w-padding * 2]);
			.range([margin.left, width]);

  // y Scale
  var yScale = d3.scaleLinear()
			.domain([0, maxData2])
			//.range([padding, w-padding * 2]);
			.range([height, margin.bottom]);



  //
  // var xAxis = d3.axisBottom().scale(xScale).ticks(5);
  //
	// var yAxis = d3.axisLeft().scale(yScale).ticks(5);

  svg.append("g")
    .attr("class", "x axis")
    .attr('transform', "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
          // .ticks(dataset.length))

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
  .attr("r", 2)
  .style("fill", function(d, i){

      var index = countries.findIndex(function (element){
      console.log(d[2])
      return element === d[2]})
      return color[String(index)]
    })


  // title
  svg.append("text")
      .attr("y", -40)
      .attr("x",width/2)
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Female researchers and consumer confidence of different countries and years")

    // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10-margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .style("font-size", "13px")
      .text("Women researchers as a percentage of total researchers (headcount)")


  // text label for the x axis
  svg.append("text")
      .attr("y", height + margin.bottom/2)
      .attr("x", width/2)
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .text("Consumer confidence")

      // adding legend -> source: adfadf
      var legend = svg.append("g")
              .attr("class","legend")
              .attr("x", svgWidth - margin.right)
              .attr("y", svgHeight - margin.top);
              // .attr("height", 100)
              // .attr("width",100);

      legend.selectAll("g").data(countries)
          .enter()
          .append('g')
          .each(function(d,i){
            var g = d3.select(this);
            g.append("rect")
              .attr("x", svgWidth - 250)
              .attr("y", i*25 + 10)
              .attr("width", 10)
              .attr("height",10)
              .style("fill", color[String(i)]);

            g.append("text")
             .attr("x", svgWidth - 200)
             .attr("y", i*25 + 20)
             .attr("height",30)
             .attr("width",100)
             .on("click", function(d){
               console.log(d)
               update(dataset, d, xScale, yScale, countries)
             })
             .style("fill",color[String(i)])
             .text(countries[String(i)]);
          });

          console.log(xScale("18.90"));

}


function update(dataset, country, xScale, yScale, countries){

  updatedData = [];



  d3.selectAll("circle").remove()

  dataset.forEach(function(element){
    if (element[2] === country) {
      updatedData.push(element)
      console.log(element)
    }

  })

  console.log(xScale("18.90"));


  var circle = d3.select("#svgg")
  .selectAll("circle")
 .data(updatedData)
 .enter()
 .append("circle")
 .attr("cx", function(d) {
   console.log(d);
     return xScale(d[0]);
})
.attr("cy", function(d) {
     return yScale(d[1]);

})
.attr("r", 2)
.style("fill", function(d, i){

    var index = countries.findIndex(function (element){
    console.log(d[2])
    return element === d[2]})
    return color[String(index)]


  })


}

//
var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"


var requests = [d3.json(womenInScience), d3.json(consConf)];


Promise.all(requests).then(function(response) {
    // data = transformResponse(requests)


    dataset1 = response[0]
    dataset2 = response[1]
    // console.log(response[0])
    // console.log(response[1])
    var newData1 = transformResponse(dataset1)
    var newData2 = transformResponse(dataset2)
    console.log(newData1)
    console.log(newData2)

    var newDataCom = [];
    var newData1X = [];
    var newData2X = [];
    console.log(newData1X)
    var countries = []




    newData2.forEach(function(element2) {
        newData1.forEach(function(element1) {
          if ((element1["Country"] === element2["Country"]) && (element1["time"] === element2["time"])) {
            newDataCom.push([parseFloat(Object.values(element1)[3]).toFixed(2), parseFloat(Object.values(element2)[4]).toFixed(2), element1["Country"]]);
            newData2X.push(Object.values(element2)[4])
            newData1X.push(Object.values(element1)[3])

            if (countries.includes(element1["Country"]) == false){
              countries.push(element1["Country"])
            }
          }
        });
        // console.log(parseFloat(Object.values(element)[4]));
        // console.log(element["Country"])
    });
    maxData1 = d3.max(newData1X)
    maxData2 = d3.max(newData2X)



    // parseFloat("123.456").toFixed(2)
    // console.log(newData1X)

    // i = 0;
    // newData1.forEach(function(element){
    //   console.log(element['time'])
    //   if element['time'] == newData2[i]['time']
    //   newData1X[i].push(parseFloat(Object.values(element)[2]).toFixed(2));
    //   i += 1
    // });
    // console.log(newData1X)
    // // console.log(newData2X)





    // dataPointScatterPlot(newData2[3])
    dataPointScatterPlot(newDataCom, maxData1, maxData2, countries)


}).catch(function(e){
    throw(e);
});

// d3.json("pers_exp.json").then(function(root) {
//
//       root.forEach(function(element) {
//           if (parseInt(element["1-Personele exploitatie"]) > 2){
//
//           data_pers.push(parseInt(element["1-Personele exploitatie"]));
//           data_lev.push((element["Leveranciers"]));
//       };
//   })


  window.onload = function() {

    console.log('Yes, you can!')
  };
