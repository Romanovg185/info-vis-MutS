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

// Simply encapsulate a loop
function makeSimulation(myLog){
	var largeArray = myLog.split('\n');
	var simulation = new Array();
	// Ignore last one since it is apparently empty
	for (var i = 0; i < largeArray.length-1; i++) {
		simulation.push(makeDataPoint(largeArray[i].split(',')));
	}
	return simulation;
};

// Using the new HTML5 FileReader feature
function readFile(file, i) {
    var myReader = new FileReader();
  	myReader.readAsText(file);
  	myReader.onload = function(e) {
    	var rawLog = myReader.result;
      	data[i] = new DataList(makeSimulation(rawLog));
    }
};

// Gets the files and passes them to the FileReader
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

    var tb_c = d3.select("#Legend_cont")
   			.append("table");

   	var tb = tb_c.selectAll("table")
   			.data(sPT)
   			.enter().append("tr")
   			.attr("class", "legend-tr")
   			.attr("id", function(d, i){ return String(colorDict[i]);})
   			.attr("style", function(d, i){ return "background: "+String(colorDict[i])+"; margin: 5px;";});

	var tt = tb.append("text")
			.attr("style", "font-family: sans-serif;" )
			.attr("style", "font-size: 12px;" )
			.attr("style", "fill: black" )
			.attr("class", "legendtext")
			.text(function(d, i){
				var ptxt = "Protein ";
				var protein_no = String(i);
				var divmarker =  " | ";
				var color_str = String(colorDict[i]);
				return ptxt+protein_no+divmarker+color_str;});

}
	

function Legend_Update(b){
	var color_set = [];
	var color_select = [];

	var reset_opacity = d3.selectAll(".legend-tr")._groups[0];
	var output_r = [];
	reset_opacity.forEach(function(d){
   		let polm = "#";
   		let kleur = String(d.id);
   		output_r.push(polm+kleur);
   		let sel_id = d3.select(polm+kleur)
   			.attr("style", "opacity: 0.2; background: "+kleur+";");
	});

	var SVGs = d3.selectAll(".plots");
	console.log(SVGs);

	var subSVG = SVGs.selectAll("*");
	// console.log(subSVG);
	if (isDataCircular){
		var svg_obj_arr = subSVG._groups[3];
	} else {
		var svg_obj_arr = subSVG._groups[1];
	}
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
   			.attr("style", "opacity: 1; background: "+kleur+";");
   	});

}





// Checks if a file has been obtained
document.getElementById('files').addEventListener('change', handleFileSelect, false);

// initiate slider after clicking on Histogram button 
document.getElementById("clickMeHist").onclick = function(){
	// Asking for [0] happens because a person could accidentally insert multiple files
	// The first one is taken in that case
	tmin = data[0].tmin(); // Create new tmin and tmax values
	tmax = data[0].tmax();
	if (legend_status == true){
		Initial_Legend(data[0]);
		legend_status = false;
	}
	$("#slider-value").trigger('change'); // Initiates slider after event change
}

// Button for circular DNA
document.getElementById("clickMeCircle").onclick = function() {
	isDataCircular = true;
    var mySVG = document.getElementById("circleDiv");
    mySVG.style.display="inline";
    var mySVG = document.getElementById("lineDiv");
    mySVG.style.display="none";
	master(null, null);
}

// Button for linear DNA
document.getElementById("clickMeLine").onclick = function() {
	isDataCircular = false;
    var mySVG = document.getElementById("circleDiv");
    mySVG.style.display="none";
    var mySVG = document.getElementById("lineDiv");
    mySVG.style.display="inline";
	master(null, null)
}

// Change globals if button changes for all four buttons
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
			step: 0.01,
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
    var dataToPlot = data[0].timeIntervalSlice(
		$( "#slider-range" ).slider( "values", 0 ),
		$( "#slider-range" ).slider( "values", 1 )
		);
    var statesOfRelevance = []
    isShowingStates.forEach(function(el, i){if(el == true)statesOfRelevance.push(i);});
    dataToPlot = dataToPlot.stateSlice(statesOfRelevance);
	// Remove previous plot from the svg
	d3.select("#spaceTime").selectAll("*").remove(); 
	d3.select('#linePlot').selectAll("*").remove();
    d3.select("#cSpaceTime").selectAll("*").remove(); 
	d3.select('#cLinePlot').selectAll("*").remove();
	if(isDataCircular){
        mainCircularHistogram(dataToPlot);
        mainCircularHistogramSpacetime(dataToPlot, $( "#slider-range" ).slider( "values", 0 ), $( "#slider-range" ).slider( "values", 1 ));
	} else {
	    mainLineGraph(dataToPlot);
        mainLineGraphSpacetime(dataToPlot, $( "#slider-range" ).slider( "values", 0 ), $( "#slider-range" ).slider( "values", 1 ));
	}
	console.log(Legend_Update(true));
}


$( "#slider-range" ).on( "slidestop", master);
