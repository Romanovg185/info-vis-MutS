var minValue = 4294967295;
var maxValue = -4294967295;
var numBinsCircularHistogram = 16;

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

// Draws a single histogram, has to be extended to be good in overlapping
function drawCircleHistogram(angleData, i){
    var svg = d3.select("#circHist")
        .attr("width", 1000)
        .attr("height", 1000)
        .append("g")
        .attr("transform", "translate(" + 500 + "," + 500 + ")");


    // Just does the grouping
    var intervals = d3.range(0, 2*Math.PI, 2*Math.PI/numBinsCircularHistogram);
    var dataCircularIncomplete = d3.histogram()
        .thresholds(intervals)
        (angleData);

    // Uses the length of the grouped arrays to determine the real histogram
    dataCircular = [];
    dataCircularIncomplete.forEach(function(el){ dataCircular.push(el.length)});
    console.log(dataCircular);

    var pnt = svg.selectAll("arc").data(dataCircular);

    var arc = d3.arc()
        .startAngle(function(d, i){ return 2*Math.PI*i/numBinsCircularHistogram })
        .endAngle(function(d,i) { return 2*Math.PI*(i+1)/numBinsCircularHistogram })
        .innerRadius(0)
        .outerRadius(function(d){ return d}); // TODO: Find a way to do relative scaling on the radius

    pnt.enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", colorDict[i]);
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
    angleData = makeDataIntoAngles(dataPerProtein);
    angleData.forEach(function(el, i){ drawCircleHistogram(el,i);})
}
