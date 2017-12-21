var minValue = 4294967295;
var maxValue = -4294967295;
var innerRadius = 50;

var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;

// Make the data into radians in the [0, tau] range
function makeDataIntoAngles(dataPerProtein){
    var arcLength = maxValue - minValue;
    var angleData = [];
    for(var i = 0; i < dataPerProtein.length; i++){
        angleData.push([]);
        for(var j = 0; j < dataPerProtein[i].length; j++){
            var angle = 2*Math.PI*dataPerProtein[i][j]/arcLength;
            angleData[i].push(angle < 0 ? 2*Math.PI+angle : angle);
        }
    }
    return angleData;
}

// Obtain the ranges for perfect overlay
function getRangesCircleHistogram(angleData){
    var maxRadiusList = [];
    for(let i = 0; i < angleData.length; i++){
        var svg = d3.select('#cLinePlot');
        WIDTH = 850,
        HEIGHT = 850,
        MARGINS = {
          top: 20,
          right: 20,
          bottom: 20,
          left: 50
        };

        var intervals = d3.range(0, 2*Math.PI, 2*Math.PI/numBinsCircularHistogram);
        var dataCircularIncomplete = d3.histogram()
            .thresholds(intervals)
            (angleData[i]);

        // Uses the length of the grouped arrays to determine the real histogram
        dataCircular = [];
        dataCircularIncomplete.forEach(function(el){ dataCircular.push(el.length)});

        var centroidPoints = [];
        var maxRadius = 0;
        for(let i = 0; i < dataCircular.length; i++){
            var startAngle = 2*Math.PI*i/numBinsCircularHistogram;
            var endAngle = 2*Math.PI*(i+1)/numBinsCircularHistogram;
            var outerRadius = dataCircular[i];
            maxRadius = outerRadius > maxRadius ? outerRadius : maxRadius;
        }
        maxRadiusList.push(maxRadius)

    }
    var maxRadius = 0;
    for(let i = 0; i < maxRadiusList.length; i++){
        if(maxRadiusList[i] > maxRadius){
            maxRadius = maxRadiusList[i];
        }
    }
    maxRadius += innerRadius;
    var xRange = d3.scaleLinear()
        .range([MARGINS.left, WIDTH - MARGINS.right])
        .domain([-1*maxRadius, maxRadius]),
    yRange = d3.scaleLinear()
        .range([HEIGHT - MARGINS.top, MARGINS.bottom])
        .domain([-1*maxRadius, maxRadius]);
    return [xRange, yRange, maxRadius];
}

