var data = new Array();

function pushToData(myLog){
	console.log(myLog);
	data.push(myLog);
};

function readFile(file) {
    var myReader = new FileReader();
  	myReader.readAsText(file);
  	myReader.onload = function(e) {
    	var rawLog = myReader.result;
      	pushToData(rawLog);
  	};
} 

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    for (var i = 0; i < files.length; i++) {
        myFile = files.item(i);
        readFile(myFile);
    }
    console.log(data);
};

document.getElementById('files').addEventListener('change', handleFileSelect, false);
