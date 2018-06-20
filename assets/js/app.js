// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.

// svg dimension
var svgWidth = 960;
var svgHeight = 800;

var margin = {
  top: 40,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select (".chart")
    .append("div")
    .attr ("class","tooltip")
    .style ("opacity",0.5);

// Retrieve data from the CSV file and execute everything below
d3.csv("data/data.csv", function(err, healthData) {
    if (err) throw err;
  
    // parse data
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });  
    
    // xLinearScale function above csv import
    var xLinearScale = d3.scaleLinear().range([0, width]);

    // Create y scale function
    var yLinearScale = d3.scaleLinear().range([height,0]); 


    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Domain scale
    xLinearScale.domain([0, d3.max(healthData, function(data){
		return +data.poverty;
	  })]);

	  yLinearScale.domain([0, d3.max(healthData,function(data){
		return +data.healthcare;
    })]);
    
    // function used for updating circles group with new tooltip
    var toolTip = d3.tip()
      .attr("class", "toolTip")
      .offset([80, -60])
      .html(function(data) {
      var state = data.state;
	    var povertyRate = +data.poverty;
	    var healthcare = +data.healthcare;
	    return (state + "<br> Poverty Rate: " + povertyRate + "<br> Percentage of the population in poor health: " + healthcare);
	  });

     chartGroup.call(toolTip);
     
    // append initial data points to the chart
    chartGroup.selectAll("circle")
    .data(healthData)
    .enter().append("circle")
      .attr("cx", function(data, index) {
          console.log(data.poverty);
          return xLinearScale(data.poverty);
      })
      .attr("cy", function(data, index) {
          console.log(data.healthcare);
          return yLinearScale(data.healthcare);
      })
      .attr("r", "10")
      .attr("fill","blue")
      .style("opacity", 0.5)
      .on("click", function(data) {
          toolTip.show(data);
      })
      //On mouseout event.
      .on("mouseout", function(data, index) {
          toolTip.hide(data);
      });	

    //Append bottom axis
      chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    //Append left axis
    chartGroup.append("g")
      .call(leftAxis);

    //Append y-axis labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percentage of the Population in Poor Health");

    //Append x-axis labels
    chartGroup.append("text")
      .attr("transform", "translate(" + (width/3) + "," + (height + margin.top + 30) + ")") 
      .attr("class", "axisText")
      .text("Percentage of the Population with average Health care plan");

});
