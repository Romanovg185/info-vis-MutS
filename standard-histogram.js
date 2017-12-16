var maxValue = 0;
var minValue = 0;
var colorDict = ["purple", "blue", "green", "red"]




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
    var bar = g.selectAll(".bar")
                .data(binsForFitting)
                .enter().append("g")
                .attr("class", "bar");

    for (var h = sortedBinsTranspose.length - 4; h > 0; h--){
        for (var i  = 0; i < sortedBinsTranspose[h].length; i++){
            console.log(sortedBinsTranspose[h][i].second)
        }
        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(binsForFitting[0].x1) - x(binsForFitting[0].x0) - 1)
            .attr("height", function(d, i) { return height - y(sortedBinsTranspose[h][i].first); })
            .attr("transform", function(d, i) {; return "translate(" + x(d.x0) + "," + y(sortedBinsTranspose[h][i].first) + ")"; })
            .style("fill", function(d, i){var color = colorDict[sortedBinsTranspose[h][i].second]; return color});

    }

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
}

function drawHistogram(dataPerProtein){
    var sortedBins = makeBins(dataPerProtein);
    drawHistogramOnScreen(sortedBins, dataPerProtein[1]);
}

function mainHistogram(dataIn){
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
    drawHistogram(dataPerProtein);

}
