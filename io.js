var data = new Array

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

document.getElementById('files').addEventListener('change', handleFileSelect, false);



document.getElementById("clickMe").onclick = function() {
	var foo = data[0].timeIntervalSlice(18, 20);
	main(foo);
}