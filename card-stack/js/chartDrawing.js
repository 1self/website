/*

Functions for drawing elements on charts.

Depends on d3 so ensure that that is linked to before this file in your main file.

 */

function addXAxis(xScale, svg, height, removeOverlaps, axisLabel, width, bottomMargin) {

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5);

    // Add the X Axis
    var dateTicks = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    .selectAll('.tick');

    for (var j = 0; j < dateTicks[0].length; j++) {
        var c = dateTicks[0][j],
            n = dateTicks[0][j+1];

        if (!c || !n || !c.getBoundingClientRect || !n.getBoundingClientRect)
            continue;

        while (c.getBoundingClientRect().right > n.getBoundingClientRect().left) {
            d3.select(n).remove();
            j++;
            n = dateTicks[0][j+1];
            if (!n)
            break;
        }
    }

    if (axisLabel) {
        // Add the text label for the x axis
        svg.append("text")
            .attr("transform", "translate(" + (width) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .attr("class", "axis-label x-axis-label")
            .text("Date");
    }
}

function addYAxis(yScale, svg, width, leftMargin, axisLabel, fnTickFormat) {

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .ticks(4)
        .tickSize(width)
        .tickFormat(fnTickFormat);

    console.log('ticks', yAxis.scale().ticks(yAxis.ticks()[0]));
    console.log('ticks', yAxis.scale().ticks());

    // Add the Y Axis
    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll('.tick')
        .each(function(data) {
            var tick = d3.select(this);
            console.log(tick, tick.text());
        });

    gy.selectAll("g").filter(function(d) { return d; })
        .classed("minor", true);

    gy.selectAll("text")
        .attr("x", 4)
        .attr("dy", -4);

        // Add the text label for the Y axis
    if (axisLabel !== "") {
        svg.append("text")
            .attr("y", 0 - leftMargin)
            .attr("x", 0)
            .attr("dy", "1em")
            .attr("class", "axis-label y-axis-label")
            .text(axisLabel);
    
        svg.select(".y-axis-label")
            .attr("transform", function() { return "rotate(-90) translate(" + (0 - this.getComputedTextLength()) + ", 0)"; } );
    }
}

function drawLollySticks(svg, data, height, width, xMap, yMap, lineColour, doTransitions) {

    // add vertical lines down from scatter points
    if (doTransitions) {
        svg.selectAll(".lolly-stick")
            .data(data)
            .enter().append("line")
            .attr("class", "lolly-stick")
            .style("stroke", function(d) { return d.highlight ? lineColour : '#a9b2bd'; } )
            .attr("y1", height)
            .attr("y2", height)
            .attr("x1", xMap)
            .attr("x2", xMap)
            .transition()
            .duration(1200)
            .ease('elastic')
            .attr("y2", yMap); //function(d) { return height - y(d.value); });

        // draw dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", height)
            .style("display", function(d) { return d.highlight === "date" ? "none" : "block" ; } )
            .style("fill", function(d) { return d.highlight ? lineColour : '#a9b2bd'; } )
            .transition()
            .duration(1200)
            .ease('elastic')
            .attr("cy", yMap); //function(d) { return height - y(d.value); });

    } else {
        svg.selectAll(".lolly-stick")
            .data(data)
            .enter().append("line")
            .attr("class", "lolly-stick")
            .style("stroke", function(d) { return d.highlight ? lineColour : '#a9b2bd'; } )
            .attr("y1", height)
            .attr("y2", yMap)
            .attr("x1", xMap)
            .attr("x2", xMap);

        // draw dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("display", function(d) { return d.highlight === "date" ? "none" : "block" ; } )
            .style("fill", function(d) { return d.highlight ? lineColour : '#a9b2bd'; } );
    }
}