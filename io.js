var data = new Array
var tmin = 0.0
var tmax = 30.0
var isShowingStates = [true, true, true, true]

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
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    for (var i = 0; i < files.length; i++) {
        myFile = files.item(i);
        readFile(myFile, i);
    }
};


// done by using the JQuery and Jquery-IO library


document.getElementById('files').addEventListener('change', handleFileSelect, false);

// initiate slider after clicking on Histogram button TODO improve UI
document.getElementById("clickMeHist").onclick = function() {

	tmin = data[0].tmin(); // create new tmin and tmax values
	tmax = data[0].tmax();
	$( "#slider-value").trigger('change'); // initiates slider after event change


}

document.getElementById("clickMeCircHist").onclick = function() {
	var bar = data[0].timeIntervalSlice(3, 18);
	mainCircularHistogram(bar);
}

document.getElementById("clickMeLine").onclick = function() {
	var foo = data[0].timeIntervalSlice(5, 15);
	mainLineGraph(foo);
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
			step: 0.01,
			values: [ 5, 15 ],
			slide: function( event, ui ) {
				$( "#timerange" ).val( "t1 = " + ui.values[ 0 ] + " and t2 =" + ui.values[ 1 ] );
			},
			stop: function( event, ui ) {
			}
		});

		$( "#timerange" ).val( "t1 = " + $( "#slider-range" ).slider( "values", 0 ) +
			" and t2 = " + $( "#slider-range" ).slider( "values", 1 ) );

	} );
} );

// Master function called on change slider or change checkbox
function master(event, ui){
    var foo = data[0].timeIntervalSlice(
		$( "#slider-range" ).slider( "values", 0 ),
		$( "#slider-range" ).slider( "values", 1 )
		);
    console.log(foo.data[18]);
    var statesOfRelevance = []
    isShowingStates.forEach(function(el, i){if(el == true)statesOfRelevance.push(i);});
    foo = foo.stateSlice(statesOfRelevance);
    console.log(foo.data[18]);
	d3.select("#circHist").selectAll("*").remove(); // TODO does not work properly for the circular histogram
	d3.select('#visualisation').selectAll("*").remove();
	mainCircularHistogram(foo);
	mainLineGraph(foo);
}


$( "#slider-range" ).on( "slidestop", master
	);
