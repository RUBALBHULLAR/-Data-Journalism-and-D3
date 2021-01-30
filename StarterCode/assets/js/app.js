// D3 Animated Scatter Plot
// we need to at least set up the width, height and margins of the graph.
// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 20;

// space for placing words
var labelArea = 110;

// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

// Create the actual canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Set the radius for each dot that will appear in the graph.
// Note: Making this a function allows us to easily call
// it in the mobility section of our code.
var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

// The Labels for our Axes
// A) Bottom Axis
// ==============

// We create a group element to nest our bottom axes labels.
svg.append("g").attr("class", "xText");
// xText will allows us to select the group without excess code.
var xText = d3.select(".xText");

// We give xText a transform property that places it at the bottom of the chart.
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();
// Now we use xText to append three text SVG files, with y coordinates specified to space out the values.
// 1. Poverty
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");
// 2. Age
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");
// 3. Income
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

// B) Left Axis
// ============

// Specifying the variables like this allows us to make our transform attributes more readable.
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// We add a second label group, this time for the axis left of the chart.
svg.append("g").attr("class", "yText");

// yText will allows us to select the group without excess code.
var yText = d3.select(".yText");

// Like before, we nest the group's transform attr in a function
// to make changing it on window change an easy operation.
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// Now we append the text.
// 1. Obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// 2. Smokes
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// 3. Lacks Healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");
  
// 2. Import our .csv file
d3.csv("assets/data/data.csv").then(function(data) {
  // Visualize the data
  visualize(data);
});

// 3. Create our visualization function
function visualize(theData) {
  // PART 1: Essential Local Variables and Functions
  // curX and curY will determine what data gets represented in each axis.
  
  var curX = "poverty";
  var curY = "obesity";

  // We also save empty variables for our the min and max values of x and y.
  // this will allow us to alter the values in functions and remove repetitious code.
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // tooltip rules
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      console.log(d)
    
      // x key
      var theX;
      var theState = "<div>" + d.state + "</div>";
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
      // If the x key is poverty
      if (curX === "poverty") {
        // Grab the x key and a version of the value formatted to show percentage
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else{
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      // Display what we capture.
      return theState + theX + theY;
    });
     // Call the toolTip function.
     svg.call(toolTip);


    //  Change the min and max for x
    function xMinMax(){
      xMin = d3.min(theData,function(d){
        return parseFloat(d[curX]) * 0.90;
  
      });
      xMax = d3.max(theData,function(d){
        return parseFloat(d[curX]) * 1.10;
        
      });
    }

    // change the min and max for y
    function yMinMax(){
      yMin = d3.min(theData,function(d){
        return parseFloat(d[curY]) * 0.90;
  
      });
      yMax = d3.max(theData,function(d){
        return parseFloat(d[curY]) * 1.10;
        
      });
    }
    function labelChange(axis, clickedText) {
  
      d3
        .selectAll(".aText")
        .filter("." + axis)
        .filter(".active")
        .classed("active", false)
        .classed("inactive", true);
  
      // Switch the text just clicked to active.
      clickedText.classed("inactive", false).classed("active", true);
    }
  
    xMinMax();
    yMinMax();

    var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);

    var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);
  
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
  

    // Determine x and y tick counts.
    function tickCount() {
      if (width <= 500) {
        xAxis.ticks(5);
        yAxis.ticks(5);
      }
      else {
        xAxis.ticks(10);
        yAxis.ticks(10);
      }
    }
    tickCount();

    svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
    svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  
    // grouping for our dots and their labels.
    var theCircles = svg.selectAll("g theCircles").data(theData).enter();
  
    theCircles
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })

    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
      })

     .on("mouseout", function(d) {
    // Remove the tooltip
    toolTip.hide(d);
    // Remove highlight
    d3.select(this).style("stroke", "#e3e3e3");
      });

      theCircles
      .append("text")
      // We return the abbreviation to .text, which makes the text the abbreviation.
      .text(function(d) {
        return d.abbr;
      })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      return yScale(d[curY]) + circRadius / 2.5;
    })
    // Hover Rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });
    // Part 4: Make the Graph Dynamic
    d3.selectAll(".aText").on("click", function() {
      var self = d3.select(this);

      if (self.classed("inactive")) {
        // defined name and axis saved in label.
        var axis = self.attr("data-axis");
        var name = self.attr("data-name");

        if (axis === "x") {

          curX = name;


          xMinMax();


          xScale.domain([xMin, xMax]);

         // Now use a transition when we update the xAxis.
         svg.select(".xAxis").transition().duration(300).call(xAxis);

         d3.selectAll("circle").each(function() {
          d3
          .select(this)
          .transition()
          .attr("dy", function(d) {
            return yScale(d[curY]) + circRadius / 3;
          })
          .duration(300);
        });

      labelChange(axis,self);
      }
    }

  });
  // Part 5: Mobile Responsive
  // =========================
  // With d3, we can call a resize function whenever the window dimensions change.
  d3.select(window).on("resize".resize);
  function resize(){
    width = parseInt(d3.select("#scatter").style("width"));
    height = width -width/3.9;
    leftTextX = (height+labelArea)/2-labelArea;
    svg.attr("width",width).attr("height",height);
    
    
  }
}

    
