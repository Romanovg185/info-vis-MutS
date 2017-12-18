var minValue = 4294967295;
var maxValue = -4294967295;
var numBinsCircularHistogram = 32;
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
        var svg = d3.select('#circHist');
        WIDTH = 1000,
        HEIGHT = 1000,
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

        console.log(dataCircular)
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
    console.log(maxRadiusList)
    var xRange = d3.scaleLinear()
        .range([MARGINS.left, WIDTH - MARGINS.right])
        .domain([-1*d3.max(maxRadiusList), d3.max(maxRadiusList)]),
    yRange = d3.scaleLinear()
        .range([HEIGHT - MARGINS.top, MARGINS.bottom])
        .domain([-1*d3.max(maxRadiusList), d3.max(maxRadiusList)]);
    return [xRange, yRange];
}

// Draws a single histogram, has to be extended to be good in overlapping
function drawCircleHistogram(angleData, i, xRange, yRange){
    var svg = d3.select('#circHist');

    // Just does the grouping
    var intervals = d3.range(0, 2*Math.PI, 2*Math.PI/numBinsCircularHistogram);
    var dataCircularIncomplete = d3.histogram()
        .thresholds(intervals)
        (angleData);

    // Uses the length of the grouped arrays to determine the real histogram
    dataCircular = [];
    dataCircularIncomplete.forEach(function(el){ dataCircular.push(el.length)});
    console.log(dataCircular)

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
    //lineData.push({x:0, y:0})

    for(var i = 0; xRange(25*i) - xRange(0) + innerRadius < 500; i++){
        svg.append("circle")
            .attr("cx", xRange(0))
            .attr("cy", yRange(0))
            .attr("r", (innerRadius - 5 + xRange(25*i) - xRange(0)))
          .style("fill", "none")
          .style("stroke", "black")
          .style("stroke-dasharray", "2,2")
          .style("stroke-width",".5px");
    }
    var spokeLength = innerRadius - 5 + xRange(25*i) - xRange(0)

    var lineFunc = d3.line()
        .x(function(d) {return xRange(d.x);})
        .y(function(d) {return yRange(d.y);});

    svg.append('svg:path')
        .attr('d', lineFunc(lineData))
        .attr('stroke', colorDict[i])
        .attr('stroke-width', 1)
        .attr('fill', 'none');
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
        drawCircleHistogram(angleData[i], i, ranges[0], ranges[1]);
    }
}
