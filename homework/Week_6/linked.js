// Script for the linked.html file. Part of linked views assignment
// Annemijn Dijkhuis
// 11149272

function onload(){

    var format = d3.format(",");

    // Set tooltips
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>People working in bioeconomics: </strong><span class='details'>" + format(d.total) +"</span>";
                })

    // set margins
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

    // titles
    var title = d3.select("body")
                .append("h1")
                .text("Number of people working in different sectors of bioeconomics in 2015 in the EU");

    var subTitle = d3.select("body")
                    .append("h3")
                    .text("Annemijn Dijkhuis 11149272. " +
                      "To see the specific data of a country, select this country in the map by clicking.");

    // create map
    var path = d3.geoPath();

    // make svg
    var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append('g')
                .attr('class', 'map')


    var projection = d3.geoMercator()
                      .center([ 13, 54 ])
                      .translate([ width/2, height/2 ])
                      .scale([ width/3 ]);

    var path = d3.geoPath().projection(projection);

    svg.call(tip);

    // load data
    var worldMap = "world_countries.json"
    var euData = "data_eu.json"
    var requests = [d3.json(worldMap), d3.json(euData)];


    Promise.all(requests).then(function(response) {
      createHeatMap(response[0], response[1])
    }).catch(function(e){
        throw(e);
    });


function createHeatMap(dataMap, dataEU) {

    var dataById = {};

    // find total number of people per country and save
    dataEU.forEach(function(d){
                    if ((Object.keys(d)[0] === "European Union (28 countries)") === false){

                        total = Object.values(d)[0]["Total sectors"]
                        dataById[Object.keys(d)[0]] = total;
                        }
                    });


    // find data of countries
    dataMap.features.forEach(function(d){ d.total = dataById[d.properties['name']]})
    dataMap.features.forEach(function(d){ if (typeof d.total === "undefined") {
                                              d.total = NaN
                                              }
    });
    // find minima and maxima
    let arr = Object.values(dataById);
    let min = Math.min(...arr);
    let max = Math.max(...arr);

    // set color scale
    var color = d3.scaleLinear()
        .domain([0,max])
        .range([255,0]);

    // fill map with the right color
    d3.select('svg')
    .append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(dataMap.features)
    .enter().append("path")
    .attr("d", path)
    .style("fill", function(d) { if (isNaN(d.total)){
                                      return "#000000"
                                    }
                                    else {
                                      return "rgb("+ color(d.total) + ",0," + -(color(d.total) - 255) +")"
                                    }
                                  })
    .style('stroke', 'white')
    .style('stroke-width', 1.5)
    .style("opacity",0.8)

    // tooltips
    .style("stroke","white")
    .style('stroke-width', 0.3)
    .on('mouseover',function(d){
      if ((isNaN(d.total)) === false){
          tip.show(d);

        d3.select(this)
          .style("opacity", 1)
          .style("stroke","white")
          .style("stroke-width",3);
        }
    })
    .on('mouseout', function(d){
      if ((isNaN(d.total)) === false){
        tip.hide(d);
        d3.select(this)
          .style("opacity", 0.8)
          .style("stroke","white")
          .style("stroke-width",0.3);
        }
    })
    .on("click", function(d){
      country = d.properties["name"]
      if ((isNaN(d.total)) === false){
      country = d.properties["name"]
      barGraph(dataEU, country);
      }
      else{

          barGraph(dataEU, country)
          d3.selectAll(".bar").remove()
          d3.selectAll(".svgBars")
            .append("text")
            .style("fill", "grey")
            .text("No Data")
            .attr("x", 400)
            .attr("y", 150);

      }
    });



    svg.append("path")
        .datum(topojson.mesh(dataMap.features, function(a, b) { return a.id !== b.id; }))
        .attr("class", "names")
        .attr("d", path);

    // width and height of legendbar
    var w = 300, h = 50;

    // set legendsvg
    var key = d3.select("svg")
       .append("svg")
       .attr("height", 200)
       .attr("width", w + 10)
       .attr("x", 20)
       .attr("y", 400);

    // set linear gradient
     var legend = key.append("defs")
       .append("svg:linearGradient")
       .attr("id", "gradient")
       .attr("x1", "0%")
       .attr("y1", "100%")
       .attr("x2", "100%")
       .attr("y2", "100%")
       .attr("spreadMethod", "pad");

    // bar color gradients
     legend.append("stop")
       .data(dataMap.features)
       .attr("stop-color", "rgb("+ color(min) + ",0," + -(color(min) - 255) +")")
       .attr("stop-opacity", 0.8);

     legend.append("stop")
       .attr("offset", "33%")
       .attr("stop-color", "rgb("+ color(max*0.33) + ",0," + -(color(max*0.33) - 255) +")")
       .attr("stop-opacity", 0.8);

     legend.append("stop")
       .attr("offset", "66%")
       .attr("stop-color", "rgb("+ color(max*0.66) + ",0," + -(color(max*0.66) - 255) +")")
       .attr("stop-opacity", 0.8);

     legend.append("stop")
       .attr("offset", "100%")
       .attr("stop-color", "rgb("+ color(max) + ",0," + -(color(max) - 255) +")")
       .attr("stop-opacity", 0.8);

    // make bar
     key.append("rect")
       .attr("width", w)
       .attr("height", h -30)
       .style("fill", "url(#gradient)")
       .attr("transform", "translate(0, 15)");

    key.append("text")
       .attr("x", 0)
       .attr("y", h-5)
       .text(0)
       .style("font-size", "10px");

     key.append("text")
        .attr("x", w-30)
        .attr("y", h-5)
        .text(40000000)
        .style("font-size", "10px");

     // Title legend
     key.append("text")
     .attr("x", 0)
     .attr("y", 10)
     .text("Number of people working in bioeconomics")
     .style("font-size", "10px");

     // make grey block to define countries without data
     d3.select("svg")
     .append('rect')
     .attr("height", 15)
     .attr("width", 20)
     .attr("x", 20)
     .attr("y", 470)
     .style("fill", "#000000")
     .style("opacity", 0.8);


     d3.select("svg")
     .append("text")
     .text("= no Data")
     .attr("x", 50)
     .attr("y", 480);

    // set standard bargraph to the Netherlands
    barGraph(dataEU, "Netherlands")
};

