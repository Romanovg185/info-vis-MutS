function makeBinsLineGraph(positionData){
    var formatCount = d3.format(",.0f");
    var svg = d3.select("svg");
    var margin = {top: 10, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([0, width])

    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(numBinsHistogram))
        (positionData);
    return bins;
}

function getXYValuesLineGraph(bins){
    var xes = [];
    var ys = [];
    for (let i=0; i<bins.length; i++){
        var xRow = [];
        var yRow = [];
        for (let j=0; j<bins[i].length; j++){
            xRow.push((bins[i][j].x1 + bins[i][j].x0)/2);
            yRow.push(bins[i][j].length);
        }
        xes.push(xRow);
        ys.push(yRow);
    }
    return [xes, ys];
}

function drawLineGraph(dataPerProtein){
    // Bins the data to plot
    var bins = [];
    dataPerProtein.forEach(function(el){bins.push(makeBinsLineGraph(el))});
    var xyData = getXYValuesLineGraph(bins);
    var xes = xyData[0];
    var ys = xyData[1];

    // Finds extremes data and therefore data domain
    var xMin = 4294967295;
    var xMax = -4294967295;
    var yMax = 0;
    xes.forEach(function(el){xMin = d3.min(el) < xMin ? d3.min(el) : xMin});
    xes.forEach(function(el){xMax = d3.max(el) > xMax ? d3.max(el) : xMax});
    ys.forEach(function(el){yMax = d3.max(el) > yMax ? d3.max(el) : yMax});

    var vis = d3.select('#linePlot'),
        WIDTH = 1500,
        HEIGHT = 400,
        MARGINS = {
          top: 20,
          right: 20,
          bottom: 20,
          left: 50
        },
        xRange = d3.scaleLinear()
            .range([MARGINS.left, WIDTH - MARGINS.right])
            .domain([xMin, xMax]),
        yRange = d3.scaleLinear()
            .range([HEIGHT - MARGINS.top, MARGINS.bottom])
            .domain([0, yMax]),
        xAxis = d3.axisBottom(xRange);
        yAxis = d3.axisRight(yRange);

        // Labels and axes
        vis.append("text")
            .attr("x", function(d) { return xRange(0); })
            .attr("y", function(d) { return 411})
            .text( function (d) { return "Distance from mismatch (kilobases)" })
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
        vis.append("text")
            .attr("x", function(d) { return 0; })
            .attr("y", function(d) {return 200 })
            .text( function (d) { return "Frequency" })
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("transform", "rotate(-90)translate(-220,-170)")
        vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
        .call(xAxis);
        vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        .call(yAxis);

    // Drawing itself
    for (let h = 0; h < xes.length; h++){
        var dataD3CanRead = []
        for (let i = 0; i < xes[h].length; i++){
            dataD3CanRead.push({x: xes[h][i], y: ys[h][i]});
        }
        var lineData = dataD3CanRead;
        var lineFunc = d3.line()
            .x(function(d) { return xRange(d.x);})
            .y(function(d) { return yRange(d.y);});
        vis.append('svg:path')
            .attr('d', lineFunc(lineData))
            .attr('stroke', colorDict[h])
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    }
}

function mainLineGraph(dataIn){
    var dataPerProtein = [];
    for (let i = 0; i < dataIn.maxNumberOfProteins; i++) {
        dataPerProtein.push([]);
    }
    // While determining the min/max position values, get the positions in a form of datapoint per protein
    for (let key in dataIn.data){
        let i = 0;
        for (let protein in dataIn.data[key].positions){
            let myPosition = dataIn.data[key].positions[protein].position/100; // Note division by 100
            if (myPosition > maxValue){
                maxValue = myPosition;
            }
            if (myPosition < minValue){
                minValue = myPosition;
            }
            dataPerProtein[i].push(myPosition); 
            i++;
        }
    }
    drawLineGraph(dataPerProtein);

}