// Draws a single histogram, has to be extended to be good in overlapping
function drawCircleHistogram(angleData, j, xRange, yRange, maxRadius){
    var svg = d3.select('#cLinePlot');

    // Just does the grouping
    var intervals = d3.range(0, 2*Math.PI, 2*Math.PI/numBinsCircularHistogram);
    var dataCircularIncomplete = d3.histogram()
        .thresholds(intervals)
        (angleData);

    // Uses the length of the grouped arrays to determine the real histogram
    dataCircular = [];
    for(let i = 0; i < numBinsCircularHistogram; i++){
        if(i < dataCircularIncomplete.length){
            dataCircular.push(dataCircularIncomplete[i].length);
        } else { // Deal with empty bins of hist function
            dataCircular.push(0);
        }
    }

    var centroidPoints = [];
    for(let i = 0; i < dataCircular.length; i++){
        var startAngle = 2*Math.PI*i/numBinsCircularHistogram;
        var endAngle = 2*Math.PI*(i+1)/numBinsCircularHistogram;
        var outerRadius = dataCircular[i];
        var x = (outerRadius + innerRadius) * Math.cos((endAngle + startAngle)/2);
        var y = (outerRadius + innerRadius) * Math.sin((endAngle + startAngle)/2);
        centroidPoints.push({x: x, y: y});
    }

    var lineData = centroidPoints;
    lineData.push(centroidPoints[0]);



    var lineFunc = d3.line()
        .x(function(d) {return xRange(d.x);})
        .y(function(d) {return yRange(d.y);});


    // Circles axes
    var a = 0
    for(var i = 0; xRange(25*i) - xRange(0) + innerRadius < maxRadius; i++){
        a++ // Dummy to keep doing something during this loop
//        svg.append("circle")
//            .attr("cx", xRange(0))
//            .attr("cy", yRange(0))
//            .attr("r", (innerRadius - 5 + xRange(25*i) - xRange(0)))
//          .style("fill", "none")
//          .style("stroke", "#b1a7a7")
//          .style("stroke-dasharray", "1,2")
//          .style("stroke-width",".5px");
//        svg.append("text")
//            .attr("x", function(d) { return 425; })
//            .attr("y", function(d) { return innerRadius - 5 + xRange(25*i) - xRange(0); })
//            .text( function (d) { return 25*i })
//            .attr("font-family", "sans-serif")
//            .attr("font-size", "20px")
    }

    // Spokes axes
    var spokeLength = innerRadius - 5 + xRange(25*i) - xRange(0);
    var spokePoints = [];
    for(let i = 0; i< numBinsCircularHistogram; i++){
        var startAngle = 2*Math.PI*i/numBinsCircularHistogram;
        var endAngle = 2*Math.PI*(i+1)/numBinsCircularHistogram;
        var x = spokeLength * Math.cos((endAngle + startAngle)/2);
        var y = spokeLength * Math.sin((endAngle + startAngle)/2);
        spokePoints.push({x:x, y:y});
        spokePoints.push({x:0, y:0});
    }
    svg.append('svg:path')
        .attr('d', lineFunc(spokePoints))
        .style("stroke", "#b1a7a7")
        .style("stroke-dasharray", "2,2")
        .style("stroke-width",".5px")
        .attr('fill', 'none');

    // Circles axes
    for(var i = 0; innerRadius - 5 + xRange(100*i) - xRange(0) < yRange(spokeLength/10); i++){
        svg.append("circle")
            .attr("cx", xRange(0))
            .attr("cy", yRange(0))
            .attr("r", innerRadius - 5 + xRange(100*i) - xRange(0))
          .style("fill", "none")
          .style("stroke", "#b1a7a7")
          .style("stroke-dasharray", "1,2")
          .style("stroke-width",".5px");
    }

    // Draw histogram
    svg.append('svg:path')
        .attr('d', lineFunc(lineData))
        .attr('stroke', colorDict[j])
        .attr('stroke-width', 2)
        .attr('fill', 'none');

     var yAxis = d3.axisLeft()
        .scale(xRange)
        .ticks(10)
        .tickFormat(d3.format(".0s"));

    svg.append("g").attr("class", "axis").call(yAxis);

}

function mainCircularHistogram(dataIn){
    var dataPerProtein = [];
    for (let i = 0; i < dataIn.maxNumberOfProteins; i++) {
        dataPerProtein.push([]);
    }
    // While determining the min/max position values, get the positions in a form of datapoint per protein
    for (let key in dataIn.data){
        let i = 0;
        for (let protein in dataIn.data[key].positions){
            //Note the potential confusion factor here, I divide by 100 for some reason...
            let myPosition = dataIn.data[key].positions[protein].position/100; //Suspicious division by 100
            if (myPosition > maxValue){
                maxValue = myPosition;
            }
            if (myPosition < minValue){
                minValue = myPosition;
            }
            dataPerProtein[i].push(myPosition); //Glug glug glug, delicious Kool-Aid
            i++;
        }
    }
    var angleData = makeDataIntoAngles(dataPerProtein);
    var ranges = getRangesCircleHistogram(angleData)
    for(let i = 0; i < angleData.length; i++){
        drawCircleHistogram(angleData[i], i, ranges[0], ranges[1], ranges[2]);
    }
}