function barGraph(dataEU, country){

  // remove old bargraph
  d3.selectAll('svg.svgBars').remove()

  // parse data for bargraphs
  dataEU.forEach(function(d){
    if (Object.keys(d)[0] === country){
      delete d[country]["Total sectors"]
      data = Object.values(Object.values(d)[0])
      ydata = Object.keys(Object.values(d)[0])
      return data,ydata
    }
  })

  // create SVG
  var svgWidth = 800, svgHeight = 400, barPadding = 5;
  var margin = { top: 150, right: 0, bottom: 50, left: 80};
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  var barWidth = (width / data.length);

  // set scales
  var yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

  var xScale = d3.scaleBand()
      .domain(ydata)
      .range([0, width]);

  // set svg
  var svgBars = d3.select('body')
      .append("svg")
      .attr("class", 'svgBars')
      .attr("width", svgWidth)
      .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");

  // create tooltip, source: https://bl.ocks.org/alandunning/274bf248fd0f362d64674920e85c1eb7
  var tooltip = d3.select("body").append("div").attr("class", "toolTip");

  var bars = svgBars.selectAll("rect")
            .data(data)

  // create right axes
  svgBars.append("g")
    .attr("class", "x axis")
    .attr('transform', "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)
          .ticks(data.length))

    .selectAll("text")
      .style("font-size", "6.5px")
      .style("text-anchor", "end")
      .attr("dx", "-.7em")
      .attr("dy", ".14em")
      .attr("transform", "translate(0, 0)rotate(-35)")


  // title
  svgBars.append("text")
      .attr("y", -margin.bottom)
      .attr("x",width/2)
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Amount of people working in sectors of bioeconomics in 2015 in "+ country)

    //text label for the y axis
  svgBars.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left - 10)
      .attr("x",0 - (height / 2))
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .text("Number of people")


  // text label for the x axis
  svgBars.append("text")
      .attr("y", height + margin.bottom)
      .attr("x", width/2)
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .text("Sectors")


  // create right axes
  svgBars.append("g")
    .attr("class", "y axis")
    .attr('transform', "translate(0," + 0 +")")
    .call(d3.axisLeft(yScale));


  // make barchart
  var barChart = bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
                  return yScale(d)
        })
        .attr("height", function(d) {
          return height - yScale(d);
        })
        .attr("width", barWidth - barPadding)
        .attr("transform", function (d,i) {
          var translate = [barWidth * i, 0];
          return "translate(" + translate + ")"})
          .on('mouseover',function(d){
              tooltip
                .style("left", d3.event.pageX - 20 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html("Number of people: " + d);
          })
          .on('mouseout', function(d){
            d3.selectAll(".bar")
            .transition()
            .style("opacity", 5);
            tooltip.style("display", "none");
              });
}
}
