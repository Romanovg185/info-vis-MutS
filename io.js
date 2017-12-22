var data = new Array;
var tmin = 0.0;
var tmax = 30.0;
var isShowingStates = [true, true, true, true];
var isDataCircular = false;
var numBinsHistogram = 50;
var numBinsCircularHistogram = 50;
var showingProteins = [];
var n_max_protein = 0;
var legend_status = true;
var colorDict = ["pink", "purple", "blue", "lightblue", "green", "yellow", "orange", "red"];

// Generates a datapoint from a line in the preprocessed code
// using the constructor from data-point-classdef.js
function makeDataPoint(ts){
	var timeStamp = ts[0];
	var nGATC = Number(ts[1]);
	var nProt = Number(ts[2]);
	var states = new Array();
	for (var i = 3; i < 3+nGATC; i++){
		states.push(ts[i]);
	}
	var positions = new Array();
	for (var i = 3+nGATC; i < ts.length; i++){
		positions.push(ts[i]);
	}
	var timeStep = new DataPoint(timeStamp, nGATC, nProt, states, positions);
	return timeStep;
};

function makeSimulation(myLog){
	var largeArray = myLog.split('\n');
	var simulation = new Array();
	// Ignore last one since it is apparently empty
	for (var i = 0; i < largeArray.length-1; i++) {
		simulation.push(makeDataPoint(largeArray[i].split(',')));
	}
	return simulation;
};

function readFile(file, i) {
    var myReader = new FileReader();
  	myReader.readAsText(file);
  	myReader.onload = function(e) {
    	var rawLog = myReader.result;
      	data[i] = new DataList(makeSimulation(rawLog));
    }
};

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    for (var i = 0; i < files.length; i++) {
        myFile = files.item(i);
        readFile(myFile, i);
    }
};

function Initial_Legend(d_o) {
	showingProteins = [];
	n_max_protein = findMaxNumberOfProteins(d_o);
	var svg_leg = d3.select("#LegendaPlot");
	for (var i = 0; i < n_max_protein; i++) {
		showingProteins.push(true);
	}
	var sPT =  d3.zip(showingProteins)
	// var ts = d3.select("#Legend_cont")
 //  			.append("svg")
 //  			.attr("position", "relative")
 //  			.attr("height", 800)
 //  			.attr("left", 1)
 //  			.attr("width", 100);
  			
 //  	var tg = ts.selectAll("svg")
 //  			.data(sPT)
 //  			.enter().append("g")
 //    		.attr("class", "legendrect")
 //    		.attr("float", "left");

    var tb_c = d3.select("#Legend_cont")
   			.append("table")
   			.attr("right", 10);


   	var tb = tb_c.selectAll("table")
   			.data(sPT)
   			.enter().append("tr")
   			.attr("class", "legend-tr")
   			.attr("id", function(d, i){ return String(colorDict[i]);})
   			.attr("style", function(d, i){ return "background: "+String(colorDict[i])+";";});

	var tt = tb.append("text")
			// .attr("x", 300)
			// .attr("y", function(d, i){ return i*30;})
			// .attr("dy", 40)
			.attr("style", "font-family: sans-serif;" )
			.attr("style", "font-size: 12px;" )
			.attr("style", "fill: black" )
			// .attr("position", "relative")
			.attr("class", "legendtext")
			.text(function(d, i){
				var ptxt = "Protein ";
				var protein_no = String(i);
				var divmarker =  " | ";
				var color_str = String(colorDict[i]);
				return ptxt+protein_no+divmarker+color_str;});

    // tg.append("rect")
    //     	.attr("x", 10)
    // 		.attr("y", function(d, i){ return i*30;})
    // 		.attr("position", "relative")
    // 		.attr("width", 80)
    // 		.attr("height", 20)
    // 		.attr("fill", function(d, i){ return String(colorDict[i]);});

}
	

function Legend_Update(b){
	var color_set = [];
	var color_select = [];
	var nodes = [];
	var SVGs = d3.selectAll(".plots");
	for (let node in SVGs.entries) {
		nodes.push(node);
	};
	console.log(nodes)
	var subSVG = SVGs.selectAll("*");
	// console.log(subSVG);
	var svg_obj_arr = subSVG._groups[0];
	console.log(svg_obj_arr);
	svg_obj_arr.forEach(function(d){
		var stroke_color = d3.select(d).attr("stroke");
   		color_select.push(stroke_color);
   	});

   	for (let i in color_select){
   		let clr = color_select[i];
   		if (clr != null && clr != 0 && clr != "#000"){
			color_set.push(clr);
   		} else {
   			continue;
   		};
   	}
   	console.log(color_set);
   	var really_a_set = new Set(color_set);
   	var output_c = [];
   	// var back_to_array = Array(really_a_set)
   	really_a_set.forEach(function(d){
   		let polm = "#";
   		let kleur = String(d);
   		output_c.push(polm+kleur);
   		let sel_id = d3.select(polm+kleur)
   			.attr("style", "opacity: 0");
   	});

}






