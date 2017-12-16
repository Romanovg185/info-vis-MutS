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
        .thresholds(x.ticks(50))
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
    console.log(dataPerProtein);
    var bins = [];
    dataPerProtein.forEach(function(el){bins.push(makeBinsLineGraph(el))});
    var xyData = getXYValuesLineGraph(bins);
    var xes = xyData[0];
    var ys = xyData[1];

    var xMin = 4294967295;
    var xMax = -4294967295;
    var yMax = 0;

    xes.forEach(function(el){xMin = d3.min(el) < xMin ? d3.min(el) : xMin});
    xes.forEach(function(el){xMax = d3.max(el) > xMax ? d3.max(el) : xMax});
    ys.forEach(function(el){yMax = d3.max(el) > yMax ? d3.max(el) : yMax});

    var vis = d3.select('#visualisation'),
        WIDTH = 1000,
        HEIGHT = 500,
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
        xAxis = d3.axisBottom(xRange).tickFormat(function(d){ return d.x;});
        yAxis = d3.axisRight(yRange);

        vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
        .call(xAxis);

        vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        .call(yAxis);


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
    drawLineGraph(dataPerProtein);

}
