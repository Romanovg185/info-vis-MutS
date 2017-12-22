function drawLineGraphSpacetime(dataPerProtein, tMin, tMax){
    var bins = [];
    dataPerProtein.forEach(function(el){bins.push(makeBinsLineGraph(el))});
    var xyData = getXYValuesLineGraph(bins);
    var xes = [];
    var ys = [];
    for (let i = 0; i < dataPerProtein.length; i++){
        xes.push([]);
        ys.push([]);
        for(let j = 0; j < dataPerProtein[i].length; j++){
            xes[i].push(dataPerProtein[i][j].p);
            ys[i].push(dataPerProtein[i][j].t);
        }
    }

    // Set to the highest/lowest value a 32 bit int can contain
    var xMin = 4294967295;
    var xMax = -4294967295;
    var yMin = 4294967295;
    var yMax = -4294967295;

    // Something went wrong with the y axis (probably lexographical comparison of strings instead of numerical comparison
    // So we did it the hard way...
    xes.forEach(function(el){xMin = d3.min(el) < xMin ? d3.min(el) : xMin});
    xes.forEach(function(el){xMax = d3.max(el) > xMax ? d3.max(el) : xMax});
    for(let i = 0; i < ys.length; i++){
        for(let j = 0; j < ys[i].length; j++){
            if(parseFloat(ys[i][j]) < yMin){
                yMin = parseFloat(ys[i][j]);
            }
            if(parseFloat(ys[i][j]) > yMax){
                yMax = parseFloat(ys[i][j]);
            }
        }
    }

    // Initialize the variables
    var vis = d3.select('#spaceTime'),
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
            .domain([yMin, yMax]),
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
            .text( function (d) { return "Time (seconds)" })
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

    // Drawing happens here
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

function mainLineGraphSpacetime(dataIn, tMin, tMax){
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
            dataPerProtein[i].push({t: key, p:myPosition}); 
            i++;
        }
    }
    for(let i = 0; i < dataPerProtein.length; i++){
        dataPerProtein[i].sort(function(a,b){return a.t-b.t});
    }
    drawLineGraphSpacetime(dataPerProtein, tMin, tMax);

}
