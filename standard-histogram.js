var maxValue = 0;
var minValue = 0;
var colorDict = ["red", "blue", "black", "green", "purple"]




function Pair(first, second){
    this.first = first;
    this.second = second;
}

function makeOverlapCorrect(dataPerProtein){
    var dataAsPair = []
    for(let i = 0; i < dataPerProtein.length; i++){
        dataAsPair.push([])
        for(let j = 0; j < dataPerProtein[i].length; j++){
            dataAsPair[i][j] = new Pair(dataPerProtein[i][j], i);
        }
    }

}

function makeBinsHelper(positionData){
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

function makeBins(positionData, i){
    var allBins = []
    for (let i = 0; i < positionData.length; i++){
        allBins.push([]);
        var bins = makeBinsHelper(positionData[i]);
        for (let j = 0; j < bins.length; j++){
            allBins[i][j] = new Pair(bins[j].length, i);
        }
    }
    var sortedBins = [];
    for (let i = 0; i < allBins[0].length; i++){
        sortedBins.push([]);
    }
    for (let i = 0; i < allBins.length; i++){
        for (let j = 0; j < allBins[i].length; j++){
            sortedBins[j][i] = allBins[i][j];
        }
    }
    for (let i = 0; i < sortedBins.length; i++){
        sortedBins[i].sort(function(e){return e.first});
    }
    return sortedBins;
}

function drawHistogramOnScreen(sortedBins, extraDataForXScaling){
    var formatCount = d3.format(",.0f");
    var svg = d3.select("svg");
    var margin = {top: 10, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([0, width])

    var binsForFitting = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(50))
        (extraDataForXScaling);

    var maxY = 0;
    for (let i = 0; i < sortedBins.length; i++){
        for (let j = 0; j < sortedBins[i].length; j++){
            if (sortedBins[i][j].first > maxY){
                maxY = sortedBins[i][j].first;
            }
        }
    }

    sortedBinsTranspose = [];
    for (let i = 0; i < sortedBins[0].length; i++){
        sortedBinsTranspose.push([]);
    }
    for (let i = 0; i < sortedBins.length; i++){
        for (let j = 0; j < sortedBins[i].length; j++){
            sortedBinsTranspose[j][i] = sortedBins[i][j];
        }
    }

    var y = d3.scaleLinear()
              .domain([0, maxY])
              .range([height, 0]);

    for (let h = 3; h < sortedBinsTranspose.length; h++){
        var bar = g.selectAll(".bar")
                .data(binsForFitting)
                .enter().append("g")
                .attr("class", "bar")
                .attr("transform", function(d, i) { console.log(y(sortedBinsTranspose[h][i].first)); return "translate(" + x(d.x0) + "," + y(sortedBinsTranspose[h][i].first) + ")"; })
                .style("fill", function(d, i){var color = colorDict[sortedBinsTranspose[h][i].second]; console.log(color); return color});

        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(binsForFitting[0].x1) - x(binsForFitting[0].x0) - 1)
            .attr("height", function(d, i) { return height - y(sortedBinsTranspose[h][i].first); });

        g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    }
}

function drawHistogram(dataPerProtein){
    var sortedBins = makeBins(dataPerProtein);
    drawHistogramOnScreen(sortedBins, dataPerProtein[1]);
}

//--------------------- Line graph -----------------------------------------------------------------------------------------------------------------//
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

    for (let h = 0; h < xes.length; h++){
        var dataD3CanRead = []
        for (let i = 0; i < xes[h].length; i++){
            dataD3CanRead.push({x: xes[h][i], y: ys[h][i]});
        }

        console.log(dataD3CanRead);

        var lineData = dataD3CanRead;

        var vis = d3.select('#visualisation'),
        WIDTH = 1000,
        HEIGHT = 500,
        MARGINS = {
          top: 20,
          right: 20,
          bottom: 20,
          left: 50
        },
        xRange = d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(lineData, function(d) {
          return d.x;
        }), d3.max(lineData, function(d) {
          return d.x;
        })]),
        yRange = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(lineData, function(d) {
          return d.y;
        }), d3.max(lineData, function(d) {
          return d.y;
        })]),
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

        var lineFunc = d3.line()
      .x(function(d) {
        return xRange(d.x);
      })
      .y(function(d) {
        return yRange(d.y);
      })

      vis.append('svg:path')
      .attr('d', lineFunc(lineData))
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
    }
}

function main(dataIn){
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
