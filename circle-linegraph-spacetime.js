var minValue = 4294967295;
var maxValue = -4294967295;
var numBinsCircularHistogram = 40;
var innerRadius = 50;

var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;

// Make the data into radians in the [0, tau] range
function makeDataIntoAnglesSpacetime(dataPerProtein){
    var arcLength = maxValue - minValue;
    var angleData = [];
    var timeData = [];
    for(var i = 0; i < dataPerProtein.length; i++){
        angleData.push([]);
        timeData.push([]);
        for(var j = 0; j < dataPerProtein[i].length; j++){
            var angle = 2*Math.PI*dataPerProtein[i][j].p/arcLength;
            angleData[i].push(angle < 0 ? 2*Math.PI+angle : angle);
            timeData[i].push(dataPerProtein[i][j].t);
        }
    }
    return [timeData, angleData];
}

// Obtain the ranges for perfect overlay
function getRangesCircleHistogramSpacetime(timeData, angleData, startTime, endTime){
    var maxRadiusList = [];
    for(let i = 0; i < angleData.length; i++){
        WIDTH = 850,
        HEIGHT = 850,
        MARGINS = {
          top: 20,
          right: 20,
          bottom: 20,
          left: 50
        };
        var maxOfProt = 0;
        for(let j=0; j < timeData[i].length; j++){
            if(maxOfProt < timeData[i][j]){
                maxOfProt = timeData[i][j];
            }
        }
        maxRadiusList.push(maxOfProt);
    }
    var xRange = d3.scaleLinear()
        .range([MARGINS.left, WIDTH - MARGINS.right])
        .domain([-1*endTime, endTime]),
    yRange = d3.scaleLinear()
        .range([HEIGHT - MARGINS.top, MARGINS.bottom])
        .domain([-1*endTime, endTime]);
    return [xRange, yRange];
}

// Draws a single histogram, has to be extended to be good in overlapping
function drawCircleHistogramSpacetime(angleData, timeData, j, xRange, yRange){
    var svg = d3.select('#cSpaceTime');
    var centroidPoints = [];
    for(let i = 0; i < angleData.length; i++){
        var startAngle = 2*Math.PI*i/numBinsCircularHistogram;
        var x = (timeData[i]) * Math.cos(angleData[i]);
        var y = (timeData[i]) * Math.sin(angleData[i]);
        centroidPoints.push({x: x, y: y});
    }

    var lineData = centroidPoints;


    var lineFunc = d3.line()
        .x(function(d) {return xRange(d.x);})
        .y(function(d) {return yRange(d.y);});


    // Circles axes
    var WIDTH = 1000;
    for(var i = 0; xRange(i) < WIDTH; i++){
        svg.append("circle")
            .attr("cx", xRange(0))
            .attr("cy", yRange(0))
            .attr("r", 25*i)
          .style("fill", "none")
          .style("stroke", "#b1a7a7")
          .style("stroke-dasharray", "1,2")
          .style("stroke-width",".5px");
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


    // Draw histogram
    svg.append('svg:path')
        .attr('d', lineFunc(lineData))
        .attr('stroke', colorDict[j])
        .attr('stroke-width', 2)
        .attr('fill', 'none');

}

function mainCircularHistogramSpacetime(dataIn, startTime, endTime){
    var dataPerProtein = [];
    for (let i = 0; i < dataIn.maxNumberOfProteins; i++) {
        dataPerProtein.push([]);
    }
    // While determining the min/max position values, get the positions in a form of datapoint per protein
    for (let key in dataIn.data){
        let i = 0;
        for (let protein in dataIn.data[key].positions){
            //Note the potential confusion factor here, I divide by 100 for some reason...
            // QQ something to do with index 3000 @ 30 sec timestep?
            let myPosition = dataIn.data[key].positions[protein].position/100; //Suspicious division by 100
            if (myPosition > maxValue){
                maxValue = myPosition;
            }
            if (myPosition < minValue){
                minValue = myPosition;
            }
            dataPerProtein[i].push({t: key, p:myPosition}); //Glug glug glug, delicious Kool-Aid
            i++;
        }
    }
    for(let i = 0; i < dataPerProtein.length; i++){
        dataPerProtein[i].sort(function(a,b){return a.t-b.t});
    }
    var resultingData = makeDataIntoAnglesSpacetime(dataPerProtein);
    var angleData = resultingData[1];
    var timeData = resultingData[0];
    var ranges = getRangesCircleHistogramSpacetime(timeData, angleData, startTime, endTime)
    console.log(ranges)
    for(let i = 0; i < angleData.length; i++){
        drawCircleHistogramSpacetime(angleData[i], timeData[i],   i, ranges[0], ranges[1]);
    }
}