document.getElementById('files').addEventListener('change', handleFileSelect, false);

// initiate slider after clicking on Histogram button TODO improve UI
document.getElementById("clickMeHist").onclick = function(){
	tmin = data[0].tmin(); // create new tmin and tmax values
	tmax = data[0].tmax();
	if (legend_status == true){
		Initial_Legend(data[0]);
		legend_status = false;
	}
	$("#slider-value").trigger('change'); // initiates slider after event change
}

document.getElementById("clickMeCircle").onclick = function() {
	isDataCircular = true;
    var mySVG = document.getElementById("circleDiv");
    mySVG.style.display="inline";
    var mySVG = document.getElementById("lineDiv");
    mySVG.style.display="none";
	master(null, null);
}

document.getElementById("clickMeLine").onclick = function() {
	isDataCircular = false;
    var mySVG = document.getElementById("circleDiv");
    mySVG.style.display="none";
    var mySVG = document.getElementById("lineDiv");
    mySVG.style.display="inline";
	master(null, null)
}
// Change globals if button changes
document.getElementById('boxZero').onclick = function() {
    if (this.checked){
        isShowingStates[0] = true;
    } else {
        isShowingStates[0] = false;
    }
    master(null, null);
}

document.getElementById('boxOne').onclick = function() {
    if (this.checked){
        isShowingStates[1] = true;
    } else {
        isShowingStates[1] = false;
    }
    master(null, null);
}

document.getElementById('boxTwo').onclick = function() {
    if (this.checked){
        isShowingStates[2] = true;
    } else {
        isShowingStates[2] = false;
    }
    master(null, null);
}

document.getElementById('boxThree').onclick = function() {
    if (this.checked){
        isShowingStates[3] = true;
    } else {
        isShowingStates[3] = false;
    }
    master(null, null);
}

//jquery eventlistener
$( "#slider-value").on( "change", function( event, ui, data) {
	$( function() {
		$( "#slider-range" ).slider({
			range: true,
			min: tmin,
			max: tmax,
			values: [ 3, 18 ],
			slide: function( event, ui ) {
				$( "#timerange" ).val( "[ t1 = " + ui.values[ 0 ] + " , and t2 = " + ui.values[ 1 ] + " ] ");
			},
			stop: function( event, ui ) {
			}
		});

		$( "#timerange" ).val( "t1 = " + $( "#slider-range" ).slider( "values", 0 ) +
			" and t2 = " + $( "#slider-range" ).slider( "values", 1 ) );

	} );
} );

$(".legend-tr").on("change", function(){ console.log("event");});



// Master function called on change slider or change checkbox
function master(event, ui){
    numBinsHistogram = parseInt(document.getElementById('numBins').value);
    numBinsCircularHistogram = numBinsHistogram;
    var foo = data[0].timeIntervalSlice(
		$( "#slider-range" ).slider( "values", 0 ),
		$( "#slider-range" ).slider( "values", 1 )
		);
    var statesOfRelevance = []
    isShowingStates.forEach(function(el, i){if(el == true)statesOfRelevance.push(i);});
    foo = foo.stateSlice(statesOfRelevance);
	d3.select("#spaceTime").selectAll("*").remove(); // TODO does not work properly for the circular histogram
	d3.select('#linePlot').selectAll("*").remove();
    d3.select("#cSpaceTime").selectAll("*").remove(); // TODO does not work properly for the circular histogram
	d3.select('#cLinePlot').selectAll("*").remove();
	if(isDataCircular){
        mainCircularHistogram(foo);
        mainCircularHistogramSpacetime(foo, $( "#slider-range" ).slider( "values", 0 ), $( "#slider-range" ).slider( "values", 1 ));
	} else {
	    mainLineGraph(foo);
        mainLineGraphSpacetime(foo, $( "#slider-range" ).slider( "values", 0 ), $( "#slider-range" ).slider( "values", 1 ));
	}
	console.log(Legend_Update(true));
}


$( "#slider-range" ).on( "slidestop", master);
